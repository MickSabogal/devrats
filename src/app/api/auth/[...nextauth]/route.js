import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodbClient";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions = {
    adapter: MongoDBAdapter(clientPromise),

    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: { email: {}, password: {} },
            async authorize(credentials) {
                await connectDB();
                const user = await User.findOne({ email: credentials.email }).select("+password");
                if (!user) throw new Error("User not found");
                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) throw new Error("Incorrect password");
                return { id: user._id, name: user.name, email: user.email };
            },
        }),
    ],

    session: {
        strategy: "database", // Saving the session in the database
        maxAge: 7 * 24 * 60 * 60, // Expiration of the session in 7 days
    },

    pages: {
        signIn: "/login",
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
