import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "O nome é obrigatório"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "O email é obrigatório"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "A senha é obrigatória"],
            minlength: [6, "A senha deve ter pelo menos 6 caracteres"],
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