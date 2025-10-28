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
