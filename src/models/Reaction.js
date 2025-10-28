const reactionSchema = new Schema({
  post: { type: Types.ObjectId, ref: 'Post', required: true },
  user: { type: Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['like','love','clap','laugh'], required: true }
}, { timestamps: true });

module.exports = mongoose.models.Reaction || mongoose.model('Reaction', reactionSchema);
