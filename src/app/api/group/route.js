import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Group from "@/models/Group";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { uploadToCloudinary } from "@/lib/cloudinary";

// POST - Create a new group
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, {status: 401});
    }

    const userId = session.user.id;
    const { name, description, picture } = await req.json();

    //Validation

    if (!name || !description) {
      return NextResponse.json(
        { message: "Name and description are required"},
        { status: 400}
      );
    }

    await connectDB();

    //Upload picture if provided
    let pictureUrl = picture || "";
    if (picture && picture.startsWith("data:")) {
      const { url } = await uploadToCloudinary(picture, "groups");
      pictureUrl = url;
    }

    //Create group aligned with schema
    const newGroup = new Group({
      name,
      description,
      picture: pictureUrl,
      creator: userId,
      members: [{ user: userId, role: "admin" }],
    });

    await newGroup.save();
    await newGroup.populate("creator","name avatar");

    //Generate invite link 
    
    const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/group/join/${newGroup.inviteCode}`;
    
    return NextResponse.json(
      { ...newGroup.toObject(), inviteLink },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST/groups error:", err);
    return NextResponse.json(
      {message: "Internal server error", error: err.message },
      {status: 500 }
    );
  }
}

// GET - Fetch all groups the user is a member of 
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized"}, {status: 401})
    }

    const userId = session.user.id;
    await connectDB();

    const groups = await Group.find({ "members.user": userId })
      .populate("creator", "name avatar streak")
      .populate("members.user", "name avatar streak");

      return NextResponse.json(groups, { status: 200 });
  } catch (err) {
    console.error("GET/groups error:", err);
    return NextResponse.json(
      { message: "Internal server error", error: err.message },
      { status: 500 }
    );
  }
}