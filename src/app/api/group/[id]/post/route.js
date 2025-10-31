import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Post from "@/models/Post";
import Group from "@/models/Group";
import User from "@/models/User";

// ✅ GET — List all posts in a specific group (supports pagination)
export async function GET(req, { params }) {
  try {
    // ✅ Always await params in Next.js 15+ (prevents sync dynamic API warning)
    const { id } = await params;

    await connectDB();

    // ✅ Check if group exists
    const group = await Group.findById(id);
    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    // ✅ Handle pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // ✅ Fetch posts with user info populated
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
    console.error("GET /group/[id]/post error:", err);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

// ✅ POST — Create a new post in a specific group + update streak & activity
export async function POST(req, { params }) {
  try {
    // ✅ Get current authenticated user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // ✅ Extract post data from request body
    const { title, content, image, eventDate, location, metrics } =
      await req.json();

    const userId = session.user.id;

    // ✅ Validate required fields
    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // ✅ Check if group exists
    const group = await Group.findById(id);
    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    // ✅ Ensure user is member or admin
    const isMember =
      group.members.some((m) => m.user.toString() === userId) ||
      group.admin.toString() === userId;

    if (!isMember) {
      return NextResponse.json(
        { message: "You are not a member of this group" },
        { status: 403 }
      );
    }

    // ✅ Create new post
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

    const savedPost = await newPost.save();
    const populatedPost = await savedPost.populate({
      path: "user",
      select: "name avatar",
    });

    // ✅ Update user streak & activity
    const user = await User.findById(userId);

    if (!(user.activity instanceof Map)) {
      user.activity = new Map(Object.entries(user.activity || {}));
    }

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const lastPost = user.lastPostDate
      ? user.lastPostDate.toISOString().split("T")[0]
      : null;

    // mark today active
    user.activity.set(today, true);

    // streak logic
    if (lastPost === today) {
      // already posted today
    } else if (lastPost === yesterday) {
      user.streak += 1;
    } else {
      user.streak = 1;
    }

    user.lastPostDate = new Date();
    await user.save();

    // ✅ Return populated post
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
    console.error("POST /group/[id]/post error:", err);
    return NextResponse.json(
      { message: "Internal server error", success: false, error: err.message },
      { status: 500 }
    );
  }
}
