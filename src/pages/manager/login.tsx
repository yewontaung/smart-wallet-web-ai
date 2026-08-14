import React, { useState } from 'react';
import { Shield, ArrowRight, UserCheck } from 'lucide-react';
import { useAdmin } from '../../hooks/use-admin';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export function ManagerLoginPage() {
  const navigate = useNavigate();
  const { login } = useAdmin();

  const [username, setUsername] = useState('admin.manager');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const res = login(username, password);
      if (res.success) {
        navigate('/admin/overview');
      } else {
        setError(res.error || 'Login failed.');
      }
      setLoading(false);
    }, 400);
  };

  const handleQuickDemo = () => {
    setUsername('admin.manager');
    setPassword('admin123');
    login('admin.manager', 'admin123');
    navigate('/admin/overview');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4 relative font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-black pointer-events-none" />

      <Card className="relative w-full max-w-md bg-zinc-900 border-zinc-800 shadow-2xl p-2">
        <CardHeader className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto shadow-lg">
            <Shield className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-white">
            Banking Admin Portal
          </CardTitle>
          <CardDescription className="text-xs text-zinc-400">
            Manager Sign-In & Risk Control Console
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">Manager Username</label>
              <Input
                type="text"
                placeholder="admin.manager"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-sm font-bold gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In as Admin Manager'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 pt-2 border-t border-zinc-800/80">
          <Button
            onClick={handleQuickDemo}
            variant="secondary"
            className="w-full text-xs font-semibold gap-2 border border-zinc-700"
          >
            <UserCheck className="w-4 h-4 text-purple-400" />
            Quick Demo Auto-Login (Super Admin)
          </Button>

          <button
            onClick={() => navigate('/')}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors block mx-auto pt-1"
          >
            ← Return to Wallet User Interface
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
