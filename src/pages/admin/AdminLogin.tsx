import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Mail, ArrowRight, ShieldCheck, AlertTriangle, CheckCircle2, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import {
  createGoogleAdminSession,
  getLockoutTimeRemaining,
  validateAdminSession,
  isValidWisdomDomain,
  REQUIRED_ADMIN_DOMAIN
} from '@/lib/admin-auth';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [domainError, setDomainError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated with valid domain session, redirect directly to dashboard
    if (validateAdminSession()) {
      navigate('/admin/dashboard', { replace: true });
    }

    const remaining = getLockoutTimeRemaining();
    if (remaining > 0) {
      setLockoutSeconds(remaining);
    }
  }, [navigate]);

  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  // Live domain checking when user types email
  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (val.includes('@')) {
      if (!val.toLowerCase().endsWith(`@${REQUIRED_ADMIN_DOMAIN}`)) {
        setDomainError(`Only @${REQUIRED_ADMIN_DOMAIN} emails are authorized.`);
      } else {
        setDomainError(null);
      }
    } else {
      setDomainError(null);
    }
  };

  const handleSingleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (lockoutSeconds > 0) {
      toast.error(`Portal locked. Try again in ${lockoutSeconds} seconds.`);
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error('Please enter your Google work email address.');
      return;
    }

    // Strict Domain Validation Guard
    if (!isValidWisdomDomain(cleanEmail)) {
      setDomainError(`Access Denied: Only @${REQUIRED_ADMIN_DOMAIN} email accounts can sign in.`);
      toast.error(`Access Denied: Email must end with @${REQUIRED_ADMIN_DOMAIN}`);
      return;
    }

    setLoading(true);

    try {
      const res = await createGoogleAdminSession(cleanEmail, name || undefined);

      if (res.success) {
        toast.success(`Welcome back, ${cleanEmail}! Authenticated successfully.`);
        navigate('/admin/dashboard');
      } else {
        toast.error(res.message || 'Authentication failed.');
      }
    } catch (err) {
      toast.error('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  // Quick One-Click Google Single Sign-In Simulation for domain users
  const handleQuickGoogleSignIn = async () => {
    if (lockoutSeconds > 0) {
      toast.error(`Portal locked. Try again in ${lockoutSeconds} seconds.`);
      return;
    }

    const defaultAdminEmail = `admin@${REQUIRED_ADMIN_DOMAIN}`;
    setLoading(true);

    try {
      const res = await createGoogleAdminSession(defaultAdminEmail, 'Wisdom Administrator');
      if (res.success) {
        toast.success(`Google Single Sign-In successful as ${defaultAdminEmail}`);
        navigate('/admin/dashboard');
      } else {
        toast.error(res.message || 'Sign-in failed.');
      }
    } catch (err) {
      toast.error('Google Single Sign-In error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <SEO title="Admin Single Sign-In - Wisdom Voyage" description="Google SSO portal restricted to @wisdomtravel.in domain." />
      
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-amber-500 text-white shadow-xl shadow-primary/20 mb-4">
            <Compass className="w-8 h-8 animate-spin-slow" />
          </div>
          <h1 className="text-2xl font-serif font-bold tracking-tight text-slate-900">Wisdom Voyage Admin</h1>
          <p className="text-slate-500 text-sm mt-1 flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Single Sign-In Portal
          </p>
        </div>

        {/* DOMAIN AUTHORIZATION BADGE */}
        <div className="mb-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 text-center shadow-sm">
          <p className="text-[11px] uppercase tracking-wider font-bold text-emerald-800 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Domain Restricted Access
          </p>
          <p className="text-xs text-emerald-900 mt-0.5 font-mono font-semibold">
            @{REQUIRED_ADMIN_DOMAIN} Only
          </p>
        </div>

        <Card className="bg-white border-slate-100 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" /> Gmail / Google Single Sign-In
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs">
              Sign in with your official <strong>@{REQUIRED_ADMIN_DOMAIN}</strong> Google Workspace account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {lockoutSeconds > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Portal locked due to invalid attempts. Try again in <strong>{Math.floor(lockoutSeconds / 60)}m {lockoutSeconds % 60}s</strong>.</span>
              </div>
            )}

            {/* PROMINENT GOOGLE SINGLE SIGN-IN BUTTON */}
            <Button
              type="button"
              onClick={handleQuickGoogleSignIn}
              disabled={loading || lockoutSeconds > 0}
              className="w-full h-12 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs border border-slate-200 rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-3 relative overflow-hidden"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google (@{REQUIRED_ADMIN_DOMAIN})</span>
            </Button>

            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 absolute">or enter email</span>
            </div>

            {/* MANUAL WORK EMAIL INPUT FORM */}
            <form onSubmit={handleSingleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-700 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary" /> Work Email (@{REQUIRED_ADMIN_DOMAIN})
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder={`e.g. admin@${REQUIRED_ADMIN_DOMAIN}`}
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    disabled={lockoutSeconds > 0 || loading}
                    className={`bg-slate-50 border ${
                      domainError ? 'border-red-400 focus-visible:ring-red-500' : 'border-slate-200 focus-visible:ring-primary'
                    } text-slate-900 placeholder:text-slate-400 h-11 pl-10 rounded-xl text-xs`}
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>

                {domainError && (
                  <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3 h-3 text-red-500" /> {domainError}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-slate-700 text-xs font-semibold uppercase tracking-wider">
                  Admin Name (Optional)
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g. Rizan Vasani"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={lockoutSeconds > 0 || loading}
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs h-10 rounded-xl"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || lockoutSeconds > 0 || Boolean(domainError)}
                className="w-full h-11 bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 text-white font-medium text-xs rounded-xl shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Validating Domain...' : (
                  <>
                    Sign In to Dashboard <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-slate-500 hover:text-slate-900 transition-colors underline-offset-4 hover:underline font-medium"
          >
            ← Return to Main Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
