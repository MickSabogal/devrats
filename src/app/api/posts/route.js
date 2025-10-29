import { NextResponse } from "next/server"; 
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";

export async function GET(req, { params }) {
    try {
        await connectDB();

        const { id } = params;

        const post = await Post.findById(id)
            .populate("user", "name avatar") // shows user info
            .populate("group", "name");  // if we need it shows group name

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, {status:404 });
        }

        return NextResponse.json(post, { status: 200});

    } catch (error) {

        return NextResponse.json({ error: error.message }, {status: 500});
    }
}