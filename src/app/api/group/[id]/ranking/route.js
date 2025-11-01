// src/app/api/group/[id]/ranking/route.js
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

    const { id } = params;

    const group = await Group.findById(id).populate("members.user", "name avatar streak");
    
    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    const userIds = group.members.map(m => m.user._id);

    const allPosts = await Post.find({
      group: id,
      user: { $in: userIds }
    }).select("user duration");

    const userStudyTime = {};
    const userPostCount = {};

    allPosts.forEach(post => {
      const userId = post.user.toString();
      
      if (!userStudyTime[userId]) {
        userStudyTime[userId] = 0;
        userPostCount[userId] = 0;
      }
      
      userStudyTime[userId] += (post.duration || 0);
      userPostCount[userId] += 1;
    });

    // Criar array de ranking
    const ranking = group.members.map((member) => {
      const userId = member.user._id.toString();
      const totalMinutes = userStudyTime[userId] || 0;
      const postCount = userPostCount[userId] || 0;
      
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      return {
        _id: member.user._id,
        name: member.user.name,
        avatar: member.user.avatar,
        streak: member.user.streak || 0,
        studyMinutes: totalMinutes,
        studyHours: hours,
        studyMinutesRemainder: minutes,
        postCount: postCount
      };
    });

    // Ordenar por tempo de estudo (decrescente)
    ranking.sort((a, b) => b.studyMinutes - a.studyMinutes);

    return NextResponse.json({
      success: true,
      ranking
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}