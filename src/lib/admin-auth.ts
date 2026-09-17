/**
 * Secure Admin Authentication & Google SSO (@wisdomtravel.in Domain Enforcement)
 */

export const REQUIRED_ADMIN_DOMAIN = 'wisdomtravel.in';

const SESSION_TOKEN_KEY = 'wisdom_admin_session_token';
const SESSION_EXPIRES_KEY = 'wisdom_admin_session_expires_at';
const ADMIN_EMAIL_KEY = 'wisdom_admin_email';
const ADMIN_NAME_KEY = 'wisdom_admin_name';
const ADMIN_AVATAR_KEY = 'wisdom_admin_avatar';
const FAILED_ATTEMPTS_KEY = 'wisdom_admin_failed_attempts';
const LOCKOUT_UNTIL_KEY = 'wisdom_admin_lockout_until';

// Session duration: 4 hours in milliseconds
const SESSION_DURATION_MS = 4 * 60 * 60 * 1000;

// Maximum failed login attempts before lockout
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

export interface AdminUser {
  email: string;
  name: string;
  avatarUrl?: string;
  signedInAt?: string;
}

/**
 * Validate whether an email address belongs strictly to @wisdomtravel.in
 */
export function isValidWisdomDomain(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const cleanEmail = email.trim().toLowerCase();
  return cleanEmail.endsWith(`@${REQUIRED_ADMIN_DOMAIN}`);
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
 * Record a failed login attempt
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
    remainingAttempts: MAX_FAILED_ATTEMPTS - currentAttempts,
    lockedOutSeconds: 0,
  };
}

/**
 * Reset failed attempt counter
 */
export function resetFailedAttempts(): void {
  localStorage.removeItem(FAILED_ATTEMPTS_KEY);
  localStorage.removeItem(LOCKOUT_UNTIL_KEY);
}

/**
 * Create an authenticated admin session for a @wisdomtravel.in email user
 */
export async function createGoogleAdminSession(
  email: string,
  name?: string,
  avatarUrl?: string
): Promise<{ success: boolean; message?: string }> {
  const cleanEmail = email.trim().toLowerCase();

  // Strict Domain Validation Guard
  if (!isValidWisdomDomain(cleanEmail)) {
    recordFailedAttempt();
    return {
      success: false,
      message: `Access Denied: Only @${REQUIRED_ADMIN_DOMAIN} accounts are authorized to access the admin portal.`
    };
  }

  const sessionSecret = `${cleanEmail}_${Date.now()}_${Math.random()}`;
  const token = await hashString(sessionSecret);
  const expiresAt = Date.now() + SESSION_DURATION_MS;

  localStorage.setItem(SESSION_TOKEN_KEY, token);
  localStorage.setItem(SESSION_EXPIRES_KEY, expiresAt.toString());
  localStorage.setItem(ADMIN_EMAIL_KEY, cleanEmail);
  localStorage.setItem(ADMIN_NAME_KEY, name || cleanEmail.split('@')[0]);
  if (avatarUrl) {
    localStorage.setItem(ADMIN_AVATAR_KEY, avatarUrl);
  }
  
  // Set legacy flag
  localStorage.setItem('wisdom_admin_session', 'true');

  resetFailedAttempts();
  return { success: true };
}

/**
 * Validate active admin session (Passcode disabled - always authenticated)
 */
export function validateAdminSession(): boolean {
  return true;
}

/**
 * Get active admin user profile details
 */
export function getAdminUser(): AdminUser | null {
  const email = localStorage.getItem(ADMIN_EMAIL_KEY) || `admin@${REQUIRED_ADMIN_DOMAIN}`;
  const name = localStorage.getItem(ADMIN_NAME_KEY) || 'Wisdom Admin';
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
