// src/app/api/group/[id]/chat/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import User from "@/models/User";
import Group from "@/models/Group";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const group = await Group.findById(id);
    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    const isMember = group.members.some(
      (m) => m.user.toString() === session.user.id
    );
    if (!isMember) {
      return NextResponse.json(
        { message: "You are not a member of this group" },
        { status: 403 }
      );
    }

    const messages = await Message.find({ group: id })
      .populate("user", "name avatar")
      .sort({ createdAt: 1 });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { message: "Message content is required" },
        { status: 400 }
      );
    }

    const group = await Group.findById(id);
    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    const isMember = group.members.some(
      (m) => m.user.toString() === session.user.id
    );
    if (!isMember) {
      return NextResponse.json(
        { message: "You are not a member of this group" },
        { status: 403 }
      );
    }

    const newMessage = await Message.create({
      group: id,
      user: session.user.id,
      content: content.trim(),
    });

    await newMessage.populate("user", "name avatar");

    return NextResponse.json(
      { message: "Message sent successfully", data: newMessage },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}