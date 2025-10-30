import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
    const session = await getServerSession(authOptions);

    if (!session)
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    try {
        await connectDB();
        const { avatar } = await req.json();

        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            { avatar },
            { new: true, select: "-password" }
        );

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Avatar upload error:", error);
        return NextResponse.json({ message: "Failed to upload avatar" }, { status: 500 });
    }
}