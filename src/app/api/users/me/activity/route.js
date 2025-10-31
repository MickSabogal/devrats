import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.user.id).select("activity streak");

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let activityMap;
    if (user.activity instanceof Map) {
        activityMap = user.activity;
    } else {
        activityMap = new Map(Object.entries(user.activity || {}));
    }

    return NextResponse.json({
        activity: Object.fromEntries(activityMap),
        streak: user.streak || 0,
    });
}
