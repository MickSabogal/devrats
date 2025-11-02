// src/app/api/group/[id]/post/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import Group from "@/models/Group";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id: groupId } = params;
    const body = await req.json();
    const { title, content, image, eventDate, duration, metrics } = body;

    // Validações
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

    // Upload imagem para Cloudinary
    let imageUrl = null;
    if (image && image.startsWith('data:')) {
      const { url } = await uploadToCloudinary(
        image,
        'posts'
      );
      imageUrl = url;
    }

    // Criar post
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

    // Atualizar streak do usuário
    const today = new Date().toISOString().split("T")[0];
    const lastPost = user.lastPostDate
      ? new Date(user.lastPostDate).toISOString().split("T")[0]
      : null;

    if (lastPost !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      
      if (lastPost === yesterday) {
        user.streak += 1;
      } else if (lastPost !== today) {
        user.streak = 1;
      }

      user.lastPostDate = new Date();
      user.activity.set(today, true);
      await user.save();
    }

    const populatedPost = await Post.findById(newPost._id)
      .populate("user", "name avatar streak")
      .populate("group", "name");

    return NextResponse.json(
      { success: true, post: populatedPost },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /group/[id]/post error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// GET - Buscar posts do grupo
export async function GET(req, { params }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: groupId } = params;

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
    console.error("GET /group/[id]/post error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}