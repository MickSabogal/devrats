import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Post from "@/models/Post";
import Group from "@/models/Group";
import User from "@/models/User";

// ✅ GET — List posts from this group with pagination
export async function GET(req, { params }) {
  try {
    const { id } = await params;

    await connectDB();
    const group = await Group.findById(id);

    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ group: id })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments({ group: id });

    return NextResponse.json({
      success: true,
      page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      data: posts,
    });
  } catch (err) {
    console.error("GET /group/[id]/post error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

// ✅ POST — Create post & update streak + activity
export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, content, image, eventDate, location, metrics } = body;
    const userId = session.user.id;

    if (!title) {
      return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 });
    }

    await connectDB();

    const group = await Group.findById(id);
    if (!group) {
      return NextResponse.json({ success: false, message: "Group not found" }, { status: 404 });
    }

    const isMember =
      group.members.some((m) => m.user.toString() === userId) ||
      group.admin.toString() === userId;

    if (!isMember) {
      return NextResponse.json({ success: false, message: "You are not a member of this group" }, { status: 403 });
    }

    const postData = {
      title,
      content: content || "",
      image: image || null,
      eventDate: eventDate ? new Date(eventDate) : null,
      location: location || "",
      user: userId,
      group: id,
      metrics: metrics ?? {},
    };

    const newPost = await Post.create(postData);
    await newPost.populate("user", "name avatar");

    // ✅ UPDATE USER STREAK & ACTIVITY
    const user = await User.findById(userId);

    // Ensure activity is a Map
    if (!(user.activity instanceof Map)) {
      user.activity = new Map(Object.entries(user.activity || {}));
    }

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    const lastPost = user.lastPostDate ? user.lastPostDate.toISOString().split("T")[0] : null;

    // Mark today active
    user.activity.set(today, true);

    // Update streak logic
    if (lastPost === today) {
      // Already posted today — no change
    } else if (lastPost === yesterday) {
      user.streak += 1;
    } else {
      user.streak = 1;
    }

    user.lastPostDate = new Date();
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Post created & streak updated",
      data: newPost,
      streak: user.streak,
    }, { status: 201 });

  } catch (err) {
    console.error("POST /group/[id]/post error:", err);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      error: err.message,
    }, { status: 500 });
  }
}
