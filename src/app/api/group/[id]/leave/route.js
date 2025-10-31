import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Group from "@/models/Group";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// PATCH — Member leaves the group
export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { groupId } = params;
    const userId = session.user.id;

    const group = await Group.findById(groupId).populate("members.user", "name avatar");
    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    // Check if user is a member
    const isMember = group.members.some(m => m.user._id.toString() === userId);
    if (!isMember) {
      return NextResponse.json({ message: "You are not a member of this group" }, { status: 400 });
    }

    // Prevent admin from leaving without transferring role
    if (group.admin.toString() === userId) {
      return NextResponse.json({
        message: "Admin cannot leave the group without transferring admin role first"
      }, { status: 403 });
    }

    // Remove user from members
    group.members = group.members.filter(m => m.user._id.toString() !== userId);
    await group.save();

    return NextResponse.json({
      message: "You have left the group successfully"
    }, { status: 200 });

  } catch (err) {
    console.error("PATCH /group/[groupId]/leave error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
