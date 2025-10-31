import mongoose, { Schema, models } from "mongoose";

const reactionSchema = new Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["like", "love", "clap", "laugh", "fire"],
      required: true,
    },
  },
  { timestamps: true }
);

const Reaction = models.Reaction || mongoose.model("Reaction", reactionSchema);

export default Reaction;
