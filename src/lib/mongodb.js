import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("❌ Missing MONGODB_URI in .env.local");
}

let isConnected = false; 

export default async function connectDB() {
    if (isConnected) return;

    try {
        const db = await mongoose.connect(MONGODB_URI);
        isConnected = db.connections[0].readyState;
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        throw new Error("Failed to connect to MongoDB");
    }
}
