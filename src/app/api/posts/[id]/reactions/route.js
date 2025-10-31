import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Reaction from "@/models/Reaction";

export async function DELETE(req, { params }) {
    try {
        await connectDB();

        const { id, reactionId } = params;

        const reaction = await Reaction.findById(reactionId);

        if (!reaction || reaction.post.toString() !== id) {
            return NextResponse.json(
                { error: "Reaction not found for this post." },
                { status: 404 }
            );
        }

        await Reaction.findByIdAndDelete(reactionId);

        return NextResponse.json(
            {message: "Reaction removed successfully." },
            {status: 200 }
        );
    } catch (error) {

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}