/**
 * صفحة تسجيل الدخول لمنصة Ntfly
 * تدعم Email/Password + Google + GitHub
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithGitHub } from '@/firebase/firebase.auth';
import { getMockMode } from '@/firebase';
import { t } from '@/i18n';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { user, error } = await signInWithEmail(email, password);
        if (error) {
          toast({ title: t('auth.loginError'), description: error, variant: 'destructive' });
        } else if (user) {
          toast({ title: t('auth.loginSuccess') });
          navigate('/dashboard');
        }
      } else {
        const { user, error } = await signUpWithEmail(email, password, name);
        if (error) {
          toast({ title: t('auth.registerError'), description: error, variant: 'destructive' });
        } else if (user) {
          toast({ title: t('auth.registerSuccess') });
          navigate('/dashboard');
        }
      }
    } catch {
      toast({ title: t('errors.unknownError'), variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const { user, error } = await signInWithGoogle();
    setIsLoading(false);
    
    if (error) {
      toast({ title: 'خطأ', description: error, variant: 'destructive' });
    } else if (user) {
      toast({ title: 'تم تسجيل الدخول بنجاح' });
      navigate('/dashboard');
    }
  };

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    const { user, error } = await signInWithGitHub();
    setIsLoading(false);
    
    if (error) {
      toast({ title: 'خطأ', description: error, variant: 'destructive' });
    } else if (user) {
      toast({ title: 'تم تسجيل الدخول بنجاح' });
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-gradient">Ntfly</CardTitle>
          <CardDescription>
            {isLogin ? t('auth.login') : t('auth.register')}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">الاسم</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="أدخل اسمك" disabled={isLoading} />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" required disabled={isLoading} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} disabled={isLoading} />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : isLogin ? t('auth.login') : t('auth.register')}
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">أو</span></div>
          </div>
          
          <div className="grid gap-2">
            <Button variant="outline" onClick={handleGoogleSignIn} disabled={isLoading}>Google تسجيل الدخول بـ</Button>
            <Button variant="outline" onClick={handleGitHubSignIn} disabled={isLoading}>GitHub تسجيل الدخول بـ</Button>
          </div>
          
          <div className="text-center text-sm">
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline" disabled={isLoading}>
              {isLogin ? 'ليس لديك حساب؟ سجّل الآن' : 'لديك حساب؟ سجّل دخولك'}
            </button>
          </div>

          {getMockMode() && (
            <div className="p-3 bg-muted rounded-lg text-xs text-muted-foreground text-center">
              📦 وضع Mock نشط - أدخل إعدادات Firebase من لوحة الأدمن للتفعيل الكامل
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
