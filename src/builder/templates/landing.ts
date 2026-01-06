/**
 * قالب صفحة الهبوط - تصميم عصري للحملات التسويقية
 * يدعم RTL والألوان المخصصة
 */

export interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface TemplateOptions {
  title: string;
  description?: string;
  colors?: Partial<TemplateColors>;
  rtl?: boolean;
}

const defaultColors: TemplateColors = {
  primary: '#1E88E5',
  secondary: '#FFB74D',
  accent: '#66BB6A',
  background: '#FFFFFF',
  text: '#1a1a2e',
};

export function generateLandingTemplate(options: TemplateOptions): Record<string, string> {
  const colors = { ...defaultColors, ...options.colors };
  const dir = options.rtl !== false ? 'rtl' : 'ltr';
  const lang = options.rtl !== false ? 'ar' : 'en';

  const html = `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.title}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="header">
    <nav class="nav container">
      <h1 class="logo">${options.title}</h1>
      <ul class="nav-links">
        <li><a href="#features">المميزات</a></li>
        <li><a href="#about">من نحن</a></li>
        <li><a href="#contact">تواصل معنا</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section class="hero">
      <div class="container">
        <h2 class="hero-title">${options.title}</h2>
        <p class="hero-description">${options.description || 'اكتشف الحل الأمثل لاحتياجاتك'}</p>
        <a href="#contact" class="btn btn-primary">ابدأ الآن</a>
      </div>
    </section>

    <section id="features" class="features">
      <div class="container">
        <h2 class="section-title">المميزات</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h3>سرعة فائقة</h3>
            <p>أداء عالٍ وسرعة تحميل ممتازة</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3>تصميم عصري</h3>
            <p>واجهة جذابة وسهلة الاستخدام</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>متوافق مع الأجهزة</h3>
            <p>يعمل على جميع الشاشات</p>
          </div>
        </div>
      </div>
    </section>

    <section id="about" class="about">
      <div class="container">
        <h2 class="section-title">من نحن</h2>
        <p class="about-text">نحن فريق متخصص في تقديم أفضل الحلول الرقمية.</p>
      </div>
    </section>

    <section id="contact" class="contact">
      <div class="container">
        <h2 class="section-title">تواصل معنا</h2>
        <form class="contact-form">
          <input type="text" placeholder="الاسم" required>
          <input type="email" placeholder="البريد الإلكتروني" required>
          <textarea placeholder="رسالتك" rows="4" required></textarea>
          <button type="submit" class="btn btn-primary">إرسال</button>
        </form>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container">
      <p>© ${new Date().getFullYear()} ${options.title}. جميع الحقوق محفوظة.</p>
    </div>
  </footer>

  <script src="main.js"></script>
</body>
</html>`;

  const css = `/* قالب صفحة الهبوط - Ntfly */
:root {
  --primary: ${colors.primary};
  --secondary: ${colors.secondary};
  --accent: ${colors.accent};
  --background: ${colors.background};
  --text: ${colors.text};
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'IBM Plex Sans Arabic', 'Segoe UI', sans-serif;
  background: var(--background);
  color: var(--text);
  line-height: 1.6;
  direction: ${dir};
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Header */
.header {
  background: var(--background);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 100;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo {
  color: var(--primary);
  font-size: 1.5rem;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-links a {
  color: var(--text);
  text-decoration: none;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: var(--primary);
}

/* Hero */
.hero {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  padding: 10rem 0 6rem;
  text-align: center;
  margin-top: 60px;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-description {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: white;
  color: var(--primary);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

/* Sections */
section {
  padding: 5rem 0;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 3rem;
  color: var(--primary);
}

/* Features */
.features {
  background: #f8f9fa;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* About */
.about-text {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  font-size: 1.1rem;
}

/* Contact */
.contact-form {
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-form input,
.contact-form textarea {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-family: inherit;
  font-size: 1rem;
  direction: ${dir};
}

.contact-form input:focus,
.contact-form textarea:focus {
  outline: none;
  border-color: var(--primary);
}

/* Footer */
.footer {
  background: var(--text);
  color: white;
  text-align: center;
  padding: 2rem 0;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .hero-title {
    font-size: 2rem;
  }
}`;

  const js = `// قالب صفحة الهبوط - Ntfly
document.addEventListener('DOMContentLoaded', function() {
  // تفعيل التمرير السلس
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // معالجة النموذج
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('شكراً لتواصلك معنا! سنرد عليك قريباً.');
      form.reset();
    });
  }

  console.log('تم تحميل الصفحة بنجاح - Ntfly');
});`;

  return {
    'index.html': html,
    'styles.css': css,
    'main.js': js,
  };
}

export const landingTemplateMeta = {
  id: 'landing',
  name: 'صفحة هبوط',
  nameEn: 'Landing Page',
  description: 'قالب صفحة هبوط عصري للحملات التسويقية',
  thumbnail: '🚀',
};
