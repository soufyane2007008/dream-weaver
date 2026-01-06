/**
 * قالب معرض الأعمال - للمصممين والمطورين
 * تصميم أنيق لعرض المشاريع والأعمال
 */

import type { TemplateColors, TemplateOptions } from './landing';

const defaultColors: TemplateColors = {
  primary: '#6366F1',
  secondary: '#8B5CF6',
  accent: '#EC4899',
  background: '#FAFAFA',
  text: '#1E293B',
};

export function generatePortfolioTemplate(options: TemplateOptions): Record<string, string> {
  const colors = { ...defaultColors, ...options.colors };
  const dir = options.rtl !== false ? 'rtl' : 'ltr';
  const lang = options.rtl !== false ? 'ar' : 'en';

  const html = `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.title} - معرض الأعمال</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="header">
    <div class="container">
      <nav class="nav">
        <a href="#" class="logo">${options.title}</a>
        <ul class="nav-links">
          <li><a href="#about">عني</a></li>
          <li><a href="#work">أعمالي</a></li>
          <li><a href="#skills">مهاراتي</a></li>
          <li><a href="#contact">تواصل</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main>
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <span class="hero-tag">مرحباً، أنا</span>
          <h1>${options.title}</h1>
          <p class="hero-desc">${options.description || 'مطور ومصمم شغوف بالإبداع'}</p>
          <div class="hero-cta">
            <a href="#work" class="btn btn-primary">أعمالي</a>
            <a href="#contact" class="btn btn-ghost">تواصل معي</a>
          </div>
        </div>
        <div class="hero-visual">
          <div class="avatar-placeholder">👨‍💻</div>
        </div>
      </div>
    </section>

    <section id="about" class="about">
      <div class="container">
        <h2 class="section-title">عني</h2>
        <div class="about-grid">
          <div class="about-text">
            <p>أنا مطور ومصمم متخصص في إنشاء تجارب رقمية مميزة. أحب تحويل الأفكار إلى واقع من خلال الكود والتصميم.</p>
            <p>أعمل على مشاريع متنوعة تشمل المواقع الإلكترونية، تطبيقات الويب، والهوية البصرية.</p>
          </div>
          <div class="about-highlights">
            <div class="highlight">
              <span class="highlight-number">5+</span>
              <span class="highlight-text">سنوات خبرة</span>
            </div>
            <div class="highlight">
              <span class="highlight-number">100+</span>
              <span class="highlight-text">مشروع</span>
            </div>
            <div class="highlight">
              <span class="highlight-number">50+</span>
              <span class="highlight-text">عميل</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="work" class="work">
      <div class="container">
        <h2 class="section-title">أعمالي</h2>
        <div class="work-grid">
          <article class="work-card">
            <div class="work-image">🖥️</div>
            <div class="work-info">
              <h3>موقع شركة تقنية</h3>
              <p>تصميم وتطوير موقع متكامل</p>
              <span class="work-tag">تطوير ويب</span>
            </div>
          </article>
          <article class="work-card">
            <div class="work-image">📱</div>
            <div class="work-info">
              <h3>تطبيق موبايل</h3>
              <p>تصميم واجهة مستخدم</p>
              <span class="work-tag">UI/UX</span>
            </div>
          </article>
          <article class="work-card">
            <div class="work-image">🎨</div>
            <div class="work-info">
              <h3>هوية بصرية</h3>
              <p>تصميم شعار وهوية كاملة</p>
              <span class="work-tag">تصميم</span>
            </div>
          </article>
          <article class="work-card">
            <div class="work-image">🛒</div>
            <div class="work-info">
              <h3>متجر إلكتروني</h3>
              <p>بناء منصة تجارة إلكترونية</p>
              <span class="work-tag">E-commerce</span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="skills" class="skills">
      <div class="container">
        <h2 class="section-title">مهاراتي</h2>
        <div class="skills-grid">
          <div class="skill-item">
            <span class="skill-icon">⚛️</span>
            <span class="skill-name">React</span>
          </div>
          <div class="skill-item">
            <span class="skill-icon">🟦</span>
            <span class="skill-name">TypeScript</span>
          </div>
          <div class="skill-item">
            <span class="skill-icon">🎨</span>
            <span class="skill-name">CSS/Tailwind</span>
          </div>
          <div class="skill-item">
            <span class="skill-icon">🟢</span>
            <span class="skill-name">Node.js</span>
          </div>
          <div class="skill-item">
            <span class="skill-icon">🎭</span>
            <span class="skill-name">Figma</span>
          </div>
          <div class="skill-item">
            <span class="skill-icon">🔥</span>
            <span class="skill-name">Firebase</span>
          </div>
        </div>
      </div>
    </section>

    <section id="contact" class="contact">
      <div class="container">
        <h2 class="section-title">تواصل معي</h2>
        <div class="contact-content">
          <p>هل لديك مشروع أو فكرة؟ دعنا نتحدث!</p>
          <form class="contact-form">
            <input type="text" placeholder="اسمك" required>
            <input type="email" placeholder="بريدك الإلكتروني" required>
            <textarea placeholder="رسالتك" rows="5" required></textarea>
            <button type="submit" class="btn btn-primary">إرسال</button>
          </form>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container">
      <p>© ${new Date().getFullYear()} ${options.title}. صُنع بـ ❤️</p>
    </div>
  </footer>

  <script src="main.js"></script>
</body>
</html>`;

  const css = `/* قالب معرض الأعمال - Ntfly */
:root {
  --primary: ${colors.primary};
  --secondary: ${colors.secondary};
  --accent: ${colors.accent};
  --bg: ${colors.background};
  --text: ${colors.text};
  --gradient: linear-gradient(135deg, var(--primary), var(--secondary));
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'IBM Plex Sans Arabic', 'Segoe UI', sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.7;
  direction: ${dir};
}

.container { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; }

/* Header */
.header {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 100;
  background: rgba(250,250,250,0.9);
  backdrop-filter: blur(10px);
}

.nav { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 0; }
.logo { font-size: 1.5rem; font-weight: 700; color: var(--primary); text-decoration: none; }

.nav-links { display: flex; list-style: none; gap: 2rem; }
.nav-links a { color: var(--text); text-decoration: none; font-weight: 500; transition: color 0.3s; }
.nav-links a:hover { color: var(--primary); }

/* Hero */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 80px;
}

.hero .container { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
.hero-tag { color: var(--primary); font-weight: 600; margin-bottom: 1rem; display: block; }
.hero h1 { font-size: 4rem; margin-bottom: 1.5rem; background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero-desc { font-size: 1.25rem; color: #64748b; margin-bottom: 2rem; }
.hero-cta { display: flex; gap: 1rem; }

.hero-visual { display: flex; justify-content: center; }
.avatar-placeholder { font-size: 12rem; }

/* Buttons */
.btn {
  display: inline-block;
  padding: 0.875rem 2rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  cursor: pointer;
  border: 2px solid transparent;
}

.btn-primary { background: var(--gradient); color: white; }
.btn-ghost { background: transparent; color: var(--primary); border-color: var(--primary); }
.btn:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(99,102,241,0.3); }

/* Sections */
section { padding: 6rem 0; }
.section-title { text-align: center; font-size: 2.5rem; margin-bottom: 3rem; }

/* About */
.about-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 4rem; align-items: center; }
.about-text p { margin-bottom: 1rem; color: #475569; }
.about-highlights { display: flex; flex-direction: column; gap: 1.5rem; }
.highlight { background: white; padding: 1.5rem; border-radius: 1rem; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
.highlight-number { display: block; font-size: 2.5rem; font-weight: 700; color: var(--primary); }

/* Work */
.work { background: white; }
.work-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; }
.work-card { background: var(--bg); border-radius: 1.5rem; overflow: hidden; transition: transform 0.3s; }
.work-card:hover { transform: translateY(-5px); }
.work-image { height: 200px; display: flex; align-items: center; justify-content: center; font-size: 5rem; background: linear-gradient(135deg, #e0e7ff 0%, #fce7f3 100%); }
.work-info { padding: 1.5rem; }
.work-info h3 { margin-bottom: 0.5rem; }
.work-info p { color: #64748b; margin-bottom: 1rem; }
.work-tag { display: inline-block; padding: 0.25rem 0.75rem; background: var(--primary); color: white; border-radius: 999px; font-size: 0.875rem; }

/* Skills */
.skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1.5rem; }
.skill-item { background: white; padding: 2rem; border-radius: 1rem; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
.skill-icon { font-size: 2.5rem; display: block; margin-bottom: 0.75rem; }
.skill-name { font-weight: 600; }

/* Contact */
.contact { background: white; }
.contact-content { max-width: 500px; margin: 0 auto; text-align: center; }
.contact-content p { margin-bottom: 2rem; color: #64748b; }
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
.footer { text-align: center; padding: 2rem 0; color: #64748b; }

/* Responsive */
@media (max-width: 768px) {
  .hero .container { grid-template-columns: 1fr; text-align: center; }
  .hero h1 { font-size: 2.5rem; }
  .hero-cta { justify-content: center; }
  .about-grid { grid-template-columns: 1fr; }
  .work-grid { grid-template-columns: 1fr; }
  .nav-links { display: none; }
}`;

  const js = `// قالب معرض الأعمال - Ntfly
document.addEventListener('DOMContentLoaded', function() {
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Form
  document.querySelector('.contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('شكراً! سأتواصل معك قريباً.');
    this.reset();
  });

  console.log('معرض الأعمال جاهز - Ntfly');
});`;

  return { 'index.html': html, 'styles.css': css, 'main.js': js };
}

export const portfolioTemplateMeta = {
  id: 'portfolio',
  name: 'معرض أعمال',
  nameEn: 'Portfolio',
  description: 'قالب شخصي لعرض المشاريع والأعمال',
  thumbnail: '👨‍💻',
};
