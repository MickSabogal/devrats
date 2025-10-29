import connectDB from '@/lib/mongodb';
import Group from '@/models/Group';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Join a group using invite link
export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user)
      return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const userId = session.user.id;
    const { token } = params;

    await connectDB();

    const group = await Group.findOne({ inviteToken: token });
    if (!group) return Response.json({ message: 'Invalid invite link' }, { status: 404 });

    // Check if user is already in group
    if (group.members.some(m => m.user.toString() === userId)) {
      return Response.json({ message: 'You are already a member of this group' }, { status: 400 });
    }

    // Add user as member
    group.members.push({ user: userId, role: 'member' });
    await group.save();

    return Response.json({ message: 'Joined group successfully', groupId: group._id }, { status: 200 });
  } catch (err) {
    console.error('POST /group/join/[token] error:', err);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
