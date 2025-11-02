import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Post from "@/models/Post";
import User from "@/models/User";

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

        const activityDates = Array.from(user.activity.keys())
          .filter(Boolean)
          .sort()
          .reverse();

        let newStreak = 0;
        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date(Date.now() - 86400000)
          .toISOString()
          .split("T")[0];

        if (activityDates.includes(today)) {
          newStreak = 1;
          let checkDate = new Date(today);

          for (let i = 1; i < activityDates.length; i++) {
            checkDate.setDate(checkDate.getDate() - 1);
            const prevDate = checkDate.toISOString().split("T")[0];

            if (activityDates.includes(prevDate)) {
              newStreak++;
            } else {
              break;
            }
          }
        }
        else if (activityDates.includes(yesterday)) {
          newStreak = 1;
          let checkDate = new Date(yesterday);

          for (let i = 1; i < activityDates.length; i++) {
            checkDate.setDate(checkDate.getDate() - 1);
            const prevDate = checkDate.toISOString().split("T")[0];

            if (activityDates.includes(prevDate)) {
              newStreak++;
            } else {
              break;
            }
          }
        }
        else {
          newStreak = 0;
        }

        user.streak = newStreak;

        if (activityDates.length > 0) {
          user.lastPostDate = new Date(activityDates[0]);
        } else {
          user.lastPostDate = null;
        }

        await user.save();
      }
    }

    return NextResponse.json(
      {
        message: "Post deleted successfully",
        streak: user?.streak || 0,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}