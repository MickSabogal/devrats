// src/app/api/group/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Group from '@/models/Group';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { uploadToCloudinary } from '@/lib/cloudinary';

// POST - Criar novo grupo
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, coverPicture } = await req.json();

    if (!name || !description) {
      return NextResponse.json(
        { message: 'Name and description are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const admin = await User.findOne({ email: session.user.email });
    if (!admin) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
    }

    let coverPictureUrl = '';

    // Upload cover picture para Cloudinary se fornecida
    if (coverPicture && coverPicture.startsWith('data:')) {
      const { url } = await uploadToCloudinary(
        coverPicture,
        'groups'
      );
      coverPictureUrl = url;
    }

    const newGroup = await Group.create({
      name,
      description,
      coverPicture: coverPictureUrl,
      admin: admin._id,
      members: [{ user: admin._id, role: 'admin' }],
    });

    await User.findByIdAndUpdate(admin._id, {
      $push: { userGroups: newGroup._id },
      activeGroup: newGroup._id,
    });

    await newGroup.populate('admin', 'name avatar streak');
    await newGroup.populate('members.user', 'name avatar streak');

    return NextResponse.json(newGroup, { status: 201 });
  } catch (err) {
    console.error('POST /group error:', err);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: err.message 
    }, { status: 500 });
  }
}

// GET - Buscar todos os grupos do usuário
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const groups = await Group.find({
      'members.user': user._id,
    })
      .populate('admin', 'name avatar streak')
      .populate('members.user', 'name avatar streak');

    return NextResponse.json(groups, { status: 200 });
  } catch (err) {
    console.error('GET /group error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}