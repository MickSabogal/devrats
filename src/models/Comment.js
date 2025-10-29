import mongoose, { Schema, models } from "mongoose";

const commentSchema = new Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const Comment = models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;
