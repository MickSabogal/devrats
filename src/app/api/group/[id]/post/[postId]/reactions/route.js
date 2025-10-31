import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Post from "@/models/Post";
import Reaction from "@/models/Reaction";

// GET — List all reactions for a post
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { postId } = params;

    const reactions = await Reaction.find({ post: postId })
      .populate("user", "name avatar");

    return NextResponse.json(
      { message: "Reactions fetched successfully", reactions },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /group/[groupId]/post/[postId]/reaction error:", err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// POST — Create a new reaction
export async function POST(req, { params }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { postId } = params;
    const userId = session.user.id;
    const { type } = await req.json();

    // Validate reaction type
    if (!type || type.trim() === "") {
      return NextResponse.json(
        { message: "Reaction type is required" },
        { status: 400 }
      );
    }

    // Make sure post exists
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Check if user already reacted
    const existingReaction = await Reaction.findOne({ post: postId, user: userId });
    if (existingReaction) {
      return NextResponse.json(
        { message: "You already reacted to this post" },
        { status: 400 }
      );
    }

    const newReaction = new Reaction({
      user: userId,
      post: postId,
      type,
    });

    await newReaction.save();

    return NextResponse.json(
      { message: "Reaction added successfully", reaction: newReaction },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /group/[groupId]/post/[postId]/reaction error:", err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
