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
    
    allowDangerousEmailAccountLinking: true,

    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
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

    session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },

    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                if (account?.provider === "github" || account?.provider === "google") {
                    await connectDB();
                    
                    let mongoUser = await User.findOne({ email: user.email });
                    
                    if (!mongoUser) {
                        const userData = {
                            name: user.name || profile?.name || profile?.login || "User",
                            email: user.email,
                            avatar: user.image || profile?.avatar_url || profile?.picture || "/images/default-avatar.png",
                            image: user.image || profile?.avatar_url || profile?.picture,
                            streak: 0,
                            lastPostDate: null,
                            activeGroup: null,
                        };

                        mongoUser = await User.create(userData);
                        console.log("✅ Novo usuário OAuth criado:", mongoUser.email);
                    } else {
                        const newImage = user.image || profile?.avatar_url || profile?.picture;
                        if (newImage && mongoUser.avatar !== newImage) {
                            mongoUser.avatar = newImage;
                            mongoUser.image = newImage;
                        }
                        
                        if (!mongoUser.name || mongoUser.name === "User") {
                            mongoUser.name = user.name || profile?.name || profile?.login || mongoUser.name;
                        }
                        
                        await mongoUser.save();
                        console.log("✅ Usuário OAuth existente logou:", mongoUser.email);
                    }
                    
                    user.id = mongoUser._id.toString();
                    user.mongoId = mongoUser._id.toString();
                }
                return true;
            } catch (error) {
                console.error("❌ Error em signIn callback:", error);
                return true;
            }
        },

        async jwt({ token, user, account, profile }) {
            if (user) {
                token.id = user.mongoId || user.id;
                token.image = user.image;
                token.provider = account?.provider;
            }
            
            if (profile?.avatar_url) {
                token.image = profile.avatar_url;
            }
            if (profile?.picture) {
                token.image = profile.picture;
            }
            
            return token;
        },

        async session({ session, token }) {
            if (token?.id) {
                try {
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
                    } else {
                        session.user.id = token.id;
                        session.user.image = token.image;
                    }
                } catch (error) {
                    console.error("❌ Error na session callback:", error);
                    session.user.id = token.id;
                    session.user.image = token.image;
                }
            }
            return session;
        },
    },

    debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };