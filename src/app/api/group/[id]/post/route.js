import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({message: "Unauthorized"}, { status: 401})
    }

    const { id: groupId } = params;
    const body = await req.json();
    const { title, description, imageUrl, technology, startTime } = body;

    const userId = session.user.id;

    //Basic Validation
    if (!title) {
      return NextResponse.json(
        { success: false, message: "Title is required"},
        { status: 400 }
      );
    }

    await connectDB();

    // Upload to Cloudinary if image is base64
    let uploadedImageUrl = imageUrl;
    if (imageUrl && imageUrl.startsWith("data:")) {
      const { url } = await uploadToCloudinary(imageUrl, "posts");
      uploadedImageUrl = url;
    }

    // Verify user

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found"},
        { status: 404 }
      );
    }

    // Create post (aligned with our plan)

    const newPost = await Post.create({
      group: groupId,
      user: user._id,
      title,
      description,
      imageUrl: uploadedImageUrl,
      technology,
      startTime: startTime? new Date(startTime) : null,
    });

    const populatedPost = await Post.findById(newPost._id)
      .populate("user", "name avatar")
      .populate("group", "name");

      return NextResponse.json(
        { success: true, post: populatedPost },
        { status: 201 }
      );

  } catch (error) {
    console.error("post/group/[id]/post error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// GET - Fetch all posts in a group 
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id: groupId } = params;

    const posts = await Post.find({ group: groupId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

      return NextResponse.json({ success: true, posts }, {status: 200});
  } catch (error) {
    console.error("GET/group/[id]/post error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error"},
      { status: 500 }
    );
  }
}