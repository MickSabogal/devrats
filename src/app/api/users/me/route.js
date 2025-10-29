
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session)
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    await connectDB();
    const user = await User.findOne({ email: session.user.email }).select("-password");
    return NextResponse.json({ user });
}

export async function PUT(req) {
    const session = await getServerSession(authOptions);

    if (!session)
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    try {
        await connectDB();
        const data = await req.json();
        
        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            data,
            { new: true, select: "-password" }
        );

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ message: "Failed to update user" }, { status: 500 });
    }
}

export async function DELETE() {
    const session = await getServerSession(authOptions);

    if (!session)
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    try {
        await connectDB();
        await User.findOneAndDelete({ email: session.user.email });

        return NextResponse.json({ message: "Account deleted" });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ message: "Failed to delete account" }, { status: 500 });
    }
}