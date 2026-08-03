import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "yashgrand-secret-key-super-secure-production-2026",
  pages: {
    signIn: "/customer/login",
    error: "/customer/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).toLowerCase().trim();
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.isActive) {
          return null;
        }

        let isValid = false;
        if (user.password) {
          if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
            isValid = await bcrypt.compare(String(credentials.password), user.password);
          } else {
            isValid = String(credentials.password) === user.password;
          }
        }

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name || "Hotel Yash Grand User",
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          const cleanEmail = user.email.toLowerCase().trim();
          const cleanName = user.name || cleanEmail.split("@")[0] || "Valued Guest";
          const cleanAvatar = user.image || "https://lh3.googleusercontent.com/a/default-user=s96-c";

          let customer = await prisma.customer.findUnique({
            where: { email: cleanEmail },
          });

          if (customer) {
            const currentProvider = customer.provider || "credentials";
            const updatedProvider = currentProvider.includes("google")
              ? currentProvider
              : `${currentProvider},google`;

            await prisma.customer.update({
              where: { id: customer.id },
              data: {
                name: customer.name || cleanName,
                avatar: cleanAvatar || customer.avatar,
                isEmailVerified: true,
                provider: updatedProvider,
                lastLogin: new Date(),
              },
            });
          } else {
            const generatedPhone = `+9198${Math.floor(10000000 + Math.random() * 90000000)}`;
            customer = await prisma.customer.create({
              data: {
                name: cleanName,
                email: cleanEmail,
                phone: generatedPhone,
                avatar: cleanAvatar,
                isEmailVerified: true,
                provider: "google",
                lastLogin: new Date(),
              },
            });
          }

          if (account.providerAccountId && customer) {
            const existingAccount = await prisma.account.findFirst({
              where: { provider: "google", providerAccountId: account.providerAccountId },
            });

            if (!existingAccount) {
              await prisma.account.create({
                data: {
                  customerId: customer.id,
                  type: "oauth",
                  provider: "google",
                  providerAccountId: account.providerAccountId,
                  scope: account.scope || "openid profile email",
                },
              }).catch(() => {});
            }
          }
        } catch (err) {
          console.error("Auth.js Google signIn callback error:", err);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "CUSTOMER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
});
