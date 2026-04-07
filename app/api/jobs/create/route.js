import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Import the options
import dbConnect from "@/lib/mongodb";
import Job from "@/lib/models/Job";
import User from "@/lib/models/User";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req) {
  try {
    // CRITICAL: Pass authOptions here so NextAuth can find the user ID
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized - No User ID" },
        { status: 401 },
      );
    }

    const { title, description, exchangeOffer, reward, range, coordinates } = await req.json();
    await dbConnect();

    // ... (Your location logic from before) ...
    let finalCoords = coordinates;
    if (!finalCoords) {
      const user = await User.findById(session.user.id);
      finalCoords = user.location.coordinates;
    }
    
    // Generate the Vector Embedding using Hugging Face Inference API
    let embedding = [];
    try {
      const textToEmbed = `Need: ${title}. Description: ${description}. Offering in return: ${reward || exchangeOffer || "Nothing specified"}`;
      
      const output = await hf.featureExtraction({
        model: "sentence-transformers/all-MiniLM-L6-v2",
        inputs: textToEmbed,
      });      // Safely extract the 1D embedding array whether it returns a 1D, 2D, or 3D array
      let extracted = output;
      while (Array.isArray(extracted) && Array.isArray(extracted[0])) {
        extracted = extracted[0];
        // console.log(extracted)
      }

      embedding = extracted;
      console.log(embedding);
      
    } catch (apiError) {
      console.error("Failed to generate embedding with HF Inference:", apiError);
    }

    const newJob = await Job.create({
      title,
      description,
      exchangeOffer,
      reward,
      range,
      postedBy: session.user.id, // This will now be defined!
      embedding, // Save the generated vector!
      location: {
        type: "Point",
        coordinates: finalCoords,
      },
    });

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
