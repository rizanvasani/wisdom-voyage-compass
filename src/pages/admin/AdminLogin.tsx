import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import {
  verifyAdminPassword,
  validateAdminSession,
  getLockoutTimeRemaining
} from '@/lib/admin-auth';

export const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const navigate = useNavigate();

  // If already authenticated, redirect straight to dashboard
  useEffect(() => {
    if (validateAdminSession()) {
      navigate('/admin/dashboard', { replace: true });
    }

    const remaining = getLockoutTimeRemaining();
    if (remaining > 0) {
      setLockoutSeconds(remaining);
    }
  }, [navigate]);

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setAttemptsRemaining(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (lockoutSeconds > 0) {
      toast.error(`Portal temporarily locked. Please wait ${lockoutSeconds}s.`);
      return;
    }

    if (!password.trim()) {
      toast.error('Please enter the administrator password.');
      return;
    }

    setLoading(true);

    try {
      const res = await verifyAdminPassword(password, rememberMe);

      if (res.success) {
        toast.success('Access granted. Welcome to Wisdom Voyage Admin!');
        navigate('/admin/dashboard', { replace: true });
      } else {
        if (res.lockedOutSeconds && res.lockedOutSeconds > 0) {
          setLockoutSeconds(res.lockedOutSeconds);
        }
        if (typeof res.remainingAttempts === 'number') {
          setAttemptsRemaining(res.remainingAttempts);
        }
        toast.error(res.message || 'Invalid administrator password.');
      }
    } catch {
      toast.error('An error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/70 via-white to-red-50/50 text-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-primary selection:text-white">
      <SEO
        title="Admin Security Access - Wisdom Travel and Tours"
        description="Protected administrator security portal for Wisdom Travel and Tours management."
      />

      {/* Background Soft Accents (matching main website hero & footer) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-100/70 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-red-50/50 rounded-full blur-2xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6 flex flex-col items-center">
          <Link
            to="/"
            className="inline-block transition-transform duration-300 hover:scale-105 mb-2 focus:outline-none"
            title="Return to Wisdom Travel Home"
          >
            <img
              src="/WisdomLogo.png"
              alt="Wisdom Travel and Tours"
              className="h-20 w-auto object-contain drop-shadow-sm select-none"
            />
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Portal Verification</span>
          </div>
        </div>

        {/* Security Card */}
        <Card className="bg-white/95 border-slate-200/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
          <CardHeader className="space-y-1 pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" /> Admin Security
              </CardTitle>
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Protected Access
              </span>
            </div>
            <CardDescription className="text-slate-500 text-xs">
              Enter your master password to access package management, destinations, and bookings.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 pt-5">
            {/* Lockout Notification Banner */}
            {lockoutSeconds > 0 && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Security Lockout Active</p>
                  <p className="text-[11px] text-red-700 mt-0.5">
                    Too many failed attempts. Try again in{' '}
                    <span className="font-mono font-bold text-red-900">
                      {Math.floor(lockoutSeconds / 60)}m {lockoutSeconds % 60}s
                    </span>
                    .
                  </p>
                </div>
              </div>
            )}

            {/* Warning for attempts remaining */}
            {attemptsRemaining !== null && lockoutSeconds === 0 && attemptsRemaining < 3 && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  Caution: <strong>{attemptsRemaining}</strong> attempt{attemptsRemaining === 1 ? '' : 's'} remaining before 15m lockout.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="admin-password"
                    className="text-slate-700 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-primary" /> Master Password
                  </Label>
                </div>

                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter admin password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading || lockoutSeconds > 0}
                    autoFocus
                    className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 h-11 pl-10 pr-11 rounded-xl text-sm focus-visible:ring-primary/40 focus-visible:border-primary transition-all"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded-md hover:bg-slate-200/50"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Options Row */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-primary focus:ring-primary w-3.5 h-3.5"
                  />
                  <span className="font-medium text-slate-600">Keep me signed in</span>
                </label>

                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary/70" /> Auto-expires
                </span>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || lockoutSeconds > 0 || !password.trim()}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold text-xs rounded-xl shadow-md hover:shadow-lg shadow-primary/25 transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...
                  </span>
                ) : (
                  <>
                    Unlock Admin Dashboard <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back to Website Link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs text-slate-500 hover:text-primary transition-colors underline-offset-4 hover:underline font-medium inline-flex items-center gap-1.5"
          >
            ← Return to Main Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
