'use client';
import { useState, useEffect, useRef } from 'react';
import { translations, localeNames, localeFlags, localeCodes, type Locale } from './translations';
import { useLocale } from './hooks/useLocale';

function useTranslation() {
  const { locale, setLocale } = useLocale();
  const t = (key: string) => translations[locale]?.[key] || translations['am'][key] || key;
  const formatPrice = (priceETB: number) => {
    if (locale === 'de' || locale === 'en') {
      return (priceETB / 120).toFixed(2);
    }
    return priceETB;
  };
  return { locale, setLocale, t, formatPrice };
}

export default function Page() {
  const { locale, setLocale, t, formatPrice } = useTranslation();
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

  const [products, setProducts] = useState([] as any[]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const productGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch products from API, fallback to static seed if empty
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setProducts(data);
        } else {
          // Fallback static list
          setProducts([
            { id: 1, nameKey: 'product_berbere', price: 450, weight: '500ግ', unit: '1ኪ.ግ', img: '/images/berbere.png', tagKey: 'product_popular', category: 'spices' },
            { id: 2, nameKey: 'product_mitmita', price: 550, weight: '500ግ', unit: '1ኪ.ግ', img: '/images/mitmita.png', tagKey: '', category: 'spices' },
            { id: 3, nameKey: 'product_shiro', price: 350, weight: '', unit: '1ኪ.ግ', img: '/images/shiro.png', tagKey: '', category: 'traditional' },
            { id: 4, nameKey: 'product_beso', price: 300, weight: '', unit: '1ኪ.ግ', img: '/images/beso.png', tagKey: 'product_new', category: 'grains' },
          ]);
        }
      })
      .catch(() => {
        setProducts([
          { id: 1, nameKey: 'product_berbere', price: 450, weight: '500ግ', unit: '1ኪ.ግ', img: '/images/berbere.png', tagKey: 'product_popular', category: 'spices' },
          { id: 2, nameKey: 'product_mitmita', price: 550, weight: '500ግ', unit: '1ኪ.ግ', img: '/images/mitmita.png', tagKey: '', category: 'spices' },
          { id: 3, nameKey: 'product_shiro', price: 350, weight: '', unit: '1ኪ.ግ', img: '/images/shiro.png', tagKey: '', category: 'traditional' },
          { id: 4, nameKey: 'product_beso', price: 300, weight: '', unit: '1ኪ.ግ', img: '/images/beso.png', tagKey: 'product_new', category: 'grains' },
        ]);
      });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => current === msg ? null : current);
    }, 3000);
  };

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`${product.name?.[locale] || t(product.nameKey)} added to cart!`);
  };

  const updateCartQty = (id: any, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: any) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleWishlist = (product: any) => {
    const isInWishlist = wishlist.some((item) => item.id === product.id);
    if (isInWishlist) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast(`Removed from Wishlist`);
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Added to Wishlist! ❤️`);
    }
  };

  const scrollLeft = () => {
    if (productGridRef.current) {
      productGridRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (productGridRef.current) {
      productGridRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const categories = [
    { icon: '🌶️', labelKey: 'cat_spices', key: 'spices' },
    { icon: '🫘', labelKey: 'cat_grains', key: 'grains' },
    { icon: '🍲', labelKey: 'cat_traditional', key: 'traditional' },
    { icon: '🫖', labelKey: 'cat_drinks', key: 'drinks' },
    { icon: '🧂', labelKey: 'cat_other', key: 'other' },
  ];

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const searchedProducts = filteredProducts.filter((p) => {
    const name = (p.name?.[locale] || t(p.nameKey) || '').toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });


  const featureKeys = [
    { icon: '✅', titleKey: 'feat_natural_title', descKey: 'feat_natural_desc' },
    { icon: '🚚', titleKey: 'feat_delivery_title', descKey: 'feat_delivery_desc' },
    { icon: '🏆', titleKey: 'feat_quality_title', descKey: 'feat_quality_desc' },
    { icon: '💰', titleKey: 'feat_service_title', descKey: 'feat_service_desc' },
  ];

  const locales: Locale[] = ['am', 'de', 'en', 'ti'];

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
            <a href="tel:+251941124994">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              {t('topbar_phone')}
            </a>
            <a href="#">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              {t('topbar_location')}
            </a>
            <div className="topbar-social">
              <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg></a>
              <a href="https://t.me/+251941124994" target="_blank" rel="noopener noreferrer" aria-label="Telegram"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg></a>
              <a href="https://wa.me/251941124994" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
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
              <h2>መቅደስ <span style={{ color: '#d4a017' }}>ባልትና</span></h2>
              <span>mekedes.shop</span>
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
              <button
                className="lang-btn"
                onClick={() => setLangOpen(!langOpen)}
                aria-label={`Language: ${localeNames[locale]}`}
                aria-expanded={langOpen}
                aria-haspopup="listbox"
              >
                <img
                  className="lang-flag-img"
                  src={`https://flagcdn.com/w40/${localeFlags[locale]}.png`}
                  width="22" height="16"
                  alt=""
                  aria-hidden="true"
                />
                <span className="lang-name">{localeNames[locale]}</span>
                <span className="lang-arrow" aria-hidden="true">▾</span>
              </button>

              <div className="lang-dropdown" role="listbox" aria-label="Select language">
                {locales.map((l) => (
                  <button
                    key={l}
                    role="option"
                    aria-selected={l === locale}
                    className={`lang-option${l === locale ? ' active' : ''}`}
                    onClick={() => { setLocale(l); setLangOpen(false); }}
                  >
                    <img
                      className="lang-flag-img"
                      src={`https://flagcdn.com/w40/${localeFlags[l]}.png`}
                      width="24" height="17"
                      alt=""
                      aria-hidden="true"
                    />
                    <span className="lang-option-name">{localeNames[l]}</span>
                    {l === locale && (
                      <span className="check" aria-hidden="true">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button aria-label="Search" onClick={() => setSearchOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
            <a href="/admin" aria-label="Account" style={{ display: 'flex', alignItems: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </a>
            <button aria-label="Cart" style={{ position: 'relative' }} onClick={() => setShowCartDrawer(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <span className="cart-badge">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </button>
            <button className="mobile-toggle" aria-label="Menu" onClick={() => setMenuOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HERO (Premium Redesign) ─── */}
      <section className="hero" id="home">
        {/* Decorative blobs */}
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />

        <div className="container">
          <div className="hero-inner">

            {/* ── Left: Text Panel ── */}
            <div className="hero-text-panel">
              {/* Eyebrow label */}
              <div className="hero-eyebrow">
                <span>🌿</span>
                {locale === 'am' || locale === 'ti'
                  ? '100% ተፈጥሯዊ ምርቶች'
                  : locale === 'de'
                  ? '100% Natürliche Produkte'
                  : '100% Natural Products'}
              </div>

              {/* Main headline */}
              <h1>
                {locale === 'am' || locale === 'ti' ? (
                  <>ንጹህ፣ <span className="hero-em">ተፈጥሯዊ</span><br />ለቤተሰብዎ ጤና</>
                ) : locale === 'de' ? (
                  <>Sauber, <span className="hero-em">natürlich</span><br />für Ihre Familie</>
                ) : (
                  <>Pure, <span className="hero-em">Natural</span><br />Made for Your Family</>
                )}
              </h1>

              {/* Motto block — exact wording as specified */}
              <div className="hero-motto">
                <div className="hero-motto-am">
                  ንጹህ፣ ተፈጥሯዊ፣ እና ከሁሉም በላይ ጤናማ!<br />
                  ከእናት እጅ፣ ለቤተሰብዎ ፍቅር!
                </div>
                <div className="hero-motto-de">
                  Sauber, natürlich und vor allem gesund! Von der Hand der Mutter – Liebe für Ihre Familie!
                </div>
              </div>

              {/* Value pills */}
              <div className="hero-values">
                <span className="hero-value-pill">✦ {locale === 'de' ? 'Sauber' : locale === 'am' || locale === 'ti' ? 'ንጹህ' : 'Clean'}</span>
                <span className="hero-value-pill">✦ {locale === 'de' ? 'Natürlich' : locale === 'am' || locale === 'ti' ? 'ተፈጥሯዊ' : 'Natural'}</span>
                <span className="hero-value-pill">✦ {locale === 'de' ? 'Gesund' : locale === 'am' || locale === 'ti' ? 'ጤናማ' : 'Healthy'}</span>
              </div>

              {/* CTA Buttons */}
              <div className="hero-buttons">
                <a href="#products" className="btn-primary">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                  {t('hero_shop')}
                </a>
                <a href="https://wa.me/251941124994" target="_blank" rel="noopener noreferrer" className="btn-outline">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {t('hero_whatsapp')}
                </a>
              </div>
            </div>

            {/* ── Right: Image Panel ── */}
            <div className="hero-image-panel">
              <img src="/images/hero_mother.png" alt="Ethiopian mother lovingly preparing fresh, homemade food" />

              {/* Floating badge — bottom left */}
              <div className="hero-img-badge">
                <div className="hero-img-badge-icon">🌿</div>
                <div className="hero-img-badge-text">
                  {locale === 'de' ? '100% Natürlich' : locale === 'am' || locale === 'ti' ? '100% ተፈጥሯዊ' : '100% Natural'}
                  <span>{locale === 'de' ? 'Keine Zusatzstoffe' : locale === 'am' || locale === 'ti' ? 'ምንም ጨምሮ አይደለም' : 'No additives'}</span>
                </div>
              </div>

              {/* Floating badge — top right */}
              <div className="hero-img-badge-2">
                <strong>★ 4.9</strong>
                {locale === 'de' ? 'Kundenbewertung' : locale === 'am' || locale === 'ti' ? 'ደንበኛ ደረጃ' : 'Customer rating'}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── VALUES MARQUEE ─── */}
      <div className="values-marquee" aria-hidden="true">
        <div className="values-marquee-track">
          {/* Duplicated for seamless loop */}
          {[...Array(2)].map((_, i) => (
            <span key={i} style={{ display: 'inline-flex' }}>
              <span className="values-marquee-item"><span className="values-marquee-dot">🌱</span> ንጹህ · Sauber · Clean</span>
              <span className="values-marquee-item"><span className="values-marquee-dot">🍃</span> ተፈጥሯዊ · Natürlich · Natural</span>
              <span className="values-marquee-item"><span className="values-marquee-dot">💚</span> ጤናማ · Gesund · Healthy</span>
              <span className="values-marquee-item"><span className="values-marquee-dot">🤲</span> ከእናት እጅ · Von Mutterhand · Mother&apos;s Touch</span>
              <span className="values-marquee-item"><span className="values-marquee-dot">🌾</span> ለቤተሰብ · Für die Familie · For Family</span>
            </span>
          ))}
        </div>
      </div>


      {/* ─── CATEGORIES ─── */}
      <section className="categories">
        <div className="container">
          <div className="cat-grid">
            {categories.map((cat) => (
              <button
                key={cat.labelKey}
                className={`cat-item${selectedCategory === cat.key ? ' active' : ''}`}
                onClick={() => setSelectedCategory(selectedCategory === cat.key ? null : cat.key)}
                style={{ background: 'none', border: 'none', fontFamily: 'inherit', color: 'inherit' }}
              >
                <div className="cat-icon">{cat.icon}</div>
                <span className="cat-label">{t(cat.labelKey).split('\n').map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br />}</span>
                ))}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRODUCTS ─── */}
      <section className="products" id="products">
        <div className="container">
          <div className="section-header">
            <h2>
              {t('products_title')}
              {selectedCategory && (
                <span style={{ fontSize: '14px', color: 'var(--gold-500)', marginLeft: '12px', fontWeight: '500' }}>
                  ({categories.find((c) => c.key === selectedCategory)?.icon} {t(`cat_${selectedCategory}`)})
                </span>
              )}
            </h2>
            <div className="section-nav">
              <button aria-label="Previous" onClick={scrollLeft}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button aria-label="Next" onClick={scrollRight}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>
          <div className="product-grid" ref={productGridRef}>
            {filteredProducts.map((p) => (
              <div className="product-card" key={p.id}>
                <div className="product-img">
                  <img src={p.img} alt={p.name?.[locale] || t(p.nameKey)} />
                  {p.tagKey && <span className="product-tag">{t(p.tagKey)}</span>}
                  <button
                    className={`product-wish${wishlist.some((item) => item.id === p.id) ? ' active' : ''}`}
                    onClick={() => toggleWishlist(p)}
                    aria-label="Add to wishlist"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill={wishlist.some((item) => item.id === p.id) ? "var(--red-600)" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </button>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{p.name?.[locale] || t(p.nameKey)}</h3>
                  <div className="product-weight">
                    <span>{p.weight}</span>
                    <span>{p.unit}</span>
                  </div>
                  <div className="product-bottom">
                    <div className="product-price">
                      {formatPrice(p.price)} <span>{t('product_currency')}</span>
                    </div>
                    <button className="btn-cart" onClick={() => addToCart(p)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                      {t('product_cart')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--gray-500)' }}>
                No products found in this category.
              </div>
            )}
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
                  <h2>መቅደስ <span style={{ color: '#d4a017' }}>ባልትና</span></h2>
                  <span>mekedes.shop</span>
                </div>
              </div>
              <p>{t('footer_desc')}</p>
              <div className="footer-social">
                <a href="#" aria-label="Facebook">📘</a>
                <a href="https://t.me/+251941124994" target="_blank" rel="noopener noreferrer" aria-label="Telegram">✈️</a>
                <a href="https://wa.me/251941124994" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">💬</a>
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
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
                  <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--gold-400)', fontWeight: 600 }}>{t('contact_preorder_label')}</span>
                    <a href="tel:+251941124994" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s' }}>+251 94 112 4994</a>
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
                  <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--gold-400)', fontWeight: 600 }}>{t('contact_availability_label')}</span>
                    <a href="tel:+251913564634" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s' }}>+251 91 356 4634</a>
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="var(--green-600)" style={{ flexShrink: 0, marginTop: '2px' }}><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--gold-400)', fontWeight: 600 }}>{t('contact_germany_label')}</span>
                    <a href="tel:+4917659271712" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s' }}>+49 176 59271712</a>
                    <span style={{ fontSize: '11px', color: 'var(--gray-500)' }}>{t('contact_germany_hours')}</span>
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
                  <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  {t('topbar_location')}
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
                  <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  info@mekedes.shop
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

      {/* ─── SEARCH OVERLAY ─── */}
      {searchOpen && (
        <div className="search-overlay fade-in">
          <div className="search-overlay-backdrop" onClick={() => setSearchOpen(false)} />
          <div className="search-overlay-content">
            <div className="search-header">
              <input
                type="text"
                placeholder="ምርቶችን ይፈልጉ... / Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="search-input"
              />
              <button className="search-close" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>✕</button>
            </div>
            <div className="search-results">
              {searchedProducts.length === 0 ? (
                <p className="no-results-msg">No products found matching "{searchQuery}"</p>
              ) : (
                <div className="search-results-grid">
                  {searchedProducts.map(p => (
                    <div className="search-result-item" key={p.id} onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                      <img src={p.img} alt={p.name?.[locale] || t(p.nameKey)} />
                      <div>
                        <h4>{p.name?.[locale] || t(p.nameKey)}</h4>
                        <span>{formatPrice(p.price)} {t('product_currency')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── MOBILE MENU DRAWER ─── */}
      {menuOpen && (
        <div className="mobile-drawer fade-in">
          <div className="mobile-drawer-backdrop" onClick={() => setMenuOpen(false)} />
          <div className="mobile-drawer-content">
            <div className="mobile-drawer-header">
              <div className="logo">
                <div className="logo-icon">🍛</div>
                <div className="logo-text">
                  <h2>መቅደስ <span style={{ color: '#d4a017' }}>ባልትና</span></h2>
                </div>
              </div>
              <button className="mobile-drawer-close" onClick={() => setMenuOpen(false)}>✕</button>
            </div>
            <ul className="mobile-nav-links">
              <li><a href="#home" onClick={() => setMenuOpen(false)}>{t('nav_home')}</a></li>
              <li><a href="#products" onClick={() => setMenuOpen(false)}>{t('nav_products')}</a></li>
              <li><a href="#about" onClick={() => setMenuOpen(false)}>{t('nav_about')}</a></li>
              <li><a href="#contact" onClick={() => setMenuOpen(false)}>{t('nav_contact')}</a></li>
              <li>
                <a href="/admin" onClick={() => setMenuOpen(false)} style={{ color: 'var(--gold-500)', fontWeight: 'bold' }}>
                  ⚙️ Admin Panel
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ─── CART DRAWER ─── */}
      {showCartDrawer && (
        <div className="cart-drawer fade-in">
          <div className="cart-drawer-backdrop" onClick={() => setShowCartDrawer(false)} />
          <div className="cart-drawer-content">
            <div className="cart-drawer-header">
              <h3>🛒 {t('cart_title') || 'Your Cart'}</h3>
              <button className="cart-drawer-close" onClick={() => setShowCartDrawer(false)}>✕</button>
            </div>
            <div className="cart-drawer-items">
              {cart.length === 0 ? (
                <div className="empty-cart-message" style={{ textAlign: 'center', padding: '40px 0' }}>
                  <p>{t('cart_empty') || 'Your cart is empty'}</p>
                  <button className="btn-primary" style={{ marginTop: '12px' }} onClick={() => setShowCartDrawer(false)}>
                    {t('hero_shop')}
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div className="cart-item-row" key={item.id} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', alignItems: 'center' }}>
                    <img src={item.img} alt={item.name?.[locale] || t(item.nameKey)} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '14px', color: '#fff' }}>{item.name?.[locale] || t(item.nameKey)}</h4>
                      <div style={{ fontSize: '12px', color: 'var(--gold-300)', display: 'flex', gap: '10px', marginTop: '4px' }}>
                        <span>{formatPrice(item.price)} {t('product_currency')}</span>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <button onClick={() => updateCartQty(item.id, -1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', padding: '0 4.2px' }}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateCartQty(item.id, 1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', padding: '0 4.2px' }}>+</button>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: 'var(--red-600)', cursor: 'pointer', fontSize: '16px' }}>✕</button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="cart-drawer-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', marginTop: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span>Total:</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--gold-400)' }}>
                    {formatPrice(cart.reduce((total, item) => total + item.price * item.quantity, 0))} {t('product_currency')}
                  </span>
                </div>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => alert('Order Placed Successfully! Mock Checkout Complete.')}>
                  💳 Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TOAST NOTIFICATION ─── */}
      {toastMessage && (
        <div className="toast-notification fade-in">
          <span>✨ {toastMessage}</span>
        </div>
      )}

      {/* ─── STICKY BOTTOM NAV BAR (mobile only) ─── */}
      <nav className="bottom-nav" aria-label="Mobile navigation">
        <a href="#home" className="bottom-nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          {t('nav_home')}
        </a>
        <a href="#products" className="bottom-nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {t('nav_products')}
        </a>
        <button className="bottom-nav-item" onClick={() => setShowCartDrawer(true)} aria-label="Open cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
          </svg>
          {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
            <span className="bottom-nav-badge">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
          )}
          {t('nav_products') === 'ምርቶች' ? 'ጋሪ' : 'Cart'}
        </button>
        <button className="bottom-nav-item" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
          Menu
        </button>
      </nav>
    </div>
  );
}

