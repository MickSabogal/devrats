import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Group from "@/models/Group";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// POST — Join a group using an invite link (token)
export async function POST(req, { params }) {
  try {
    // Get the current session (user must be logged in)
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { token } = params;

    // Connect to the database
    await connectDB();

    // Find the group using the invite token
    const group = await Group.findOne({ inviteToken: token });
    if (!group) {
      return NextResponse.json({ message: 'Invalid invite link' }, { status: 404 });
    }

    // Check if the user is already a member of the group
    if (group.members.some(m => m.user.toString() === userId)) {
      return NextResponse.json({ message: 'You are already a member of this group' }, { status: 400 });
    }

    // Add the user as a member with the 'member' role to the group
    group.members.push({ user: userId, role: 'member' });
    await group.save();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const update = {
      $addToSet: { userGroups: group._id }
    };

    if (!user.activeGroup) {
      update.$set = { activeGroup: group._id };
    }

    await User.findByIdAndUpdate(userId, update, { new: true });
    
    // Return success response with the group ID
    return NextResponse.json({ 
      message: 'Joined group successfully', 
      groupId: group._id 
    }, { status: 200 });
  } catch (err) {
    console.error('POST /group/join/[token] error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}