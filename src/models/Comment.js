const commentSchema = new Schema({
  post: { type: Types.ObjectId, ref: 'Post', required: true },
  user: { type: Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.models.Comment || mongoose.model('Comment', commentSchema);
