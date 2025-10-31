import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Post from "@/models/Post";
import Group from "@/models/Group";

// GET — List all posts in a specific group (supports pagination)
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
      message: "Group posts fetched successfully",
      page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      data: posts,
    }, { status: 200 });

  } catch (err) {
    console.error("GET /group/[id]/post error:", err);
    return NextResponse.json({ 
      success: false,
      message: "Internal server error" 
    }, { status: 500 });
  }
}

// POST — Create a new post in a specific group
export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ 
        success: false,
        message: "Unauthorized" 
      }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, content, image, eventDate, location, metrics } = body;
    const userId = session.user.id;

    console.log("Creating post for group:", id);
    console.log("Post data:", { title, content, hasImage: !!image, eventDate, location, metrics });

    if (!title) {
      return NextResponse.json({ 
        success: false,
        message: "Title is required" 
      }, { status: 400 });
    }

    await connectDB();

    const group = await Group.findById(id);
    if (!group) {
      return NextResponse.json({ 
        success: false,
        message: "Group not found" 
      }, { status: 404 });
    }

    const isMember = group.members.some(m => m.user.toString() === userId) || 
                     group.admin.toString() === userId;
    
    if (!isMember) {
      return NextResponse.json({ 
        success: false,
        message: "You are not a member of this group" 
      }, { status: 403 });
    }

    const postData = {
      title,
      content: content || "",
      image: image || null,
      eventDate: eventDate ? new Date(eventDate) : null,
      location: location || "",
      user: userId,
      group: id,
    };

    // Only add metrics if they exist
    if (metrics && (metrics.commitLines || metrics.activityDescription || metrics.repoLink)) {
      postData.metrics = {
        commitLines: metrics.commitLines || null,
        activityDescription: metrics.activityDescription || null,
        repoLink: metrics.repoLink || null,
      };
    }

    const newPost = new Post(postData);
    await newPost.save();
    await newPost.populate("user", "name avatar");

    console.log("Post created successfully:", newPost._id);

    return NextResponse.json({ 
      success: true,
      message: "Post created successfully", 
      data: newPost 
    }, { status: 201 });

  } catch (err) {
    console.error("POST /group/[id]/post error:", err);
    return NextResponse.json({ 
      success: false,
      message: "Internal server error",
      error: err.message 
    }, { status: 500 });
  }
}