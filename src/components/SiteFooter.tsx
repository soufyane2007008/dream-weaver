/**
 * فوتر الموقع مع معلومات المطور
 * يظهر في جميع صفحات التطبيق
 */

import { Instagram, Mail, Phone } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t bg-card py-8 mt-auto">
      <div className="container-rtl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* معلومات المطور */}
          <div className="text-center md:text-start">
            <p className="font-semibold text-foreground mb-2">تطوير: Soufyane</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
              <a 
                href="https://instagram.com/soufiane__lr__77" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <Instagram className="h-4 w-4" />
                soufiane__lr__77
              </a>
              
              <a 
                href="mailto:lrsoufyane2007@gmail.com"
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                lrsoufyane2007@gmail.com
              </a>
              
              <span className="flex items-center gap-1.5">
                <Phone className="h-4 w-4" />
                0638369776
              </span>
            </div>
          </div>
          
          {/* شعار وإشعار */}
          <div className="text-center md:text-end">
            <p className="font-bold text-gradient text-lg mb-1">Ntfly</p>
            <p className="text-xs text-muted-foreground bg-warning/10 text-warning px-3 py-1 rounded-full">
              هذا إصدار تجريبي لمدة شهر
            </p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Ntfly Digital. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
