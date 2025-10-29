import connectDB from '@/lib/mongodb';
import Group from '@/models/Group';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

//  GET — Fetch all groups where the authenticated user is a member
export async function GET(req) {
  try {
    // Get the current session (user must be logged in)
    const session = await getServerSession(authOptions);
    if (!session || !session.user)
      return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const userId = session.user.id;
    await connectDB();

    // Find all groups that contain the user in their members list
    const groups = await Group.find({ 'members.user': userId })
      .populate('admin', 'name avatar') // Include admin info
      .populate('members.user', 'name avatar'); // Include members info

    return Response.json(groups, { status: 200 });
  } catch (err) {
    console.error('GET /groups error:', err);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST create new group
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user)
      return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const userId = session.user.id;
    const { name, description, coverPicture } = await req.json();
    if (!name) return Response.json({ message: 'Name is required' }, { status: 400 });

    await connectDB();

    // Check for existing group name
    const existingGroup = await Group.findOne({ name });
    if (existingGroup)
      return Response.json({ message: 'Group name already exists' }, { status: 400 });

    // The model already generates inviteToken automatically
    const newGroup = new Group({
      name,
      description,
      coverPicture,
      admin: userId,
      members: [{ user: userId, role: 'admin' }],
    });

    await newGroup.save();
    await newGroup.populate('admin', 'name avatar');

    // Generate full invite link for frontend
    const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/group/join/${newGroup.inviteToken}`;

    return Response.json({ ...newGroup.toObject(), inviteLink }, { status: 201 });
  } catch (err) {
    console.error('POST /groups error:', err);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}


// PATCH — Update group info or remove a member
export async function PATCH(req) {
  try {
    // Ensure user is logged in
    const session = await getServerSession(authOptions);
    if (!session || !session.user)
      return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const userId = session.user.id;
    const { groupId, name, description, coverPicture, action, memberId } = await req.json();

    if (!groupId) return Response.json({ message: 'Group ID is required' }, { status: 400 });

    await connectDB();

    // Find the group to update
    const group = await Group.findById(groupId);
    if (!group) return Response.json({ message: 'Group not found' }, { status: 404 });

    // Only admin can update the group
    if (group.admin.toString() !== userId)
      return Response.json({ message: 'Unauthorized' }, { status: 403 });

    // Update group info (name, description, etc.)
    if (!action) {
      if (name) group.name = name;
      if (description) group.description = description;
      if (coverPicture) group.coverPicture = coverPicture;
    }

    // Remove a member if action === 'remove-member'
    if (action === 'remove-member' && memberId) {
      group.members = group.members.filter(m => m.user.toString() !== memberId);
    }

    await group.save();
    await group.populate('admin', 'name avatar');
    await group.populate('members.user', 'name avatar');

    return Response.json(group, { status: 200 });
  } catch (err) {
    console.error('PATCH /groups error:', err);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT — Add a new member to the group
export async function PUT(req) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user)
      return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const userId = session.user.id;
    const { groupId, memberId } = await req.json();

    // Both groupId and memberId are required
    if (!groupId || !memberId)
      return Response.json({ message: 'groupId and memberId required' }, { status: 400 });

    await connectDB();

    // Find the target group
    const group = await Group.findById(groupId);
    if (!group) return Response.json({ message: 'Group not found' }, { status: 404 });

    // Only admin can add members
    if (group.admin.toString() !== userId)
      return Response.json({ message: 'Unauthorized' }, { status: 403 });

    // Prevent duplicate members
    if (group.members.some(m => m.user.toString() === memberId)) {
      return Response.json({ message: 'User already in group' }, { status: 400 });
    }

    // Add new member with default 'member' role
    group.members.push({ user: memberId, role: 'member' });
    await group.save();
    await group.populate('members.user', 'name avatar');

    return Response.json(group, { status: 200 });
  } catch (err) {
    console.error('PUT /groups error:', err);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE — Delete a group
export async function DELETE(req) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session || !session.user)
      return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const userId = session.user.id;
    const { groupId } = await req.json();

    // groupId is required
    if (!groupId) return Response.json({ message: 'Group ID is required' }, { status: 400 });

    await connectDB();

    // Find and validate group ownership
    const group = await Group.findById(groupId);
    if (!group) return Response.json({ message: 'Group not found' }, { status: 404 });

    // Only the admin can delete the group
    if (group.admin.toString() !== userId)
      return Response.json({ message: 'Unauthorized' }, { status: 403 });

    // Delete group from database
    await group.deleteOne();
    return Response.json({ message: 'Group deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error('DELETE /groups error:', err);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
