/**
 * الصفحة الرئيسية لمنصة Ntfly
 * تعرض Hero section ومميزات المنصة
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Palette, Globe, Zap, Shield, Download } from 'lucide-react';
import { t } from '@/i18n';

export default function Home() {
  const features = [
    {
      icon: Rocket,
      title: 'سرعة فائقة',
      description: 'أنشئ موقعك في دقائق معدودة باستخدام الذكاء الاصطناعي',
    },
    {
      icon: Palette,
      title: 'تصميمات عصرية',
      description: 'قوالب احترافية متوافقة مع جميع الأجهزة',
    },
    {
      icon: Globe,
      title: 'دعم عربي كامل',
      description: 'واجهة عربية بالكامل مع دعم RTL',
    },
    {
      icon: Zap,
      title: 'ذكاء اصطناعي',
      description: 'تقنيات AI متقدمة لتوليد المحتوى',
    },
    {
      icon: Shield,
      title: 'أمان متقدم',
      description: 'تشفير متقدم وحماية بياناتك',
    },
    {
      icon: Download,
      title: 'تصدير سهل',
      description: 'حمّل موقعك كملف ZIP جاهز للنشر',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        
        <div className="container-rtl relative">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-gradient">Ntfly</span>
              <br />
              أنشئ موقعك في دقائق
            </h1>
            
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              {t('home.heroDescription')}
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/login">
                <Button size="lg" className="btn-hero min-w-[200px]">
                  {t('home.cta')}
                </Button>
              </Link>
              
              <Link to="/login">
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  تسجيل الدخول
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container-rtl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">{t('home.features')}</h2>
            <p className="text-muted-foreground">كل ما تحتاجه لبناء موقعك الاحترافي</p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="card-featured">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container-rtl text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {t('footer.company')}. {t('footer.rights')}</p>
        </div>
      </footer>
    </div>
  );
}
