// src/models/Message.js
import mongoose, { Schema, models, Types } from "mongoose";

const messageSchema = new Schema(
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
    content: {
      type: String,
      required: true,
      trim: true,
    },
    attachments: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Message = models.Message || mongoose.model("Message", messageSchema);

export default Message;