/**
 * قالب المتجر الإلكتروني - للتجارة الإلكترونية
 * تصميم عصري مع عرض المنتجات وسلة التسوق
 */

import type { TemplateColors, TemplateOptions } from './landing';

const defaultColors: TemplateColors = {
  primary: '#059669',
  secondary: '#0D9488',
  accent: '#F59E0B',
  background: '#FFFFFF',
  text: '#1F2937',
};

export function generateStoreTemplate(options: TemplateOptions): Record<string, string> {
  const colors = { ...defaultColors, ...options.colors };
  const dir = options.rtl !== false ? 'rtl' : 'ltr';
  const lang = options.rtl !== false ? 'ar' : 'en';

  const html = `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.title} - المتجر</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="header">
    <div class="container">
      <nav class="nav">
        <a href="#" class="logo">🛍️ ${options.title}</a>
        <ul class="nav-links">
          <li><a href="#products">المنتجات</a></li>
          <li><a href="#categories">التصنيفات</a></li>
          <li><a href="#offers">العروض</a></li>
          <li><a href="#contact">تواصل معنا</a></li>
        </ul>
        <div class="nav-actions">
          <button class="cart-btn" id="cart-btn">🛒 <span id="cart-count">0</span></button>
        </div>
      </nav>
    </div>
  </header>

  <main>
    <section class="hero">
      <div class="container">
        <h1>مرحباً بك في ${options.title}</h1>
        <p>${options.description || 'تسوق أفضل المنتجات بأفضل الأسعار'}</p>
        <a href="#products" class="btn btn-primary">تسوق الآن</a>
      </div>
    </section>

    <section id="categories" class="categories">
      <div class="container">
        <h2 class="section-title">التصنيفات</h2>
        <div class="categories-grid">
          <div class="category-card">
            <span class="category-icon">👕</span>
            <h3>ملابس</h3>
          </div>
          <div class="category-card">
            <span class="category-icon">📱</span>
            <h3>إلكترونيات</h3>
          </div>
          <div class="category-card">
            <span class="category-icon">🏠</span>
            <h3>منزل</h3>
          </div>
          <div class="category-card">
            <span class="category-icon">⌚</span>
            <h3>إكسسوارات</h3>
          </div>
        </div>
      </div>
    </section>

    <section id="products" class="products">
      <div class="container">
        <h2 class="section-title">منتجاتنا المميزة</h2>
        <div class="products-grid">
          <article class="product-card" data-id="1" data-name="منتج 1" data-price="99">
            <div class="product-image">📦</div>
            <div class="product-badge">جديد</div>
            <div class="product-info">
              <h3>منتج مميز 1</h3>
              <p class="product-desc">وصف قصير للمنتج</p>
              <div class="product-footer">
                <span class="product-price">99 ر.س</span>
                <button class="btn-add-cart">أضف للسلة</button>
              </div>
            </div>
          </article>
          <article class="product-card" data-id="2" data-name="منتج 2" data-price="149">
            <div class="product-image">🎁</div>
            <div class="product-info">
              <h3>منتج مميز 2</h3>
              <p class="product-desc">وصف قصير للمنتج</p>
              <div class="product-footer">
                <span class="product-price">149 ر.س</span>
                <button class="btn-add-cart">أضف للسلة</button>
              </div>
            </div>
          </article>
          <article class="product-card" data-id="3" data-name="منتج 3" data-price="199">
            <div class="product-image">✨</div>
            <div class="product-badge sale">تخفيض</div>
            <div class="product-info">
              <h3>منتج مميز 3</h3>
              <p class="product-desc">وصف قصير للمنتج</p>
              <div class="product-footer">
                <span class="product-price"><del>250</del> 199 ر.س</span>
                <button class="btn-add-cart">أضف للسلة</button>
              </div>
            </div>
          </article>
          <article class="product-card" data-id="4" data-name="منتج 4" data-price="79">
            <div class="product-image">🎯</div>
            <div class="product-info">
              <h3>منتج مميز 4</h3>
              <p class="product-desc">وصف قصير للمنتج</p>
              <div class="product-footer">
                <span class="product-price">79 ر.س</span>
                <button class="btn-add-cart">أضف للسلة</button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="offers" class="offers">
      <div class="container">
        <div class="offer-banner">
          <h2>🔥 عرض خاص</h2>
          <p>خصم 30% على جميع المنتجات لفترة محدودة</p>
          <a href="#products" class="btn btn-secondary">استفد الآن</a>
        </div>
      </div>
    </section>

    <section id="contact" class="contact">
      <div class="container">
        <h2 class="section-title">تواصل معنا</h2>
        <div class="contact-grid">
          <div class="contact-info">
            <p>📍 العنوان: المملكة العربية السعودية</p>
            <p>📞 الهاتف: +966 123 456 789</p>
            <p>✉️ البريد: info@store.com</p>
          </div>
          <form class="contact-form">
            <input type="text" placeholder="الاسم" required>
            <input type="email" placeholder="البريد الإلكتروني" required>
            <textarea placeholder="رسالتك" rows="4" required></textarea>
            <button type="submit" class="btn btn-primary">إرسال</button>
          </form>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <h3>${options.title}</h3>
          <p>متجرك المفضل للتسوق الإلكتروني</p>
        </div>
        <div>
          <h4>روابط سريعة</h4>
          <a href="#products">المنتجات</a>
          <a href="#offers">العروض</a>
          <a href="#contact">تواصل معنا</a>
        </div>
        <div>
          <h4>تابعنا</h4>
          <div class="social-links">
            <a href="#">📘</a>
            <a href="#">📸</a>
            <a href="#">🐦</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© ${new Date().getFullYear()} ${options.title}. جميع الحقوق محفوظة.</p>
      </div>
    </div>
  </footer>

  <!-- سلة التسوق -->
  <div class="cart-modal" id="cart-modal">
    <div class="cart-content">
      <button class="cart-close" id="cart-close">✕</button>
      <h3>سلة التسوق</h3>
      <div id="cart-items"></div>
      <div class="cart-total">
        <span>المجموع:</span>
        <span id="cart-total-price">0 ر.س</span>
      </div>
      <button class="btn btn-primary btn-checkout">إتمام الشراء</button>
    </div>
  </div>

  <script src="main.js"></script>
</body>
</html>`;

  const css = `/* قالب المتجر - Ntfly */
:root {
  --primary: ${colors.primary};
  --secondary: ${colors.secondary};
  --accent: ${colors.accent};
  --bg: ${colors.background};
  --text: ${colors.text};
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'IBM Plex Sans Arabic', 'Segoe UI', sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  direction: ${dir};
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }

/* Header */
.header {
  background: white;
  box-shadow: 0 2px 15px rgba(0,0,0,0.08);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
}

.nav { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; }
.logo { font-size: 1.5rem; font-weight: 700; color: var(--primary); text-decoration: none; }

.nav-links { display: flex; list-style: none; gap: 2rem; }
.nav-links a { color: var(--text); text-decoration: none; font-weight: 500; }
.nav-links a:hover { color: var(--primary); }

.cart-btn { background: var(--primary); color: white; border: none; padding: 0.5rem 1rem; border-radius: 999px; cursor: pointer; font-size: 1rem; }

/* Hero */
.hero {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  text-align: center;
  padding: 10rem 0 6rem;
  margin-top: 60px;
}

.hero h1 { font-size: 3rem; margin-bottom: 1rem; }
.hero p { font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.95; }

/* Buttons */
.btn {
  display: inline-block;
  padding: 0.875rem 2rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  cursor: pointer;
  border: none;
}

.btn-primary { background: white; color: var(--primary); }
.btn-secondary { background: var(--accent); color: white; }
.btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }

/* Sections */
section { padding: 5rem 0; }
.section-title { text-align: center; font-size: 2rem; margin-bottom: 3rem; color: var(--primary); }

/* Categories */
.categories { background: #f9fafb; }
.categories-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
.category-card { background: white; padding: 2rem; border-radius: 1rem; text-align: center; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
.category-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
.category-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }

/* Products */
.products-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 2rem; }
.product-card { background: white; border-radius: 1rem; overflow: hidden; position: relative; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: all 0.3s; }
.product-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
.product-image { height: 180px; display: flex; align-items: center; justify-content: center; font-size: 5rem; background: linear-gradient(135deg, #ecfdf5, #d1fae5); }
.product-badge { position: absolute; top: 1rem; ${dir === 'rtl' ? 'right' : 'left'}: 1rem; background: var(--primary); color: white; padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; }
.product-badge.sale { background: #ef4444; }
.product-info { padding: 1.5rem; }
.product-info h3 { margin-bottom: 0.5rem; }
.product-desc { color: #6b7280; font-size: 0.875rem; margin-bottom: 1rem; }
.product-footer { display: flex; justify-content: space-between; align-items: center; }
.product-price { font-weight: 700; color: var(--primary); font-size: 1.1rem; }
.product-price del { color: #9ca3af; font-weight: 400; margin-${dir === 'rtl' ? 'left' : 'right'}: 0.5rem; }
.btn-add-cart { background: var(--primary); color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; font-size: 0.875rem; }
.btn-add-cart:hover { background: var(--secondary); }

/* Offers */
.offer-banner {
  background: linear-gradient(135deg, var(--accent), #fbbf24);
  color: white;
  text-align: center;
  padding: 4rem;
  border-radius: 1.5rem;
}
.offer-banner h2 { font-size: 2.5rem; margin-bottom: 1rem; }
.offer-banner p { font-size: 1.25rem; margin-bottom: 2rem; }

/* Contact */
.contact { background: #f9fafb; }
.contact-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 3rem; }
.contact-info p { margin-bottom: 1rem; }
.contact-form { display: flex; flex-direction: column; gap: 1rem; }
.contact-form input, .contact-form textarea { padding: 0.875rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; font-family: inherit; direction: ${dir}; }
.contact-form input:focus, .contact-form textarea:focus { outline: none; border-color: var(--primary); }

/* Footer */
.footer { background: var(--text); color: white; padding: 4rem 0 2rem; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 3rem; margin-bottom: 3rem; }
.footer h3, .footer h4 { margin-bottom: 1rem; }
.footer a { display: block; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 0.5rem; }
.social-links { display: flex; gap: 1rem; font-size: 1.5rem; }
.social-links a { display: inline; }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem; text-align: center; opacity: 0.8; }

/* Cart Modal */
.cart-modal { position: fixed; top: 0; ${dir === 'rtl' ? 'left' : 'right'}: -400px; width: 400px; height: 100vh; background: white; box-shadow: -5px 0 25px rgba(0,0,0,0.15); z-index: 2000; transition: ${dir === 'rtl' ? 'left' : 'right'} 0.3s; }
.cart-modal.open { ${dir === 'rtl' ? 'left' : 'right'}: 0; }
.cart-content { padding: 2rem; height: 100%; display: flex; flex-direction: column; }
.cart-close { position: absolute; top: 1rem; ${dir === 'rtl' ? 'left' : 'right'}: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; }
#cart-items { flex: 1; overflow-y: auto; margin: 1rem 0; }
.cart-item { display: flex; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid #e5e7eb; }
.cart-total { padding: 1rem 0; font-size: 1.25rem; font-weight: 700; display: flex; justify-content: space-between; }
.btn-checkout { width: 100%; }

/* Responsive */
@media (max-width: 768px) {
  .categories-grid { grid-template-columns: repeat(2, 1fr); }
  .contact-grid, .footer-grid { grid-template-columns: 1fr; }
  .nav-links { display: none; }
  .cart-modal { width: 100%; ${dir === 'rtl' ? 'left' : 'right'}: -100%; }
}`;

  const js = `// قالب المتجر - Ntfly
document.addEventListener('DOMContentLoaded', function() {
  let cart = [];
  const cartBtn = document.getElementById('cart-btn');
  const cartModal = document.getElementById('cart-modal');
  const cartClose = document.getElementById('cart-close');
  const cartItems = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cart-total-price');

  // فتح/إغلاق السلة
  cartBtn?.addEventListener('click', () => cartModal.classList.add('open'));
  cartClose?.addEventListener('click', () => cartModal.classList.remove('open'));

  // إضافة للسلة
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', function() {
      const card = this.closest('.product-card');
      const item = {
        id: card.dataset.id,
        name: card.dataset.name,
        price: parseInt(card.dataset.price)
      };
      cart.push(item);
      updateCart();
      alert('تمت الإضافة للسلة!');
    });
  });

  function updateCart() {
    cartCount.textContent = cart.length;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = total + ' ر.س';
    
    cartItems.innerHTML = cart.map((item, i) => 
      '<div class="cart-item"><span>' + item.name + '</span><span>' + item.price + ' ر.س</span></div>'
    ).join('');
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Contact form
  document.querySelector('.contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('شكراً! سنتواصل معك قريباً.');
    this.reset();
  });

  // Checkout
  document.querySelector('.btn-checkout')?.addEventListener('click', function() {
    if (cart.length === 0) {
      alert('السلة فارغة!');
      return;
    }
    alert('تم إرسال طلبك بنجاح!');
    cart = [];
    updateCart();
    cartModal.classList.remove('open');
  });

  console.log('المتجر جاهز - Ntfly');
});`;

  return { 'index.html': html, 'styles.css': css, 'main.js': js };
}

export const storeTemplateMeta = {
  id: 'store',
  name: 'متجر إلكتروني',
  nameEn: 'E-commerce Store',
  description: 'قالب متجر متكامل مع سلة التسوق',
  thumbnail: '🛒',
};
