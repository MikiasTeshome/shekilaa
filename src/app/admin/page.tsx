'use client';
import { useState, useEffect } from 'react';
import { useLocale } from '../hooks/useLocale';
import { translations } from '../translations';
import './admin.css';

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([] as any[]);
  const [newProduct, setNewProduct] = useState({
    name: { am: '', de: '', en: '', ti: '' },
    price: 0,
    weight: '',
    unit: '',
    img: '/images/berbere.png',
    tagKey: '',
    category: 'spices',
  });
  const [uploading, setUploading] = useState(false);
  const { locale } = useLocale();
  const t = (key: string) => translations[locale]?.[key] || key;

  // fetch products once unlocked
  useEffect(() => {
    if (unlocked) {
      fetch('/api/products')
        .then((r) => r.json())
        .then(setProducts);
    }
  }, [unlocked]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    setUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error(await res.text() || 'Failed to upload image');
      }
      const data = await res.json();
      setNewProduct((prev) => ({ ...prev, img: data.url }));
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleUnlock = async () => {
    const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    if (password === expectedPassword) {
      setUnlocked(true);
    } else {
      alert('Incorrect admin password. Please try again!');
    }
  };

  const handlePriceChange = async (id: number, price: number) => {
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, id, updates: { price } }),
      });
      if (!res.ok) {
        throw new Error(await res.text() || 'Failed to update price');
      }
      // refresh list
      const updated = await fetch('/api/products').then((r) => r.json());
      setProducts(updated);
    } catch (err: any) {
      alert(`Error updating price: ${err.message}`);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name.am && !newProduct.name.en) {
      alert('Please enter at least an Amharic or English name.');
      return;
    }
    if (newProduct.price <= 0) {
      alert('Please enter a valid price.');
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, product: newProduct }),
      });
      if (!res.ok) {
        throw new Error(await res.text() || 'Failed to add product');
      }
      const refreshed = await fetch('/api/products').then((r) => r.json());
      setProducts(refreshed);
      setNewProduct({
        name: { am: '', de: '', en: '', ti: '' },
        price: 0,
        weight: '',
        unit: '',
        img: '/images/berbere.png',
        tagKey: '',
        category: 'spices',
      });
      alert('Product added successfully!');
    } catch (err: any) {
      alert(`Error adding product: ${err.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, id }),
      });
      if (!res.ok) {
        throw new Error(await res.text() || 'Failed to delete product');
      }
      const refreshed = await fetch('/api/products').then((r) => r.json());
      setProducts(refreshed);
      alert('Product deleted successfully!');
    } catch (err: any) {
      alert(`Error deleting product: ${err.message}`);
    }
  };

  if (!unlocked) {
    return (
      <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 24px' }}>
        <div className="admin-lock-screen">
          <h2>{t('admin_login')}</h2>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-password-input"
            onKeyDown={(e) => { if (e.key === 'Enter') handleUnlock(); }}
          />
          <button onClick={handleUnlock} className="admin-unlock-btn">
            Unlock
          </button>
          <a href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', marginTop: '10px' }}>
            Cancel and return to shop
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 24px' }}>
      <div className="admin-dashboard">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ margin: 0 }}>{t('admin_dashboard')}</h1>
        <a href="/" className="admin-unlock-btn" style={{ textDecoration: 'none', background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
          ← Back to Shop
        </a>
      </div>

      <section className="admin-stats">
        <div className="stat-card">
          <div className="stat-value">{products.length}</div>
          <div className="stat-label">{t('admin_total')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {products.length ? (products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length).toFixed(2) : '0.00'} €
          </div>
          <div className="stat-label">{t('admin_avg_price')}</div>
        </div>
      </section>

      <section className="admin-table" style={{ overflowX: 'auto', marginBottom: '2.5rem' }}>
        <table>
          <thead>
            <tr>
              <th>{t('admin_img')}</th>
              <th>{t('admin_name')}</th>
              <th>{t('admin_price')}</th>
              <th>{t('admin_actions')}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <img src={p.img} alt={p.name?.[locale] || t(p.nameKey) || p.nameKey} className="admin-thumb" />
                </td>
                <td>{p.name?.[locale] || t(p.nameKey) || p.nameKey}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={p.price}
                      onBlur={(e) => {
                        const newPrice = Number(e.target.value);
                        if (newPrice !== p.price) handlePriceChange(p.id, newPrice);
                      }}
                      className="price-input"
                      style={{ width: '80px' }}
                    />
                    <span>€</span>
                  </div>
                </td>
                <td>
                  <button onClick={() => handleDelete(p.id)} className="admin-delete-btn" style={{ background: 'rgba(220, 53, 69, 0.7)' }}>
                    {t('admin_delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="admin-add-form" style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '2rem', borderRadius: '0.8rem', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ marginTop: 0 }}>{t('admin_add_product')}</h2>
        <div className="form-grid">
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--gold-400)', marginBottom: '4px' }}>Amharic Name</label>
            <input
              placeholder="የተፈጨ በርበሬ"
              value={newProduct.name.am}
              onChange={(e) => setNewProduct({ ...newProduct, name: { ...newProduct.name, am: e.target.value } })}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--gold-400)', marginBottom: '4px' }}>German Name</label>
            <input
              placeholder="Ground Berbere"
              value={newProduct.name.de}
              onChange={(e) => setNewProduct({ ...newProduct, name: { ...newProduct.name, de: e.target.value } })}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--gold-400)', marginBottom: '4px' }}>English Name</label>
            <input
              placeholder="Ground Berbere"
              value={newProduct.name.en}
              onChange={(e) => setNewProduct({ ...newProduct, name: { ...newProduct.name, en: e.target.value } })}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--gold-400)', marginBottom: '4px' }}>Tigrinya Name</label>
            <input
              placeholder="ዝተሓጨ በርበረ"
              value={newProduct.name.ti}
              onChange={(e) => setNewProduct({ ...newProduct, name: { ...newProduct.name, ti: e.target.value } })}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--gold-400)', marginBottom: '4px' }}>Price (€)</label>
            <input
              type="number"
              step="0.01"
              placeholder="3.50"
              value={newProduct.price || ''}
              onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--gold-400)', marginBottom: '4px' }}>Weight (e.g. 500ግ)</label>
            <input
              placeholder="500ግ"
              value={newProduct.weight}
              onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--gold-400)', marginBottom: '4px' }}>Unit (e.g. 1ኪ.ግ)</label>
            <input
              placeholder="1ኪ.ግ"
              value={newProduct.unit}
              onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--gold-400)', marginBottom: '4px' }}>Category</label>
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              style={{ width: '100%' }}
            >
              <option value="spices">Spices</option>
              <option value="grains">Grains</option>
              <option value="traditional">Traditional</option>
              <option value="drinks">Drinks</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--gold-400)', marginBottom: '4px' }}>Product Image</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ width: '100%', fontSize: '12.5px' }}
              />
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                — or use preset —
              </span>
              <select
                value={newProduct.img}
                onChange={(e) => setNewProduct({ ...newProduct, img: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="/images/berbere.png">Berbere Preset</option>
                <option value="/images/mitmita.png">Mitmita Preset</option>
                <option value="/images/shiro.png">Shiro Preset</option>
                <option value="/images/beso.png">Beso Preset</option>
              </select>
            </div>
          </div>
        </div>
        <button onClick={handleAddProduct} className="admin-add-btn" style={{ marginTop: '1.5rem', width: '100%' }} disabled={uploading}>
          {uploading ? 'Uploading image...' : t('admin_add')}
        </button>
      </section>
    </div>
  </div>
  );
}
