import NextAuth from "next-auth";
import Twitter from "next-auth/providers/twitter";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Twitter({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      profile(profile) {
        const p = profile as { data?: { username?: string }; screen_name?: string; username?: string; name?: string; profile_image_url?: string };
        const xHandle = p?.data?.username ?? p?.screen_name ?? p?.username;
        return {
          id: (p as { data?: { id?: string }; id?: string }).data?.id ?? (p as { id?: string }).id,
          name: (p as { data?: { name?: string }; name?: string }).data?.name ?? (p as { name?: string }).name,
          image: (p as { data?: { profile_image_url?: string }; profile_image_url?: string }).data?.profile_image_url ?? (p as { profile_image_url?: string }).profile_image_url,
          ...(xHandle ? { xHandle: xHandle.toLowerCase() } : {}),
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Persist X (Twitter) handle to User for ownership verification.
      // Use updateMany so we don't throw when the user row doesn't exist yet
      // (signIn runs before the adapter creates the user). Profile callback
      // also passes xHandle into createUser; this updates on returning sign-ins.
      if (account?.provider === "twitter" && user.id) {
        const p = profile as { data?: { username?: string }; screen_name?: string; username?: string } | undefined;
        const xHandle = p?.data?.username ?? p?.screen_name ?? p?.username;
        if (xHandle) {
          await db.user.updateMany({
            where: { id: user.id },
            data: { xHandle: xHandle.toLowerCase() },
          });
        }
      }
      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const u = await db.user.findUnique({
          where: { id: user.id },
          select: { xHandle: true },
        });
        (session.user as { xHandle?: string | null }).xHandle = u?.xHandle ?? null;
      }
      return session;
    },
  },
  session: { strategy: "database", maxAge: 30 * 24 * 60 * 60 },
  trustHost: true,
});
