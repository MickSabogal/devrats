  import { NextResponse } from "next/server";
  import connectDB from '@/lib/mongodb';
  import Group from '@/models/Group';
  import { getServerSession } from 'next-auth';
  import { authOptions } from '../auth/[...nextauth]/route';

  // GET — Fetch all groups where the authenticated user is a member
  export async function GET(req) {
    try {
      const session = await getServerSession(authOptions);
      if (!session || !session.user)
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

      const userId = session.user.id;
      await connectDB();

      const groups = await Group.find({ 'members.user': userId })
        .populate('creator', 'name avatar') // Include creator info
        .populate('members.user', 'name avatar'); // Include members info

      return NextResponse.json(groups, { status: 200 });
    } catch (err) {
      console.error('GET /groups error:', err);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }

  // POST — Create a new group
  export async function POST(req) {
    try {
      const session = await getServerSession(authOptions);
      if (!session || !session.user)
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

      const userId = session.user.id;
      const { name, description, picture } = await req.json();
      if (!name) return NextResponse.json({ message: 'Name is required' }, { status: 400 });

      await connectDB();

      // Check for existing group name
      const existingGroup = await Group.findOne({ name });
      if (existingGroup)
        return NextResponse.json({ message: 'Group name already exists' }, { status: 400 });

      const newGroup = new Group({
        name,
        description,
        picture,
        creator: userId,
        members: [{ user: userId, role: 'creator' }],
      });

      await newGroup.save();
      await newGroup.populate('creator', 'name avatar');

      // Generate full invite link for frontend
      const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/group/join/${newGroup.inviteCode}`;

      return NextResponse.json({ ...newGroup.toObject(), inviteLink }, { status: 201 });
    } catch (err) {
      console.error('POST /groups error:', err);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
