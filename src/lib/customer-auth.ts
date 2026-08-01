import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export const CUSTOMER_COOKIE_NAME = "customer_token";
export const SESSION_EXPIRY_DAYS = 30;

export async function hashPassword(password: string): Promise<string> {
  if (!password || typeof password !== "string") {
    throw new Error("Password must be a non-empty string.");
  }
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash || typeof password !== "string" || typeof hash !== "string") {
    return false;
  }
  return bcrypt.compare(password, hash);
}

export async function createCustomerSession(
  customerId: string,
  ipAddress?: string,
  userAgent?: string
) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  const session = await prisma.customerSession.create({
    data: {
      customerId,
      sessionToken: token,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      expiresAt,
    },
  });

  return { token: session.sessionToken, expiresAt };
}

export async function getCustomerSessionFromToken(token: string) {
  if (!token) return null;

  const session = await prisma.customerSession.findUnique({
    where: { sessionToken: token },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          provider: true,
          avatar: true,
          address: true,
          city: true,
          state: true,
          pincode: true,
          idProofType: true,
          idProofNumber: true,
          favouriteRoom: true,
          specialRequests: true,
          preferredFloor: true,
          preferredCheckInTime: true,
          savedGuests: true,
          isEmailVerified: true,
          isPhoneVerified: true,
          isActive: true,
          totalSpent: true,
          visitCount: true,
          lastVisit: true,
          favouriteDishes: true,
          createdAt: true,
        },
      },
    },
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) {
    // Delete expired session
    await prisma.customerSession.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  if (!session.customer.isActive) {
    return null;
  }

  return session;
}

export async function getCustomerSessionFromRequest(req: NextRequest) {
  const token = req.cookies.get(CUSTOMER_COOKIE_NAME)?.value;
  if (!token) return null;
  return getCustomerSessionFromToken(token);
}

export async function deleteCustomerSession(token: string) {
  if (!token) return;
  await prisma.customerSession.deleteMany({
    where: { sessionToken: token },
  }).catch(() => {});
}

export async function createPasswordResetToken(customerId: string) {
  // Invalidate any existing unused reset tokens for this customer
  await prisma.passwordReset.deleteMany({
    where: { customerId, usedAt: null },
  }).catch(() => {});

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  const reset = await prisma.passwordReset.create({
    data: {
      customerId,
      token,
      expiresAt,
    },
  });

  return reset;
}

export async function createEmailVerificationToken(customerId: string) {
  await prisma.emailVerification.deleteMany({
    where: { customerId, verifiedAt: null },
  }).catch(() => {});

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const verification = await prisma.emailVerification.create({
    data: {
      customerId,
      token,
      expiresAt,
    },
  });

  return verification;
}
