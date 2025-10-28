import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false, // Avoid returning password by default
        },
        avatar: {
            type: String,
            default: "/images/default-avatar.png",
        },
        streak: {
            type: Number,
            default: 0,
        },
        lastPostDate: {
            type: String,
            default: null,
        },
        activeGroup: {
            type: Schema.Types.ObjectId,
            ref: "Group",
            default: null,
        },
    },
    { timestamps: true }
);

const User = models.User || mongoose.model("User", UserSchema);
export default User;