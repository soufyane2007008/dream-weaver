/**
 * قالب موقع الأعمال - للشركات والمؤسسات
 * تصميم احترافي مع صفحات متعددة
 */

import type { TemplateColors, TemplateOptions } from './landing';

const defaultColors: TemplateColors = {
  primary: '#1565C0',
  secondary: '#0D47A1',
  accent: '#4CAF50',
  background: '#FFFFFF',
  text: '#263238',
};

export function generateBusinessTemplate(options: TemplateOptions): Record<string, string> {
  const colors = { ...defaultColors, ...options.colors };
  const dir = options.rtl !== false ? 'rtl' : 'ltr';
  const lang = options.rtl !== false ? 'ar' : 'en';

  const html = `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.title} - موقع الشركة</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="header">
    <div class="container">
      <nav class="nav">
        <h1 class="logo">${options.title}</h1>
        <ul class="nav-menu">
          <li><a href="#home">الرئيسية</a></li>
          <li><a href="#services">خدماتنا</a></li>
          <li><a href="#about">من نحن</a></li>
          <li><a href="#team">فريقنا</a></li>
          <li><a href="#contact">اتصل بنا</a></li>
        </ul>
        <button class="menu-toggle" aria-label="القائمة">☰</button>
      </nav>
    </div>
  </header>

  <main>
    <section id="home" class="hero">
      <div class="container">
        <div class="hero-content">
          <h2>مرحباً بكم في ${options.title}</h2>
          <p>${options.description || 'شريككم الموثوق في النجاح'}</p>
          <div class="hero-buttons">
            <a href="#services" class="btn btn-primary">خدماتنا</a>
            <a href="#contact" class="btn btn-outline">تواصل معنا</a>
          </div>
        </div>
      </div>
    </section>

    <section id="services" class="services">
      <div class="container">
        <h2 class="section-title">خدماتنا</h2>
        <div class="services-grid">
          <div class="service-card">
            <span class="service-icon">💼</span>
            <h3>استشارات الأعمال</h3>
            <p>نقدم استشارات متخصصة لتطوير أعمالك</p>
          </div>
          <div class="service-card">
            <span class="service-icon">📊</span>
            <h3>التحليل والتخطيط</h3>
            <p>تحليل شامل ووضع خطط استراتيجية</p>
          </div>
          <div class="service-card">
            <span class="service-icon">🎯</span>
            <h3>التسويق الرقمي</h3>
            <p>حلول تسويقية متكاملة</p>
          </div>
          <div class="service-card">
            <span class="service-icon">💻</span>
            <h3>الحلول التقنية</h3>
            <p>تطوير أنظمة وتطبيقات مخصصة</p>
          </div>
        </div>
      </div>
    </section>

    <section id="about" class="about">
      <div class="container">
        <div class="about-content">
          <div class="about-text">
            <h2>من نحن</h2>
            <p>نحن فريق من الخبراء المتخصصين في مجال الأعمال والتقنية. نسعى دائماً لتقديم أفضل الحلول لعملائنا.</p>
            <ul class="about-features">
              <li>✓ خبرة تزيد عن 10 سنوات</li>
              <li>✓ فريق محترف ومتخصص</li>
              <li>✓ دعم فني على مدار الساعة</li>
            </ul>
          </div>
          <div class="about-stats">
            <div class="stat">
              <span class="stat-number">500+</span>
              <span class="stat-label">عميل سعيد</span>
            </div>
            <div class="stat">
              <span class="stat-number">1000+</span>
              <span class="stat-label">مشروع منجز</span>
            </div>
            <div class="stat">
              <span class="stat-number">50+</span>
              <span class="stat-label">خبير متخصص</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="contact" class="contact">
      <div class="container">
        <h2 class="section-title">اتصل بنا</h2>
        <div class="contact-grid">
          <div class="contact-info">
            <div class="info-item">
              <span>📍</span>
              <p>المملكة العربية السعودية</p>
            </div>
            <div class="info-item">
              <span>📞</span>
              <p>+966 123 456 789</p>
            </div>
            <div class="info-item">
              <span>✉️</span>
              <p>info@${options.title.toLowerCase().replace(/\s/g, '')}.com</p>
            </div>
          </div>
          <form class="contact-form">
            <input type="text" placeholder="الاسم الكامل" required>
            <input type="email" placeholder="البريد الإلكتروني" required>
            <input type="text" placeholder="الموضوع" required>
            <textarea placeholder="رسالتك" rows="5" required></textarea>
            <button type="submit" class="btn btn-primary">إرسال الرسالة</button>
          </form>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <h3>${options.title}</h3>
          <p>شريككم نحو النجاح</p>
        </div>
        <div class="footer-links">
          <h4>روابط سريعة</h4>
          <a href="#home">الرئيسية</a>
          <a href="#services">خدماتنا</a>
          <a href="#about">من نحن</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© ${new Date().getFullYear()} ${options.title}. جميع الحقوق محفوظة.</p>
      </div>
    </div>
  </footer>

  <script src="main.js"></script>
</body>
</html>`;

  const css = `/* قالب موقع الأعمال - Ntfly */
:root {
  --primary: ${colors.primary};
  --secondary: ${colors.secondary};
  --accent: ${colors.accent};
  --background: ${colors.background};
  --text: ${colors.text};
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'IBM Plex Sans Arabic', 'Segoe UI', sans-serif;
  background: var(--background);
  color: var(--text);
  line-height: 1.7;
  direction: ${dir};
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }

/* Header */
.header {
  background: white;
  box-shadow: 0 2px 20px rgba(0,0,0,0.08);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo { color: var(--primary); font-size: 1.75rem; font-weight: 700; }

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2.5rem;
}

.nav-menu a {
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-menu a:hover { color: var(--primary); }

.menu-toggle { display: none; background: none; border: none; font-size: 1.5rem; cursor: pointer; }

/* Hero */
.hero {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  padding: 12rem 0 8rem;
  text-align: center;
}

.hero h2 { font-size: 3.5rem; margin-bottom: 1.5rem; }
.hero p { font-size: 1.3rem; margin-bottom: 2.5rem; opacity: 0.95; }

.hero-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

/* Buttons */
.btn {
  display: inline-block;
  padding: 1rem 2.5rem;
  border-radius: 0.75rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  cursor: pointer;
  border: 2px solid transparent;
}

.btn-primary { background: white; color: var(--primary); }
.btn-outline { background: transparent; color: white; border-color: white; }
.btn:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.2); }

/* Sections */
section { padding: 6rem 0; }
.section-title { text-align: center; font-size: 2.5rem; margin-bottom: 4rem; color: var(--primary); }

/* Services */
.services { background: #f8fafc; }
.services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 2rem; }

.service-card {
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
  transition: all 0.3s;
}

.service-card:hover { transform: translateY(-8px); box-shadow: 0 15px 40px rgba(0,0,0,0.1); }
.service-icon { font-size: 3rem; display: block; margin-bottom: 1.5rem; }
.service-card h3 { color: var(--primary); margin-bottom: 1rem; }

/* About */
.about-content { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
.about-text h2 { font-size: 2rem; color: var(--primary); margin-bottom: 1.5rem; }
.about-features { list-style: none; margin-top: 1.5rem; }
.about-features li { padding: 0.5rem 0; }

.about-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.stat { background: var(--primary); color: white; padding: 2rem; border-radius: 1rem; text-align: center; }
.stat-number { display: block; font-size: 2.5rem; font-weight: 700; }
.stat-label { opacity: 0.9; }

/* Contact */
.contact { background: #f8fafc; }
.contact-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 3rem; }

.info-item { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
.info-item span { font-size: 1.5rem; }

.contact-form { display: flex; flex-direction: column; gap: 1rem; }
.contact-form input, .contact-form textarea {
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-family: inherit;
  font-size: 1rem;
  direction: ${dir};
}
.contact-form input:focus, .contact-form textarea:focus { outline: none; border-color: var(--primary); }

/* Footer */
.footer { background: var(--text); color: white; padding: 4rem 0 2rem; }
.footer-content { display: grid; grid-template-columns: 2fr 1fr; gap: 3rem; margin-bottom: 3rem; }
.footer-brand h3 { font-size: 1.5rem; margin-bottom: 0.5rem; }
.footer-links h4 { margin-bottom: 1rem; }
.footer-links a { display: block; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 0.5rem; }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem; text-align: center; opacity: 0.8; }

/* Responsive */
@media (max-width: 768px) {
  .nav-menu { display: none; }
  .menu-toggle { display: block; }
  .hero h2 { font-size: 2rem; }
  .about-content, .contact-grid, .footer-content { grid-template-columns: 1fr; }
  .about-stats { grid-template-columns: 1fr; }
}`;

  const js = `// قالب موقع الأعمال - Ntfly
document.addEventListener('DOMContentLoaded', function() {
  // التمرير السلس
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // قائمة الموبايل
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  // النموذج
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('شكراً لتواصلك! سنرد عليك في أقرب وقت.');
      form.reset();
    });
  }

  console.log('موقع الأعمال جاهز - Ntfly');
});`;

  return { 'index.html': html, 'styles.css': css, 'main.js': js };
}

export const businessTemplateMeta = {
  id: 'business',
  name: 'موقع أعمال',
  nameEn: 'Business Site',
  description: 'قالب احترافي للشركات والمؤسسات',
  thumbnail: '💼',
};
