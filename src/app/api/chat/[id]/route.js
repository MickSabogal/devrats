import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";

export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = await params; //message ID from the URL 

        //finding ID by message
        const message = await Message.findById(id);

        if(!message) {
            return NextResponse.json({error: "Message not found"}, { status: 404 });
        }

        // Deleting the Message 
        await Message.findByIdAndDelete(id);

        return NextResponse.json({ message: "Message deleted successfully" }, { status: 200 });
    }catch (error) {
        console.error("Error deleting message:", error);
        return NextResponse.json({error: "Failed to delete your message"}, {status: 500});
    }
}