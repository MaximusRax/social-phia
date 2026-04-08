import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Job from "@/lib/models/Job";

export const dynamic = "force-dynamic";

const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0 || vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const { searchParams } = new URL(req.url);
  const lng = parseFloat(searchParams.get("lng"));
  const lat = parseFloat(searchParams.get("lat"));
  const radiusKm = parseFloat(searchParams.get("radius")) || 5;

  if (isNaN(lng) || isNaN(lat)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  try {
    const myJobs = await Job.find({
      postedBy: session.user.id,
      status: "open",
    }).lean();

    const nearbyJobs = await Job.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: radiusKm * 1000,
        },
      },
      status: "open",
      postedBy: { $ne: session.user.id },
    })
      .populate("postedBy", "name")
      .lean();

    console.log(`\n[Suggestions] Found ${myJobs.length} active jobs for you.`);
    console.log(`[Suggestions] Found ${nearbyJobs.length} nearby jobs from neighbors.`);

    const matches = [];

    myJobs.forEach((mJob) => {
      if (!mJob.embedding || mJob.embedding.length === 0) {
        console.log(`[Suggestions] ⚠️ Skipping your job "${mJob.title}" - No AI embedding found.`);
        return;
      }

      nearbyJobs.forEach((bJob) => {
        if (!bJob.embedding || bJob.embedding.length === 0) {
          console.log(`[Suggestions] ⚠️ Skipping neighbor job "${bJob.title}" - No AI embedding found.`);
          return;
        }

        const similarity = cosineSimilarity(mJob.embedding, bJob.embedding);
        
        console.log(`[Suggestions] Similarity between "${mJob.title}" and "${bJob.title}" = ${similarity.toFixed(3)}`);

        if (similarity > 0.45) {
          const matchPercentage = Math.round(similarity * 100);

          matches.push({
            id: `${mJob._id}-${bJob._id}`,
            myJob: mJob,
            theirJob: bJob,
            reason: `High compatibility! We found a ${matchPercentage}% semantic match based on your needs and offers.`,
            score: similarity
          });
        }
      });
    });

    matches.sort((a, b) => b.score - a.score);

    return NextResponse.json({ matches }, { status: 200 });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 },
    );
  }
}
