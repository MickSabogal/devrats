import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Group from '@/models/Group';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET — Get details of a single group
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const group = await Group.findById(id)
      .populate('admin', 'name avatar')
      .populate('members.user', 'name avatar');

    if (!group) {
      return NextResponse.json({ message: 'Group not found' }, { status: 404 });
    }

    return NextResponse.json(group, { status: 200 });
  } catch (err) {
    console.error('GET /group/[id] error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PATCH — Update group info partially (or remove member)
export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const userId = session.user.id;
    const { id } = params;
    const { name, description, coverPicture, action, memberId } = await req.json();

    if (!id) return NextResponse.json({ message: 'Group ID required' }, { status: 400 });

    await connectDB();

    const group = await Group.findById(id);
    if (!group) return NextResponse.json({ message: 'Group not found' }, { status: 404 });

    if (group.admin.toString() !== userId)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });

    if (!action) {
      if (name) group.name = name;
      if (description) group.description = description;
      if (coverPicture) group.coverPicture = coverPicture;
    }

    if (action === 'remove-member' && memberId) {
      group.members = group.members.filter(m => m.user.toString() !== memberId);
    }

    await group.save();
    await group.populate('admin', 'name avatar');
    await group.populate('members.user', 'name avatar');

    return NextResponse.json(group, { status: 200 });
  } catch (err) {
    console.error('PATCH /group/[id] error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT — Add a member to the group
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    const { memberId } = await req.json();

    if (!id || !memberId)
      return NextResponse.json({ message: 'Group ID and memberId required' }, { status: 400 });

    await connectDB();

    const group = await Group.findById(id);
    if (!group) return NextResponse.json({ message: 'Group not found' }, { status: 404 });

    if (group.admin.toString() !== session.user.id)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });

    if (group.members.some(m => m.user.toString() === memberId))
      return NextResponse.json({ message: 'User already in group' }, { status: 400 });

    group.members.push({ user: memberId, role: 'member' });
    await group.save();
    await group.populate('members.user', 'name avatar');

    return NextResponse.json(group, { status: 200 });
  } catch (err) {
    console.error('PUT /group/[id] error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE — Delete a group
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = params;

    await connectDB();

    const group = await Group.findById(id);
    if (!group) return NextResponse.json({ message: 'Group not found' }, { status: 404 });

    if (group.admin.toString() !== session.user.id)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });

    await group.deleteOne();

    return NextResponse.json({ message: 'Group deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error('DELETE /group/[id] error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PATCH — Transfer admin role to another member
export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { groupId } = params;
    const { newAdminId } = await req.json();

    if (!newAdminId) {
      return NextResponse.json({ message: "newAdminId is required" }, { status: 400 });
    }

    const group = await Group.findById(groupId).populate("members.user", "name avatar");
    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    // Only current admin can transfer
    if (group.admin.toString() !== session.user.id) {
      return NextResponse.json({ message: "Only admin can transfer role" }, { status: 403 });
    }

    // Verify the new admin is a member of the group
    const isMember = group.members.some(m => m.user._id.toString() === newAdminId);
    if (!isMember) {
      return NextResponse.json({ message: "User is not a member of the group" }, { status: 400 });
    }

    group.admin = newAdminId;
    await group.save();

    return NextResponse.json({
      message: "Admin role transferred successfully",
      newAdminId
    }, { status: 200 });

  } catch (err) {
    console.error("PATCH /group/[groupId]/transfer-admin error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}