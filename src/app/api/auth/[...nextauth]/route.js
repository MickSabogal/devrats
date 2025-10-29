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
            credentials: { email: {}, password: {} },
            async authorize(credentials) {
                await connectDB();
                const user = await User.findOne({ email: credentials.email }).select("+password");
                if (!user) throw new Error("User not found");
                const valid = await bcrypt.compare(credentials.password, user.password);
                if (!valid) throw new Error("Incorrect password");
                return { id: user._id.toString(), name: user.name, email: user.email, image: user.avatar };
            },
        }),
    ],

    session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },

    callbacks: {
        async signIn({ user, account, profile }) {
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
                }
                user.id = mongoUser._id.toString();
            }
            return true;
        },

        async jwt({ token, user, account, profile }) {
            if (user) token.id = user.id;
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
