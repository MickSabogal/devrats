import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import Group from "@/models/Group";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { hasPostedToday, hasPostedTodayInGroup } from "@/lib/streakHelper";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id: groupId } = await params;
    const body = await req.json();
    const { title, content, image, eventDate, duration, metrics } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: "Title and content are required" },
        { status: 400 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { success: false, message: "Image is required" },
        { status: 400 }
      );
    }

    if (!duration || duration === 0) {
      return NextResponse.json(
        { success: false, message: "Study duration is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const group = await Group.findById(groupId).select("members");
    if (!group) {
      return NextResponse.json(
        { success: false, message: "Group not found" },
        { status: 404 }
      );
    }

    const isMember = group.members.some(
      (member) => member.user.toString() === user._id.toString()
    );

    if (!isMember) {
      return NextResponse.json(
        { success: false, message: "You are not a member of this group" },
        { status: 403 }
      );
    }

    let imageUrl = null;
    if (image && image.startsWith("data:")) {
      const { url } = await uploadToCloudinary(image, "posts");
      imageUrl = url;
    }

    const newPost = await Post.create({
      group: groupId,
      user: user._id,
      title,
      content,
      image: imageUrl,
      eventDate: eventDate ? new Date(eventDate) : new Date(),
      duration,
      metrics: metrics || {},
    });

    const today = new Date().toISOString().split("T")[0];
    const alreadyPostedToday = hasPostedToday(user.lastPostDate);
    
    if (!alreadyPostedToday) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      const lastPost = user.lastPostDate 
        ? new Date(user.lastPostDate).toISOString().split("T")[0]
        : null;

      if (lastPost === yesterday) {
        user.streak += 1;
      } else {
        user.streak = 1;
      }

      user.lastPostDate = new Date();
      
      if (!(user.activity instanceof Map)) {
        user.activity = new Map(Object.entries(user.activity || {}));
      }
      user.activity.set(today, true);
    }

    if (!user.groupStreaks) user.groupStreaks = new Map();

    let groupStreak = user.groupStreaks.get(groupId) || {
      streak: 0,
      lastPostDate: null,
      checkIns: 0,
    };

    const alreadyPostedTodayInGroup = hasPostedTodayInGroup(groupStreak);

    if (!alreadyPostedTodayInGroup) {
      groupStreak.streak += 1;
      groupStreak.checkIns += 1;
      groupStreak.lastPostDate = new Date();
    }

    user.groupStreaks.set(groupId, groupStreak);
    await user.save();

    const populatedPost = await Post.findById(newPost._id)
      .populate("user", "name avatar streak")
      .populate("group", "name");

    return NextResponse.json(
      { success: true, post: populatedPost },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ POST /group/[id]/post error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: groupId } = await params;

    const group = await Group.findById(groupId).select("members");
    if (!group) {
      return NextResponse.json(
        { success: false, message: "Group not found" },
        { status: 404 }
      );
    }

    const isMember = group.members.some(
      (member) => member.user.toString() === session.user.id
    );

    if (!isMember) {
      return NextResponse.json(
        { success: false, message: "You are not a member of this group" },
        { status: 403 }
      );
    }

    const posts = await Post.find({ group: groupId })
      .populate("user", "name avatar streak")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, posts }, { status: 200 });
  } catch (error) {
    console.error("❌ GET /group/[id]/post error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}