const messageSchema = new Schema ({
    group: { type: Types.ObjectId, ref: "Group", required: true }, // group chat
    user: {type: Types.ObjectId, ref: "User", required: true }, 
    content: {type: String, required: true}, // text message 
    attachments: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.models.Message || mongoose.model('Message', messageSchema);