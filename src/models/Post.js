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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    eventDate: {
      type: Date,
      default: null,
    },
    duration: {
      type: Number,
      default: 0,
      min: 0,
    },
    metrics: {
      commitLines: {
        type: Number,
        default: null,
      },
      activityDescription: {
        type: String,
        default: null,
        trim: true,
      },
      repoLink: {
        type: String,
        default: null,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

const Post = models.Post || mongoose.model("Post", PostSchema);
export default Post;