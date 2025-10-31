import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Post from "@/models/Post";
import Group from "@/models/Group";

// ✅ GET — List all posts in a specific group (supports pagination)
export async function GET(req, { params }) {
  try {
    // ✅ Always await params in Next.js 15+ (prevents sync dynamic API warning)
    const { id } = await params;

    await connectDB();

    // Check if group exists
    const group = await Group.findById(id);
    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    // Handle pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // Fetch posts with user info populated
    const posts = await Post.find({ group: id })
      .populate("user", "name avatar") // ✅ include only the needed user fields
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments({ group: id });

    return NextResponse.json(
      {
        message: "Group posts fetched successfully",
        page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
        posts,
        success: true,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /group/[id]/post error:", err);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

// ✅ POST — Create a new post in a specific group
export async function POST(req, { params }) {
  try {
    // ✅ Get current authenticated user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Await params to comply with Next.js 15 dynamic API routes
    const { id } = await params;

    // Extract post data from request body
    const {
      title,
      content,
      image,
      eventDate,
      location,
      metrics,
    } = await req.json();

    const userId = session.user.id;

    // ✅ Validate required fields
    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if group exists
    const group = await Group.findById(id);
    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    // ✅ Ensure the user is a member of the group before posting
    const isMember = group.members.some((m) => m.user.toString() === userId);
    if (!isMember) {
      return NextResponse.json(
        { message: "You are not a member of this group" },
        { status: 403 }
      );
    }

    // ✅ Create a new post document
    const newPost = new Post({
      title,
      content: content || "",
      image: image || null,
      eventDate: eventDate ? new Date(eventDate) : null,
      location: location || "",
      metrics: metrics || {},
      user: userId,
      group: id,
    });

    // ✅ Save and populate user field properly
    const savedPost = await newPost.save();
    const populatedPost = await savedPost.populate({
      path: "user",
      select: "name avatar",
    });

    // ✅ Return the populated post as plain object (clean JSON)
    return NextResponse.json(
      {
        message: "Post created successfully",
        post: populatedPost.toObject(),
        success: true,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /group/[id]/post error:", err);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
