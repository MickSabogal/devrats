// src/app/api/group/[id]/chat/[messageId]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { messageId } = params;
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

    const message = await Message.findById(messageId);
    if (!message) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 404 }
      );
    }

    if (message.user.toString() !== session.user.id) {
      return NextResponse.json(
        { message: "You can only edit your own messages" },
        { status: 403 }
      );
    }

    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    if (message.createdAt < twoHoursAgo) {
      return NextResponse.json(
        { message: "You can only edit messages sent within the last 2 hours" },
        { status: 403 }
      );
    }

    message.content = content.trim();
    await message.save();
    await message.populate("user", "name avatar");

    return NextResponse.json(
      { message: "Message updated successfully", data: message },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { messageId } = params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 404 }
      );
    }

    if (message.user.toString() !== session.user.id) {
      return NextResponse.json(
        { message: "You can only delete your own messages" },
        { status: 403 }
      );
    }

    await message.deleteOne();

    return NextResponse.json(
      { message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}