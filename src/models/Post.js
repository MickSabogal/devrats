import mongoose, { Schema, models, Types } from "mongoose";

const PostSchema = new Schema(
  {
    group: { type: Types.ObjectId, ref: "Group", required: true },
    user: { type: Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    imageUrl: { type: String, default: null },
    technology: { type: String, default: null },
    startTime: { type: Date, default: null },
  },
  { timestamps: true }
);

const Post = models.Post || mongoose.model("Post", PostSchema);
export default Post;