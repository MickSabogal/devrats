C:\Github\DevRats\src\app\api\users\study-time\route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const posts = await Post.find({ user: userId });
    
    const totalMinutes = posts.reduce((sum, post) => {
      const duration = post.duration || 0;
      return sum + duration;
    }, 0);

    return NextResponse.json({ totalMinutes }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}