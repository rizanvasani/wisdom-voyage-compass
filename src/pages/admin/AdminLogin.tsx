import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Lock, Key, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import SEO from '@/components/SEO';

const DEFAULT_PASSCODE = 'admin123';

export const AdminLogin: React.FC = () => {
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (passcode.trim() === DEFAULT_PASSCODE || passcode.trim() === 'admin') {
      localStorage.setItem('wisdom_admin_session', 'true');
      toast.success('Welcome back, Admin!');
      navigate('/admin/dashboard');
    } else {
      toast.error('Invalid admin passcode. Default is admin123');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <SEO title="Admin Login - Wisdom Voyage Compass" description="Portal access for website administrators." />
      
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-amber-500 text-white shadow-xl shadow-primary/20 mb-4">
            <Compass className="w-8 h-8 animate-spin-slow" />
          </div>
          <h1 className="text-2xl font-serif font-bold tracking-tight text-slate-900">Wisdom Voyage Admin</h1>
          <p className="text-slate-500 text-sm mt-1">Backend Management Portal</p>
        </div>

        <Card className="bg-white border-slate-100 backdrop-blur-xl shadow-xl rounded-3xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" /> Sign In to Admin
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs">
              Enter your admin passcode to access package management, destinations, and customer inquiries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passcode" className="text-slate-700 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-primary" /> Admin Passcode
                </Label>
                <div className="relative">
                  <Input
                    id="passcode"
                    type="password"
                    placeholder="Enter passcode (Default: admin123)"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-primary h-11 pl-10 rounded-xl"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
                <p className="text-[11px] text-slate-500">
                  Tip: Default passcode is <code className="text-primary font-mono bg-slate-100 px-1 py-0.5 rounded">admin123</code>
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 text-white font-medium text-sm rounded-xl shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating...' : (
                  <>
                    Access Dashboard <ArrowRight className="w-4 h-4" />
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
