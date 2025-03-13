import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, user, loading, initialized } = useAuthContext();
  const navigate = useNavigate();
  const router = useRouter();
  const from = router.state.location.state?.from as string | undefined;

  useEffect(() => {
    // Si l'authentification n'est pas initialisée, attendre
    if (!initialized) return;

    // Une fois authentifié et avec les données utilisateur, rediriger
    if (isAuthenticated && user) {
      const redirectPath = from || (user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
      navigate({ to: redirectPath });
    }
  }, [initialized, isAuthenticated, navigate, user, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const response = await login({ email, password });
      const redirectPath = from || (response.user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
      navigate({ to: redirectPath });
    } catch (error) {
      console.error('Login failed:', error);
      setIsSubmitting(false);
    }
  };

  // Pendant l'initialisation ou le chargement
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">{!initialized ? 'Initializing...' : 'Loading...'}</span>
      </div>
    );
  }

  // Si déjà authentifié, afficher un loader pendant la redirection
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Redirecting...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 