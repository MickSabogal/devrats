import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Post from "@/models/Post";
import User from "@/models/User";
import { calculatePersonalStreak, calculateGroupStreak } from "@/lib/streakHelper";

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (post.user.toString() !== session.user.id) {
      return NextResponse.json(
        { message: "You are not allowed to delete this post" },
        { status: 403 }
      );
    }

    const postDate = new Date(post.createdAt).toISOString().split("T")[0];
    const groupId = post.group.toString();

    await post.deleteOne();

    const user = await User.findById(session.user.id);

    if (user) {
      const remainingPostsOnDate = await Post.countDocuments({
        user: session.user.id,
        createdAt: {
          $gte: new Date(postDate + "T00:00:00.000Z"),
          $lt: new Date(postDate + "T23:59:59.999Z"),
        },
      });

      if (remainingPostsOnDate === 0) {
        if (!(user.activity instanceof Map)) {
          user.activity = new Map(Object.entries(user.activity || {}));
        }

        user.activity.delete(postDate);

        user.streak = calculatePersonalStreak(user.activity);

        const activityDates = Array.from(user.activity.keys())
          .filter(Boolean)
          .sort()
          .reverse();

        user.lastPostDate = activityDates.length > 0 
          ? new Date(activityDates[0]) 
          : null;
      }

      const groupStreakData = await calculateGroupStreak(session.user.id, groupId);
      
      if (!user.groupStreaks) user.groupStreaks = new Map();
      user.groupStreaks.set(groupId, groupStreakData);

      await user.save();
    }

    return NextResponse.json(
      {
        message: "Post deleted successfully",
        streak: user?.streak || 0,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ DELETE /group/[id]/delete error:", err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}