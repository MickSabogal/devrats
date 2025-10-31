// src/app/api/group/[id]/post/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Post from "@/models/Post";
import Group from "@/models/Group";
import User from "@/models/User";

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

    return NextResponse.json(
      {
        success: true,
        message: "Group posts fetched successfully",
        page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
        posts,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const { title, content, image, eventDate, metrics, duration } = body;
    const userId = session.user.id;

    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const group = await Group.findById(id);
    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    const isMember =
      group.members.some((m) => m.user.toString() === userId) ||
      group.admin.toString() === userId;

    if (!isMember) {
      return NextResponse.json(
        { message: "You are not a member of this group" },
        { status: 403 }
      );
    }

    const postDuration = parseInt(duration) || 0;

    const newPost = new Post({
      title,
      content: content || "",
      image: image || null,
      eventDate: eventDate ? new Date(eventDate) : null,
      metrics: metrics || {},
      duration: postDuration,
      user: userId,
      group: id,
    });

    const savedPost = await newPost.save();

    const populatedPost = await savedPost.populate({
      path: "user",
      select: "name avatar",
    });

    const user = await User.findById(userId);

    if (!(user.activity instanceof Map)) {
      user.activity = new Map(Object.entries(user.activity || {}));
    }

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const lastPost = user.lastPostDate
      ? user.lastPostDate.toISOString().split("T")[0]
      : null;

    user.activity.set(today, true);

    if (lastPost === yesterday) {
      user.streak += 1;
    } else if (lastPost !== today) {
      user.streak = 1;
    }

    user.lastPostDate = new Date();
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Post created & streak updated",
        post: populatedPost.toObject(),
        streak: user.streak,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error", success: false, error: err.message },
      { status: 500 }
    );
  }
}