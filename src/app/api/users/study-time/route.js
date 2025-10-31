// src/app/api/users/[id]/study-time/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const posts = await Post.find({ user: id }).select("duration");
    
    const totalMinutes = posts.reduce((sum, post) => sum + (post.duration || 0), 0);

    return NextResponse.json({ totalMinutes }, { status: 200 });
  } catch (error) {
    console.error("Error calculating study time:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}