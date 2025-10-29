import mongoose, { Schema, models, Types } from "mongoose";

const PostSchema = new Schema(
  {
    group: {
      type: Types.ObjectId,
      ref: "Group",
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: "",
      trim: true,
    },
    technology: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
    startTime: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true } 
);

const Post = models.Post || mongoose.model("Post", PostSchema);
export default Post;
