'use client';
import { useState, useEffect, useRef } from 'react';
import { translations, localeNames, localeFlags, type Locale } from './translations';

function useTranslation() {
  const [locale, setLocale] = useState<Locale>('am');
  const t = (key: string) => translations[locale]?.[key] || translations['am'][key] || key;
  return { locale, setLocale, t };
}

export default function Page() {
  const { locale, setLocale, t } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const products = [
    { nameKey: 'product_berbere', price: 450, weight: '500ግ', unit: '1ኪ.ግ', img: '/images/berbere.png', tagKey: 'product_popular' },
    { nameKey: 'product_mitmita', price: 550, weight: '500ግ', unit: '1ኪ.ግ', img: '/images/mitmita.png', tagKey: '' },
    { nameKey: 'product_shiro', price: 350, weight: '', unit: '1ኪ.ግ', img: '/images/shiro.png', tagKey: '' },
    { nameKey: 'product_beso', price: 300, weight: '', unit: '1ኪ.ግ', img: '/images/beso.png', tagKey: 'product_new' },
  ];

  const categories = [
    { icon: '🌶️', labelKey: 'cat_spices' },
    { icon: '🫘', labelKey: 'cat_grains' },
    { icon: '🍲', labelKey: 'cat_traditional' },
    { icon: '🫖', labelKey: 'cat_drinks' },
    { icon: '🧂', labelKey: 'cat_other' },
  ];

  const featureKeys = [
    { icon: '✅', titleKey: 'feat_natural_title', descKey: 'feat_natural_desc' },
    { icon: '🚚', titleKey: 'feat_delivery_title', descKey: 'feat_delivery_desc' },
    { icon: '🏆', titleKey: 'feat_quality_title', descKey: 'feat_quality_desc' },
    { icon: '💰', titleKey: 'feat_service_title', descKey: 'feat_service_desc' },
  ];

  const locales: Locale[] = ['am', 'de', 'en'];

  return (
    <div>
      {/* ─── TOP BAR ─── */}
      <div className="topbar">
        <div className="container">
          <div className="topbar-left">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            <span>{t('topbar_badge')}</span>
          </div>
          <div className="topbar-right">
            <a href="tel:+251911000000">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              {t('topbar_phone')}
            </a>
            <a href="#">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              {t('topbar_location')}
            </a>
            <div className="topbar-social">
              <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg></a>
              <a href="#" aria-label="Telegram"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg></a>
              <a href="#" aria-label="WhatsApp"><svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
            </div>
          </div>
        </div>
      </div>

      {/* ─── NAVBAR ─── */}
      <nav className="navbar">
        <div className="container">
          <a href="/" className="logo">
            <div className="logo-icon">🍛</div>
            <div className="logo-text">
              <h2>የባህላዊ <span style={{ color: '#d4a017' }}>ጥፋቄ</span></h2>
              <span>ያዉ ባህላዊ ምግብንት</span>
            </div>
          </a>
          <ul className="nav-links">
            <li><a href="#home">{t('nav_home')}</a></li>
            <li><a href="#products">{t('nav_products')}</a></li>
            <li><a href="#about">{t('nav_about')}</a></li>
            <li><a href="#contact">{t('nav_contact')}</a></li>
          </ul>
          <div className="nav-actions">
            {/* Language Switcher */}
            <div className={`lang-switcher${langOpen ? ' open' : ''}`} ref={langRef}>
              <button className="lang-btn" onClick={() => setLangOpen(!langOpen)} aria-label="Change language">
                <span className="lang-flag">{localeFlags[locale]}</span>
                <span>{localeNames[locale]}</span>
                <span className="lang-arrow">▼</span>
              </button>
              <div className="lang-dropdown">
                {locales.map((l) => (
                  <button
                    key={l}
                    className={`lang-option${l === locale ? ' active' : ''}`}
                    onClick={() => { setLocale(l); setLangOpen(false); }}
                  >
                    <span className="lang-flag">{localeFlags[l]}</span>
                    <span>{localeNames[l]}</span>
                    {l === locale && <span className="check">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <button aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
            <button aria-label="Account">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </button>
            <button aria-label="Cart" style={{ position: 'relative' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <span className="cart-badge">0</span>
            </button>
            <button className="mobile-toggle" aria-label="Menu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="hero" id="home">
        <div className="hero-bg">
          <img src="/images/hero.png" alt="Ethiopian food spread" />
        </div>
        <div className="hero-overlay" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              {t('hero_badge')}
            </div>
            <h1>
              {t('hero_title_1')}<br />
              <em>{t('hero_title_2')}</em>
            </h1>
            <p>{t('hero_desc')}</p>
            <div className="hero-buttons">
              <a href="#products" className="btn-primary">{t('hero_shop')}</a>
              <a href="#about" className="btn-outline">{t('hero_browse')}</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="categories">
        <div className="container">
          <div className="cat-grid">
            {categories.map((cat) => (
              <a key={cat.labelKey} className="cat-item" href="#products">
                <div className="cat-icon">{cat.icon}</div>
                <span className="cat-label">{t(cat.labelKey).split('\n').map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br />}</span>
                ))}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRODUCTS ─── */}
      <section className="products" id="products">
        <div className="container">
          <div className="section-header">
            <h2>{t('products_title')}</h2>
            <div className="section-nav">
              <button aria-label="Previous">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button aria-label="Next">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>
          <div className="product-grid">
            {products.map((p) => (
              <div className="product-card" key={p.nameKey}>
                <div className="product-img">
                  <img src={p.img} alt={t(p.nameKey)} />
                  {p.tagKey && <span className="product-tag">{t(p.tagKey)}</span>}
                  <button className="product-wish" aria-label="Add to wishlist">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </button>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{t(p.nameKey)}</h3>
                  <div className="product-weight">
                    <span>{p.weight}</span>
                    <span>{p.unit}</span>
                  </div>
                  <div className="product-bottom">
                    <div className="product-price">
                      {p.price} <span>{t('product_currency')}</span>
                    </div>
                    <button className="btn-cart">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                      {t('product_cart')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            {featureKeys.map((f) => (
              <div className="feature-item" key={f.titleKey}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-text">
                  <h4>{t(f.titleKey)}</h4>
                  <p>{t(f.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT & TESTIMONIALS ─── */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="about-grid">
            <div>
              <div className="about-content">
                <h2>{t('about_title')}</h2>
                <p>{t('about_desc')}</p>
              </div>
              <div className="about-img">
                <img src="/images/about.png" alt="Traditional Ethiopian food preparation" />
              </div>
            </div>
            <div className="testimonials">
              <h2>{t('testimonials_title')}</h2>
              <div className="testimonial-card">
                <div className="stars">★★★★★</div>
                <p>&ldquo;{t('testimonial_1')}&rdquo;</p>
                <div className="author">{t('testimonial_1_author')}</div>
              </div>
              <div className="testimonial-card">
                <div className="stars">★★★★★</div>
                <p>&ldquo;{t('testimonial_2')}&rdquo;</p>
                <div className="author">{t('testimonial_2_author')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section className="newsletter">
        <div className="container">
          <h2>{t('newsletter_title')}</h2>
          <p>{t('newsletter_desc')}</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder={t('newsletter_placeholder')} />
            <button type="submit">{t('newsletter_submit')}</button>
          </form>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">
                <div className="logo-icon">🍛</div>
                <div className="logo-text">
                  <h2>የባህላዊ <span style={{ color: '#d4a017' }}>ጥፋቄ</span></h2>
                  <span>ያዉ ባህላዊ ምግብንት</span>
                </div>
              </div>
              <p>{t('footer_desc')}</p>
              <div className="footer-social">
                <a href="#" aria-label="Facebook">📘</a>
                <a href="#" aria-label="Telegram">✈️</a>
                <a href="#" aria-label="WhatsApp">💬</a>
              </div>
            </div>
            <div className="footer-col">
              <h3>{t('footer_quick')}</h3>
              <ul>
                <li><a href="#">{t('nav_home')}</a></li>
                <li><a href="#products">{t('nav_products')}</a></li>
                <li><a href="#about">{t('nav_about')}</a></li>
                <li><a href="#">{t('footer_delivery_info')}</a></li>
                <li><a href="#">{t('nav_contact')}</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>{t('footer_products')}</h3>
              <ul>
                <li><a href="#">{t('footer_grains')}</a></li>
                <li><a href="#">{t('footer_spices')}</a></li>
                <li><a href="#">{t('footer_drinks')}</a></li>
                <li><a href="#">{t('footer_others')}</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>{t('footer_contact')}</h3>
              <ul className="footer-contact">
                <li>
                  <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                  +251 9XX XXX XXX
                </li>
                <li>
                  <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  {t('topbar_location')}
                </li>
                <li>
                  <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  info@yebahegtaste.com
                </li>
              </ul>
              <div className="payment-icons">
                <div className="payment-icon">VISA</div>
                <div className="payment-icon">MC</div>
                <div className="payment-icon">CBE</div>
                <div className="payment-icon">BoA</div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>{t('footer_copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
