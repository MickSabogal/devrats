import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Post from "@/models/Post";
import Group from "@/models/Group";

// GET — List all posts in a specific group (supports pagination)
export async function GET(req, { params }) {
  try {
    const { groupId } = params;

    await connectDB();

    const group = await Group.findById(groupId);
    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ group: groupId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments({ group: groupId });

    return NextResponse.json({
      message: "Group posts fetched successfully",
      page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      posts,
    }, { status: 200 });

  } catch (err) {
    console.error("GET /group/[groupId]/post error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// POST — Create a new post in a specific group (requires title and image)
export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { groupId } = params;
    const { title, image } = await req.json(); // Title and image are required
    const userId = session.user.id;

    if (!title || !image) {
      return NextResponse.json({ message: "Both title and image are required" }, { status: 400 });
    }

    await connectDB();

    const group = await Group.findById(groupId);
    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    const isMember = group.members.some(m => m.user.toString() === userId);
    if (!isMember) {
      return NextResponse.json({ message: "You are not a member of this group" }, { status: 403 });
    }

    const newPost = new Post({
      title,
      image,
      user: userId,
      group: groupId,
    });

    await newPost.save();
    await newPost.populate("user", "name avatar");

    return NextResponse.json({ message: "Post created successfully", post: newPost }, { status: 201 });

  } catch (err) {
    console.error("POST /group/[groupId]/post error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
