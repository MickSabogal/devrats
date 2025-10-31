import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Post from "@/models/Post";

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (post.user.toString() !== session.user.id) {
      return NextResponse.json({ message: "You are not allowed to delete this post" }, { status: 403 });
    }

    await post.deleteOne();

    return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}