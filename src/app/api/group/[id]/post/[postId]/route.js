import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Post from "@/models/Post";
import Group from "@/models/Group";

// GET — fetch a single post within a group
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { groupId, postId } = await params;

    // Verify group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    // Find post
    const post = await Post.findById(postId)
      .populate("user", "name avatar")
      .populate("comments")
      .populate("reactions");

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Post fetched successfully", post }, { status: 200 });
  } catch (err) {
    console.error("GET /group/[groupId]/post/[postId] error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}

// PUT — update a post
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { groupId, postId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Only post owner can update
    if (post.user.toString() !== session.user.id) {
      return NextResponse.json({ message: "You are not allowed to edit this post" }, { status: 403 });
    }

    const { title, image, content } = await req.json();

    // Validate mandatory fields
    if (!title || !image) {
      return NextResponse.json({ message: "Title and image are required" }, { status: 400 });
    }

    post.title = title;
    post.image = image;
    if (content) post.content = content;

    await post.save();

    return NextResponse.json({ message: "Post updated successfully", post }, { status: 200 });
  } catch (err) {
    console.error("PUT /group/[groupId]/post/[postId] error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}

// DELETE — delete a post
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { groupId, postId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Only post owner can delete
    if (post.user.toString() !== session.user.id) {
      return NextResponse.json({ message: "You are not allowed to delete this post" }, { status: 403 });
    }

    await post.deleteOne();

    return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("DELETE /group/[groupId]/post/[postId] error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}