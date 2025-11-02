import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Comment from "@/models/Comment";
import Post from "@/models/Post";

export async function POST(req, { params }) {
    try {
        await connectDB();

        const { id } = params;

        const body = await req.json();
        const { user, content } = body;

        if (!user || !content) {
            return NextResponse.json(
                {error: "User and content are required."},
                {status: 400 }
            );
        }

        const post = await Post.findById(id);
        if (!post) {
            return NextResponse.json({error: "Post not found."}, { status: 404 });
        }

        const comment = await Comment.create({
            post: id,
            user,
            content,
        });

        return NextResponse(comment, {status: 201 });
    } catch (error) {
        return NextResponse.json({error:error.message }, {status: 500});
    }
    
}