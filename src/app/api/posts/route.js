import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { group, user, imageUrl, caption, technology, description, startTime } = body;

        if (!group || !user || !imageUrl) {
            return NextResponse.json(
                {error: "group, user, and imageUrl are required."},
                { status: 400 }
            );
        }

        const newPost = await Post.create({
            group,
            user,
            imageUrl,
            caption: caption || "",
            technology: technology || null,
            description: description || "",
            startTime: startTime || null,
        });

        return NextResponse.json(newPost, {status: 201});
    } catch (err) {
        return NextResponse.json({ error: err.message }, {status: 500 });
    }
}