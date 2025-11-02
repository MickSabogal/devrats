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

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Post from "@/models/Post";
import User from "@/models/User";
import Group from "@/models/Group";

export async function GET(req, { params }) {
    const { groupId } = params;

    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        const group = await Group.findById(groupId);
        if (!group) {
            return NextResponse.json(
                { message: "Group not found" },
                { status: 404 }
            );
        }
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;
        const posts = await Post.find({ group: groupId })
            .populate({
                path: "user",
                select: "name avatar image streak",
                model: User,
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const totalPosts = await Post.countDocuments({ group: groupId });
        return NextResponse.json(
            {
                message: "Group feed fetched successfully",
                page,
                totalPages: Math.ceil(totalPosts / limit),
                totalPosts,
                posts,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("❌ Error fetching group feed:", error);
        return NextResponse.json(
            { message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}

