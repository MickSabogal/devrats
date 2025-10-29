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
    pages: { signIn: "/login" },

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

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.avatar,
                };
            },
        }),
    ],

    session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 }, // 7 días

    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                if (account?.provider === "github" || account?.provider === "google") {
                    await connectDB();
                    let mongoUser = await User.findOne({ email: user.email });
                    if (!mongoUser) {
                        mongoUser = await User.create({
                            name: user.name || profile?.name || "User",
                            email: user.email,
                            avatar:
                                user.image || profile?.avatar_url || "/images/default-avatar.png",
                            image: user.image || profile?.avatar_url,
                            streak: 0,
                            lastPostDate: null,
                            activeGroup: null,
                        });
                        console.log("✅ Nuevo usuario OAuth creado:", mongoUser.email);
                    } else {
                        const newImage = user.image || profile?.avatar_url || profile?.picture;
                        if (newImage && mongoUser.avatar !== newImage) {
                            mongoUser.avatar = newImage;
                            mongoUser.image = newImage;
                            await mongoUser.save();
                            console.log("🔁 Avatar actualizado para:", mongoUser.email);
                        }
                    }
                    user.id = mongoUser._id.toString();
                }
                return true;
            } catch (error) {
                console.error("❌ Error en signIn callback:", error);
                return false;
            }
        },

        async jwt({ token, user, account, profile }) {
            if (user) {
                token.id = user.id;
                token.image = user.image;
            }
            if (account) token.provider = account.provider;
            if (profile?.avatar_url) token.image = profile.avatar_url;
            return token;
        },

        async session({ session, token }) {
            if (token?.id) {
                await connectDB();
                const mongoUser = await User.findById(token.id).select("-password");

                if (mongoUser) {
                    session.user.id = mongoUser._id.toString();
                    session.user.name = mongoUser.name;
                    session.user.email = mongoUser.email;
                    session.user.avatar = mongoUser.avatar;
                    session.user.image = mongoUser.avatar || mongoUser.image;
                    session.user.streak = mongoUser.streak;
                    session.user.activeGroup = mongoUser.activeGroup;
                }
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
