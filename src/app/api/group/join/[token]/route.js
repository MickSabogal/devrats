import { NextResponse } from "next/server";
import connectDB from '@/lib/mongodb';
import Group from '@/models/Group';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// POST — Join a group using an invite link (code)
export async function POST(req, { params }) {
  try {
    // Get the current session (user must be logged in)
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { code } = params;

    // Connect to the database
    await connectDB();

    // Find the group using the invite code
    const group = await Group.findOne({ inviteCode: code });
    if (!group) {
      return NextResponse.json({ message: 'Invalid invite link' }, { status: 404 });
    }

    // Check if the user is already a member of the group
    if (group.members.some(m => m.user.toString() === userId)) {
      return NextResponse.json({ message: 'You are already a member of this group' }, { status: 400 });
    }

    // Add the user as a member with the 'member' role
    group.members.push({ user: userId, role: 'member' });
    await group.save();

    // Return success response with the group ID
    return NextResponse.json({ message: 'Joined group successfully', groupId: group._id }, { status: 200 });
  } catch (err) {
    console.error('POST /group/join/[code] error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
