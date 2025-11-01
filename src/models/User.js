import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, minlength: 6, select: false },

    avatar: { type: String, default: "/images/default-avatar.png" },
    image: { type: String, default: null },

    streak: { type: Number, default: 0 },
    lastPostDate: { type: Date, default: null },

    activity: {
      type: Map,
      of: Boolean,
      default: {},
    },

    activeGroup: { type: Schema.Types.ObjectId, ref: "Group", default: null },
    userGroups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", UserSchema);
export default User;
