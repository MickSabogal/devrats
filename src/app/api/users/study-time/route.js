// src/app/api/users/study-time/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    console.log("🔍 Starting study time calculation...");
    
    await connectDB();
    console.log("✅ Database connected");

    const session = await getServerSession(authOptions);
    console.log("🔐 Session:", session ? "Found" : "Not found");
    
    if (!session || !session.user) {
      console.log("❌ Unauthorized - no session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    console.log("👤 User ID:", userId);

    // Busca TODOS os posts do usuário (não só duration)
    const posts = await Post.find({ user: userId });
    console.log("📝 Total posts found:", posts.length);
    
    // Log cada post com seu duration
    posts.forEach((post, index) => {
      console.log(`Post ${index + 1}:`, {
        id: post._id,
        title: post.title,
        duration: post.duration,
        createdAt: post.createdAt
      });
    });
    
    const totalMinutes = posts.reduce((sum, post) => {
      const duration = post.duration || 0;
      console.log(`Adding ${duration} minutes from post "${post.title}"`);
      return sum + duration;
    }, 0);

    console.log(`📊 FINAL TOTAL: ${totalMinutes} minutes`);

    return NextResponse.json({ totalMinutes }, { status: 200 });
  } catch (error) {
    console.error("❌ Error calculating study time:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}