import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Job from "@/lib/models/Job";

export const dynamic = "force-dynamic";

// Smart matching heuristic (Lightweight local NLP context matcher)
const smartMatch = (rewardText, needText) => {
  if (!rewardText || !needText) return false;

  // Common words we want the matching engine to ignore (Stop Words)
  const stopWords = new Set([
    "a",
    "an",
    "the",
    "and",
    "or",
    "but",
    "is",
    "are",
    "am",
    "will",
    "can",
    "to",
    "for",
    "with",
    "in",
    "on",
    "at",
    "by",
    "some",
    "any",
    "i",
    "you",
    "we",
    "they",
    "he",
    "she",
    "it",
    "my",
    "your",
    "give",
    "need",
    "want",
    "return",
    "help",
    "offer",
    "provide",
    "this",
    "that",
    "looking",
    "someone",
    "please",
    "anyone",
    "has",
    "have",
    "do",
    "does",
    "like",
    "just"
  ]);

  // Strip punctuation, split into lowercase words, ignore stop words and very short words
  const getWords = (str) =>
    str
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .split(/\s+/)
      .filter((w) => w.length > 1 && !stopWords.has(w));

  const rewardWords = getWords(rewardText);
  const needWords = getWords(needText);

  // Find if at least one meaningful keyword overlaps between the reward and the need
  return (
    rewardWords.length > 0 && rewardWords.some((rw) => needWords.includes(rw))
  );
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
    // Fetch user's active jobs
    const myJobs = await Job.find({
      postedBy: session.user.id,
      status: "open",
    }).lean();

    // Fetch nearby open jobs (excluding user's own)
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

    const matches = [];

    myJobs.forEach((mJob) => {
      nearbyJobs.forEach((bJob) => {
        const myReward = mJob.reward || "";
        const theirReward = bJob.reward || "";
        const myNeed = `${mJob.title || ""} ${mJob.description || ""}`;
        const theirNeed = `${bJob.title || ""} ${bJob.description || ""}`;

        const iCanHelpThem = myReward && smartMatch(myReward, theirNeed);
        const theyCanHelpMe = theirReward && smartMatch(theirReward, myNeed);
        
        // Fallback: If both users have similar needs/titles, suggest they collaborate
        const sharedNeed = smartMatch(myNeed, theirNeed);

        if (iCanHelpThem || theyCanHelpMe || sharedNeed) {
          let reasonText = "";
          if (iCanHelpThem) reasonText = `Your return "${myReward}" matches what they need!`;
          else if (theyCanHelpMe) reasonText = `Their return "${theirReward}" matches what you need!`;
          else reasonText = `You both are looking for similar things! Maybe you can team up?`;

          matches.push({
            id: `${mJob._id}-${bJob._id}`,
            myJob: mJob,
            theirJob: bJob,
            reason: reasonText,
          });
        }
      });
    });

    return NextResponse.json({ matches }, { status: 200 });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 },
    );
  }
}
