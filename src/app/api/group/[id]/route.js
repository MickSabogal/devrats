// src/app/api/group/[id]/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Group from '@/models/Group';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '@/lib/cloudinary';

// GET — Get details of a single group
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const group = await Group.findById(id)
      .populate('admin', 'name avatar streak')
      .populate('members.user', 'name avatar streak');

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

    // Update basic fields
    if (!action) {
      if (name) group.name = name;
      if (description) group.description = description;
      
      if (coverPicture && coverPicture.startsWith('data:')) {
        if (group.coverPicture) {
          const oldPublicId = extractPublicId(group.coverPicture);
          if (oldPublicId) {
            await deleteFromCloudinary(oldPublicId);
          }
        }

        const { url } = await uploadToCloudinary(
          coverPicture,
          'groups',
          `group_${id}`
        );
        group.coverPicture = url;
      }
    }

    // ✅ REMOVE MEMBER ACTION - ATUALIZADO
    if (action === 'remove-member' && memberId) {
      group.members = group.members.filter(m => m.user.toString() !== memberId);
      
      // ✅ REMOVER GRUPO DO USUÁRIO TAMBÉM
      await User.findByIdAndUpdate(memberId, {
        $pull: { userGroups: group._id }
      });
    }

    await group.save();
    await group.populate('admin', 'name avatar streak');
    await group.populate('members.user', 'name avatar streak');

    return NextResponse.json(group, { status: 200 });
  } catch (err) {
    console.error('PATCH /group/[id] error:', err);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: err.message 
    }, { status: 500 });
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
    await group.populate('members.user', 'name avatar streak');

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
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = params;

    await connectDB();

    const group = await Group.findById(id);
    if (!group) return NextResponse.json({ message: "Group not found" }, { status: 404 });

    if (group.admin.toString() !== session.user.id)
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    if (group.coverPicture) {
      const publicId = extractPublicId(group.coverPicture);
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    }

    const posts = await Post.find({ group: id });
    for (const post of posts) {
      if (post.image) {
        const postPublicId = extractPublicId(post.image);
        if (postPublicId) {
          await deleteFromCloudinary(postPublicId);
        }
      }
      
      post.title = "[Deleted]";
      post.content = "";
      post.image = null;
      post.metrics = {};
      await post.save();
    }

    await group.deleteOne();

    return NextResponse.json({ message: "Group deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("DELETE /group/[id] error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}