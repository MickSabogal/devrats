import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Group from "@/models/Group";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const group = await Group.findById(id).populate(
      "members.user",
      "name avatar streak groupStreaks"
    );

    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    const userIds = group.members.map((m) => m.user._id);

    const allPosts = await Post.find({
      group: id,
      user: { $in: userIds },
    }).select("user duration");

    console.log("📊 Total posts found:", allPosts.length);

    const userStats = {};

    allPosts.forEach((post) => {
      const userId = post.user.toString();

      if (!userStats[userId]) {
        userStats[userId] = {
          totalMinutes: 0,
          postCount: 0,
        };
      }

      const duration = parseInt(post.duration) || 0;
      userStats[userId].totalMinutes += duration;
      userStats[userId].postCount += 1;
    });

    const ranking = group.members.map((member) => {
      const userId = member.user._id.toString();
      const stats = userStats[userId] || { totalMinutes: 0, postCount: 0 };

      const groupStreak = member.user.groupStreaks?.get(id) || {
        streak: 0,
        checkIns: 0,
      };

      const totalMinutes = stats.totalMinutes;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      return {
        _id: member.user._id,
        name: member.user.name,
        avatar: member.user.avatar,
        streak: groupStreak.streak,
        studyMinutes: totalMinutes,
        studyHours: hours,
        studyMinutesRemainder: minutes,
        postCount: stats.postCount,
      };
    });

    ranking.sort((a, b) => b.studyMinutes - a.studyMinutes);

    console.log(
      "🏆 Final ranking:",
      ranking.map((r) => ({
        name: r.name,
        groupStreak: r.streak,
        minutes: r.studyMinutes,
      }))
    );

    return NextResponse.json(
      {
        success: true,
        ranking,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Ranking error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}