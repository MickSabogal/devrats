import { NextResponse } from "next/server"; 
import connectDB from "@/lib/mongodb";
import Reaction from "@/models/Reaction";
import Post from "@/models/Post";

export async function POST(req, { params }) {
    try {
        await connectDB();    

        const { id } = params; 

        const body = await req.json();
        const { user, type } = body;

        if (!user || !type) {
            return NextResponse.json(
                { error: "User and type are required." },
                {status: 400 }
            );
        }

        const post = await Post.findById(id);
        if (!post) {
            return NextResponse.json({error: "Post not found."}, { status: 404 });
        }

        // To prevent user reaction duplication
        const existingReaction = await Reaction.findOne({post: id, user });
        if (existingReaction) {
            return NextResponse.json(
                {message: "User already reacted to this post."},
                { status: 200 }
            );
        }

        const reaction = await Reaction.create({
            post: id,
            user, 
            type,
        });

        return NextResponse.json(reaction, {status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, {status: 500 });
    }
}