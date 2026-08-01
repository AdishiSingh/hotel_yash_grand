import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const MANAGEMENT_COOKIE_NAME = "management_token";

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Creates a LoginSession record in PostgreSQL and returns the session token
 */
export async function createLoginSession(
  userId: string,
  ipAddress?: string,
  userAgent?: string
) {
  const token = `mgt_${Date.now()}_${crypto.randomBytes(32).toString("hex")}`;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days valid

  const session = await prisma.loginSession.create({
    data: {
      userId,
      token,
      ipAddress: ipAddress || "127.0.0.1",
      userAgent: userAgent || "Management Portal Client",
      expiresAt,
    },
  });

  // Update last login timestamp
  await prisma.managementUser.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() },
  });

  return { session, token, expiresAt };
}

/**
 * Validates session token against PostgreSQL
 */
export async function getManagementSession(token: string) {
  if (!token) return null;

  const session = await prisma.loginSession.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!session || session.expiresAt < new Date() || !session.user.isActive) {
    return null;
  }

  const permissionsList = session.user.role.permissions.map(
    (rp) => rp.permission.name
  );

  return {
    session,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role.name,
      roleDescription: session.user.role.description,
      permissions: permissionsList,
    },
  };
}

/**
 * Revokes session token
 */
export async function revokeSession(token: string) {
  if (!token) return;
  try {
    await prisma.loginSession.delete({
      where: { token },
    });
  } catch (err) {
    // Session might already be deleted
  }
}
