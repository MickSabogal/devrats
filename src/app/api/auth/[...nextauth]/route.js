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
            credentials: { email: {}, password: {} },
            async authorize(credentials) {
                try {
                    console.log("🔍 Tentando autenticar:", credentials.email);
                    
                    await connectDB();
                    
                    const user = await User.findOne({ email: credentials.email }).select("+password");
                    
                    if (!user) {
                        console.log("❌ Usuário não encontrado:", credentials.email);
                        throw new Error("User not found");
                    }
                    
                    console.log("✅ Usuário encontrado:", user.email);
                    
                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    
                    if (!isValid) {
                        console.log("❌ Senha incorreta");
                        throw new Error("Incorrect password");
                    }
                    
                    console.log("✅ Senha correta! Login bem-sucedido");
                    
                    return { id: user._id.toString(), name: user.name, email: user.email };
                } catch (error) {
                    console.error("❌ Erro na autenticação:", error.message);
                    throw error;
                }
            },
        }),
    ],

    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, 
    },

    pages: {
        signIn: "/login",
    },

    secret: process.env.NEXTAUTH_SECRET,
    
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
            }
            if (account) {
                token.provider = account.provider;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.provider = token.provider;
            }
            return session;
        }
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };