import { NextResponse } from "next/server";
import { AuditLogService } from "@/services/audit.service";

interface RateLimitStore {
  count: number;
  resetAt: number;
}

const ipLimitStore = new Map<string, RateLimitStore>();
const failedLoginStore = new Map<string, { attempts: number; lockUntil: number }>();

/**
 * Enterprise Rate Limiter & Brute Force Protection
 */
export class RateLimiter {
  /**
   * Check general API rate limits (100 requests per minute per IP)
   */
  public static checkApiRateLimit(ip: string, limit = 100, windowMs = 60 * 1000): boolean {
    const now = Date.now();
    const current = ipLimitStore.get(ip);

    if (!current || now > current.resetAt) {
      ipLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
      return true;
    }

    if (current.count >= limit) {
      return false;
    }

    current.count += 1;
    return true;
  }

  /**
   * Check login brute force limits (max 5 failed attempts per 15 minutes)
   */
  public static checkLoginAttempts(ip: string): { allowed: boolean; remainingAttempts: number; retryAfterSec?: number } {
    const now = Date.now();
    const record = failedLoginStore.get(ip);

    if (!record) {
      return { allowed: true, remainingAttempts: 5 };
    }

    if (now < record.lockUntil) {
      const retryAfterSec = Math.ceil((record.lockUntil - now) / 1000);
      return { allowed: false, remainingAttempts: 0, retryAfterSec };
    }

    if (now >= record.lockUntil && record.attempts >= 5) {
      failedLoginStore.delete(ip);
      return { allowed: true, remainingAttempts: 5 };
    }

    return { allowed: true, remainingAttempts: 5 - record.attempts };
  }

  /**
   * Record a failed login attempt for an IP address
   */
  public static async recordFailedLogin(ip: string, email: string) {
    const now = Date.now();
    const record = failedLoginStore.get(ip) || { attempts: 0, lockUntil: 0 };
    record.attempts += 1;

    if (record.attempts >= 5) {
      record.lockUntil = now + 15 * 60 * 1000; // 15-minute lock
      await AuditLogService.log({
        action: "SECURITY_BRUTE_FORCE_LOCKOUT",
        details: `IP ${ip} locked out for 15 mins after 5 failed login attempts for target '${email}'`,
        ipAddress: ip,
      });
    } else {
      await AuditLogService.log({
        action: "FAILED_LOGIN",
        details: `Failed authentication attempt for email '${email}' (Attempt ${record.attempts}/5)`,
        ipAddress: ip,
      });
    }

    failedLoginStore.set(ip, record);
  }

  /**
   * Reset failed attempts upon successful login
   */
  public static async recordSuccessfulLogin(ip: string, userId: string, email: string) {
    failedLoginStore.delete(ip);
    await AuditLogService.log({
      userId,
      action: "SUCCESSFUL_LOGIN",
      details: `User '${email}' successfully authenticated into ERP System`,
      ipAddress: ip,
    });
  }
}
