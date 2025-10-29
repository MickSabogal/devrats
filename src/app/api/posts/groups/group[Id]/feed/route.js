import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";

export async function GET(req, { params }) {
    try {

        await connectDB();

        const { groupId } = params;

        const posts = await Post.find({ group: groupId})
            .populate("user", "name avatar") // only name + avatar
            .sort({ createdAt: -1 }); // latest post first

            return NextResponse.json(posts, { status: 200});
        
        }   catch (error) {

            return NextResponse.json({ error: error.message }, { status: 500 });
        }
}