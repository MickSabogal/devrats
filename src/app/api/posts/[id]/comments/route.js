import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Comment from "@/models/Comment";

export async function DELETE(req, { params }) {
    try {
        await connectDB();

        const {id, commentId } = params;

        const comment = await Comment.findById(commentId);

        if (!comment || comment.post.toString() !== id) {
            return NextResponse.json(
                {error: "Comment not found for this post."},
                { status: 404 }
            );
        }

        
        await Comment.findByIdAndDelete(commentId);

        return NextResponse.json(
            {message: "Comment deleted successfully."},
            {status: 200}
        );
    } catch (error) {
        
        return NextResponse.json({error: error.message }, { status: 500 });
    }


}