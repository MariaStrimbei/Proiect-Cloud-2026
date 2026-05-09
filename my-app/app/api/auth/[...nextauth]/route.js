import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCollection } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const collection = await getCollection("users");
        const user = await collection.findOne({ email: credentials.email });

        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(credentials.password, user.password);
        if (!passwordsMatch) return null;

        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
});

// FOARTE IMPORTANT: Exportă handler-ul ca GET și POST
export { handler as GET, handler as POST };