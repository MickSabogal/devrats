const postSchema = new Schema({
  group: { type: Types.ObjectId, ref: 'Group', required: true },
  user: { type: Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  caption: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.models.Post || mongoose.model('Post', postSchema);
