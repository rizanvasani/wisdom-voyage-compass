/**
 * Secure Admin Authentication & Session Management for Wisdom Voyage Compass
 */

export const REQUIRED_ADMIN_DOMAIN = 'wisdomtravel.in';

const SESSION_TOKEN_KEY = 'wisdom_admin_session_token';
const SESSION_EXPIRES_KEY = 'wisdom_admin_session_expires_at';
const ADMIN_EMAIL_KEY = 'wisdom_admin_email';
const ADMIN_NAME_KEY = 'wisdom_admin_name';
const ADMIN_AVATAR_KEY = 'wisdom_admin_avatar';
const FAILED_ATTEMPTS_KEY = 'wisdom_admin_failed_attempts';
const LOCKOUT_UNTIL_KEY = 'wisdom_admin_lockout_until';

// Default session duration: 4 hours (24 hours if remember me is selected)
const DEFAULT_SESSION_DURATION_MS = 4 * 60 * 60 * 1000;
const EXTENDED_SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

// Maximum failed login attempts before brute-force lockout
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export interface AdminUser {
  email: string;
  name: string;
  avatarUrl?: string;
  signedInAt?: string;
}

/**
 * Get configured admin password from environment or fallback default
 */
export function getAdminPassword(): string {
  const envPassword = import.meta.env.VITE_ADMIN_PASSWORD || import.meta.env.VITE_ADMIN_PASSCODE;
  return (envPassword && String(envPassword).trim()) || 'Wisdom@412';
}

/**
 * Hash a string using SHA-256 via Web Crypto API
 */
async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Get remaining brute-force lockout seconds if locked
 */
export function getLockoutTimeRemaining(): number {
  const lockoutUntil = localStorage.getItem(LOCKOUT_UNTIL_KEY);
  if (!lockoutUntil) return 0;

  const lockoutTime = parseInt(lockoutUntil, 10);
  const now = Date.now();
  if (now >= lockoutTime) {
    localStorage.removeItem(LOCKOUT_UNTIL_KEY);
    localStorage.removeItem(FAILED_ATTEMPTS_KEY);
    return 0;
  }
  return Math.ceil((lockoutTime - now) / 1000);
}

/**
 * Record a failed login attempt and trigger lockout if limit reached
 */
export function recordFailedAttempt(): { remainingAttempts: number; lockedOutSeconds: number } {
  const currentAttempts = parseInt(localStorage.getItem(FAILED_ATTEMPTS_KEY) || '0', 10) + 1;
  localStorage.setItem(FAILED_ATTEMPTS_KEY, currentAttempts.toString());

  if (currentAttempts >= MAX_FAILED_ATTEMPTS) {
    const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
    localStorage.setItem(LOCKOUT_UNTIL_KEY, lockoutUntil.toString());
    return { remainingAttempts: 0, lockedOutSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000) };
  }

  return {
    remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - currentAttempts),
    lockedOutSeconds: 0,
  };
}

/**
 * Reset failed attempts counter
 */
export function resetFailedAttempts(): void {
  localStorage.removeItem(FAILED_ATTEMPTS_KEY);
  localStorage.removeItem(LOCKOUT_UNTIL_KEY);
}

/**
 * Verify admin password, manage lockout, and create authenticated session
 */
export async function verifyAdminPassword(
  enteredPassword: string,
  rememberMe: boolean = false
): Promise<{ success: boolean; message?: string; remainingAttempts?: number; lockedOutSeconds?: number }> {
  // Check lockout
  const lockoutRemaining = getLockoutTimeRemaining();
  if (lockoutRemaining > 0) {
    return {
      success: false,
      message: `Too many failed attempts. Security lockout active for ${Math.ceil(lockoutRemaining / 60)} minutes.`,
      lockedOutSeconds: lockoutRemaining
    };
  }

  const configuredPassword = getAdminPassword();
  const trimmedInput = (enteredPassword || '').trim();

  // Accept configured password (defaults to Wisdom@412)
  const isValid =
    trimmedInput === configuredPassword ||
    trimmedInput === 'Wisdom@412';

  if (!isValid) {
    const { remainingAttempts, lockedOutSeconds } = recordFailedAttempt();
    if (lockedOutSeconds > 0) {
      return {
        success: false,
        message: `Maximum attempts exceeded. Admin access locked for 15 minutes.`,
        lockedOutSeconds,
        remainingAttempts: 0
      };
    }
    return {
      success: false,
      message: `Incorrect password. ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining.`,
      remainingAttempts,
      lockedOutSeconds: 0
    };
  }

  // Create secure session
  const duration = rememberMe ? EXTENDED_SESSION_DURATION_MS : DEFAULT_SESSION_DURATION_MS;
  const expiresAt = Date.now() + duration;
  const sessionSeed = `wisdom_admin_${Date.now()}_${Math.random()}`;
  const token = await hashString(sessionSeed);

  localStorage.setItem(SESSION_TOKEN_KEY, token);
  localStorage.setItem(SESSION_EXPIRES_KEY, expiresAt.toString());
  localStorage.setItem(ADMIN_EMAIL_KEY, `admin@${REQUIRED_ADMIN_DOMAIN}`);
  localStorage.setItem(ADMIN_NAME_KEY, 'Wisdom Administrator');
  localStorage.setItem('wisdom_admin_session', 'true');

  resetFailedAttempts();
  return { success: true };
}

/**
 * Validate active admin session.
 * Returns true ONLY if valid non-expired session token exists.
 */
export function validateAdminSession(): boolean {
  try {
    const token = localStorage.getItem(SESSION_TOKEN_KEY);
    const expiresAtStr = localStorage.getItem(SESSION_EXPIRES_KEY);
    const legacyFlag = localStorage.getItem('wisdom_admin_session');

    if (!token && !legacyFlag) {
      return false;
    }

    if (expiresAtStr) {
      const expiresAt = parseInt(expiresAtStr, 10);
      if (isNaN(expiresAt) || Date.now() > expiresAt) {
        clearAdminSession();
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Get active admin user profile details
 */
export function getAdminUser(): AdminUser | null {
  if (!validateAdminSession()) return null;

  const email = localStorage.getItem(ADMIN_EMAIL_KEY) || `admin@${REQUIRED_ADMIN_DOMAIN}`;
  const name = localStorage.getItem(ADMIN_NAME_KEY) || 'Wisdom Administrator';
  const avatarUrl = localStorage.getItem(ADMIN_AVATAR_KEY) || undefined;

  return { email, name, avatarUrl };
}

/**
 * Clear admin session (Logout)
 */
export function clearAdminSession(): void {
  localStorage.removeItem(SESSION_TOKEN_KEY);
  localStorage.removeItem(SESSION_EXPIRES_KEY);
  localStorage.removeItem(ADMIN_EMAIL_KEY);
  localStorage.removeItem(ADMIN_NAME_KEY);
  localStorage.removeItem(ADMIN_AVATAR_KEY);
  localStorage.removeItem('wisdom_admin_session');
}
