import mongoose, { Schema, Types } from "mongoose";

const messageSchema = new Schema ({
    group: { type: Types.ObjectId, ref: "Group", required: true }, // group chat
    user: {type: Types.ObjectId, ref: "User", required: true }, 
    content: {type: String, required: true}, // text message 
    attachments: [{ type: String }],
}, { timestamps: true });

const Message = models.Message || mongoose.model("Message", MessageSchema);

export default Message;