import mongoose, { Schema, Types, models } from "mongoose";
import crypto from "crypto";

const groupSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    picture: { type: String, default: ""},
    inviteCode: { 
      type: String,
      unique: true,
      default: () => crypto.randomBytes(3).toString("hex"), // 6 caracteres
    },
    creator: { type: Types.ObjectId, ref: "User", required: true },
    members: [
      {
        user: { type: Type.ObjectId, ref: "User" },
        role: { type: String, enum: ["admin", "member"], default: "member"},
        joinedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Group = models.Group || mongoose.model("Group", groupSchema);
export default Group;