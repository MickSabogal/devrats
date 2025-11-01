import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import User from "@/models/User";

// Using GET for all the messages fetching in 

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { groupId } = params;

        const messages = await Message.find({ group: groupId })
            .populate("user", "name avatar")
            .sort({ createdAt: 1 });

        return NextResponse.json(messages, { status: 200 });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({error: "Failed to fetch messages"}, {status: 500});
    }
}

export async function POST(req, { params }) {
    try {
        await connectDB();
        const { groupId } = params;
        const body = await req.json();

        const { user, content, attachments } = body;

        if (!user || !content) {
            return NextResponse.json({error: "User and content are required" }, {status: 400});
        }

        // User validation, prevent deleted users from sending messages.
        const existingUser = await User.findById(user);
        if (!existingUser) {
            return NextResponse.json({ error: "User not found"}, { status: 404 });
        }

        const newMessage = await Message.create({
            group: groupId,
            user,
            content,
            attachments: attachments || [],
        });

        return NextResponse.json(newMessage, {status: 201 });
    } catch (error) {
        console.error("Error creating message:", error);
        return NextResponse.json({ error:"Failed to create message"}, {status: 500});
    }
}
