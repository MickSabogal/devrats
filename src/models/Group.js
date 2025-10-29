import mongoose, { Schema, models } from "mongoose";

const groupSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    coverPicture: { type: String, default: "" }, // link de portada
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["admin", "member"], default: "member" },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Group = models.Group || mongoose.model("Group", groupSchema);

export default Group;
