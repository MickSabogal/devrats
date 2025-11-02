import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Reaction from "@/models/Reaction";

// PUT — Update a reaction type
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { reactionId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const reaction = await Reaction.findById(reactionId);
    if (!reaction)
      return NextResponse.json({ message: "Reaction not found" }, { status: 404 });

    // Only owner can edit
    if (reaction.user.toString() !== session.user.id) {
      return NextResponse.json(
        { message: "You are not allowed to edit this reaction" },
        { status: 403 }
      );
    }

    const { type } = await req.json();

    if (!type || type.trim() === "") {
      return NextResponse.json(
        { message: "Reaction type is required" },
        { status: 400 }
      );
    }

    reaction.type = type;
    await reaction.save();

    return NextResponse.json(
      { message: "Reaction updated successfully", reaction },
      { status: 200 }
    );
  } catch (err) {
    console.error("PUT /group/[groupId]/post/[postId]/reaction/[reactionId] error:", err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// DELETE — Remove a reaction
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { reactionId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const reaction = await Reaction.findById(reactionId);
    if (!reaction)
      return NextResponse.json({ message: "Reaction not found" }, { status: 404 });

    // Only owner can delete
    if (reaction.user.toString() !== session.user.id) {
      return NextResponse.json(
        { message: "You are not allowed to delete this reaction" },
        { status: 403 }
      );
    }

    await reaction.deleteOne();

    return NextResponse.json(
      { message: "Reaction deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /group/[groupId]/post/[postId]/reaction/[reactionId] error:", err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
