// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodbClient";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions = {
    adapter: MongoDBAdapter(clientPromise),
    secret: process.env.NEXTAUTH_SECRET,

    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),

        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectDB();

                const user = await User.findOne({ email: credentials.email }).select("+password");
                if (!user) throw new Error("User not found");

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) throw new Error("Incorrect password");

                return { id: user._id.toString(), name: user.name, email: user.email };
            },
        }),
    ],

    session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },

    pages: { signIn: "/login" },

    callbacks: {
        async jwt({ token, user, account }) {
            if (user) token.id = user.id;
            if (account) token.provider = account.provider;
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.provider = token.provider;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
