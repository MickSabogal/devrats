// src/app/api/users/me/avatar/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from "@/lib/cloudinary";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    await connectDB();
    const { avatar } = await req.json();

    if (!avatar) {
      return NextResponse.json({ message: "No avatar provided" }, { status: 400 });
    }

    const currentUser = await User.findOne({ email: session.user.email });
    
    if (currentUser?.avatar && currentUser.avatar !== "/images/default-avatar.png") {
      const oldPublicId = extractPublicId(currentUser.avatar);
      if (oldPublicId) {
        await deleteFromCloudinary(oldPublicId);
      }
    }

    const { url } = await uploadToCloudinary(
      avatar,
      'avatars',
      `user_${currentUser._id}` // ID único para cada usuário
    );

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { avatar: url },
      { new: true, select: "-password" }
    );

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json({ 
      message: "Failed to upload avatar",
      error: error.message 
    }, { status: 500 });
  }
}