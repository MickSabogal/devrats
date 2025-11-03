import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Group from "@/models/Group";
import Post from "@/models/Post";
import Comment from "@/models/Comment";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { groupId, postId } = await params;

    const group = await Group.findById(groupId);
    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    const post = await Post.findById(postId).populate({
      path: "comments",
      populate: { path: "user", select: "name avatar" },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Comments fetched successfully", comments: post.comments },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /group/[groupId]/post/[postId]/comment error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { groupId, postId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { text } = await req.json();

    if (!text || text.trim() === "") {
      return NextResponse.json({ message: "Comment text is required" }, { status: 400 });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const comment = await Comment.create({
      user: session.user.id,
      post: postId,
      text,
    });

    post.comments.push(comment._id);
    await post.save();

    return NextResponse.json(
      { message: "Comment created successfully", comment },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /group/[groupId]/post/[postId]/comment error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
