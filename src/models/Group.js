const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const groupSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    coverPicture: { type: String, default: "" }, // link
    admin: { type: Types.ObjectId, ref: "User", required: true },
    members: [
      {
        user: { type: Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["admin", "member"], default: "member" },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    inviteToken: {
      type: String,
      unique: true,
      default: () => crypto.randomBytes(12).toString("hex"),
    },
  },
  { timestamps: true } // createdAt and updatedAt
);

module.exports = mongoose.models.Group || mongoose.model("Group", groupSchema);
