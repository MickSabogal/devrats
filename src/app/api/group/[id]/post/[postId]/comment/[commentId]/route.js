import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Group from "@/models/Group";
import Post from "@/models/Post";
import Comment from "@/models/Comment";

// PUT — update a specific comment
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { groupId, postId, commentId } = params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { text } = await req.json();

    if (!text || text.trim() === "") {
      return NextResponse.json({ message: "Comment text is required" }, { status: 400 });
    }

    // Check group, post, and comment existence
    const group = await Group.findById(groupId);
    if (!group) return NextResponse.json({ message: "Group not found" }, { status: 404 });

    const post = await Post.findById(postId);
    if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });

    const comment = await Comment.findById(commentId);
    if (!comment) return NextResponse.json({ message: "Comment not found" }, { status: 404 });

    // Only comment owner can edit
    if (comment.user.toString() !== session.user.id) {
      return NextResponse.json({ message: "You are not allowed to edit this comment" }, { status: 403 });
    }

    comment.text = text;
    await comment.save();

    return NextResponse.json({ message: "Comment updated successfully", comment }, { status: 200 });
  } catch (err) {
    console.error("PUT /group/[groupId]/post/[postId]/comment/[commentId] error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}

// DELETE — delete a specific comment
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { groupId, postId, commentId } = params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check group, post, and comment existence
    const group = await Group.findById(groupId);
    if (!group) return NextResponse.json({ message: "Group not found" }, { status: 404 });

    const post = await Post.findById(postId);
    if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });

    const comment = await Comment.findById(commentId);
    if (!comment) return NextResponse.json({ message: "Comment not found" }, { status: 404 });

    // Only comment owner can delete
    if (comment.user.toString() !== session.user.id) {
      return NextResponse.json({ message: "You are not allowed to delete this comment" }, { status: 403 });
    }

    await comment.deleteOne();

    // Remove comment reference from post
    post.comments = post.comments.filter(
      (cId) => cId.toString() !== commentId
    );
    await post.save();

    return NextResponse.json({ message: "Comment deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("DELETE /group/[groupId]/post/[postId]/comment/[commentId] error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
