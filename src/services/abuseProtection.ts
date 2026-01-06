/**
 * حماية من إساءة الاستخدام - حظر مؤقت بعد محاولات فاشلة متعددة
 * يستخدم localStorage لتخزين المحاولات
 */

const FAILED_ATTEMPTS_KEY = 'ntfly_failed_attempts';
const LOCKOUT_KEY = 'ntfly_lockout_until';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 دقيقة

interface FailedAttempts {
  count: number;
  lastAttempt: number;
}

/**
 * الحصول على المحاولات الفاشلة
 */
function getFailedAttempts(): FailedAttempts {
  try {
    const saved = localStorage.getItem(FAILED_ATTEMPTS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // تجاهل
  }
  return { count: 0, lastAttempt: 0 };
}

/**
 * حفظ المحاولات الفاشلة
 */
function saveFailedAttempts(attempts: FailedAttempts): void {
  try {
    localStorage.setItem(FAILED_ATTEMPTS_KEY, JSON.stringify(attempts));
  } catch {
    // تجاهل
  }
}

/**
 * التحقق من الحظر
 */
export function isLocked(): { locked: boolean; remainingSeconds?: number } {
  try {
    const lockoutUntil = localStorage.getItem(LOCKOUT_KEY);
    if (lockoutUntil) {
      const until = parseInt(lockoutUntil, 10);
      const now = Date.now();
      if (now < until) {
        return {
          locked: true,
          remainingSeconds: Math.ceil((until - now) / 1000),
        };
      } else {
        // انتهى الحظر
        localStorage.removeItem(LOCKOUT_KEY);
        localStorage.removeItem(FAILED_ATTEMPTS_KEY);
      }
    }
  } catch {
    // تجاهل
  }
  return { locked: false };
}

/**
 * تسجيل محاولة فاشلة
 */
export function recordFailedAttempt(): { locked: boolean; attemptsRemaining: number } {
  const { locked } = isLocked();
  if (locked) {
    return { locked: true, attemptsRemaining: 0 };
  }

  const attempts = getFailedAttempts();
  const now = Date.now();

  // إعادة تعيين إذا مضى وقت طويل
  if (now - attempts.lastAttempt > 30 * 60 * 1000) {
    attempts.count = 0;
  }

  attempts.count++;
  attempts.lastAttempt = now;
  saveFailedAttempts(attempts);

  if (attempts.count >= MAX_ATTEMPTS) {
    // تفعيل الحظر
    localStorage.setItem(LOCKOUT_KEY, String(now + LOCKOUT_DURATION));
    return { locked: true, attemptsRemaining: 0 };
  }

  return { locked: false, attemptsRemaining: MAX_ATTEMPTS - attempts.count };
}

/**
 * تسجيل نجاح - إعادة تعيين المحاولات
 */
export function recordSuccess(): void {
  try {
    localStorage.removeItem(FAILED_ATTEMPTS_KEY);
    localStorage.removeItem(LOCKOUT_KEY);
  } catch {
    // تجاهل
  }
}
