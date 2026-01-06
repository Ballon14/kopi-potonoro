'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
          const prods = data.data;
          setProducts(prods);
          
          setCategories([
            { id: "all", name: "Semua", count: prods.length },
            { id: "arabica", name: "Arabica", count: prods.filter(p => p.category === "Arabica").length },
            { id: "robusta", name: "Robusta", count: prods.filter(p => p.category === "Robusta").length },
            { id: "blend", name: "Blend", count: prods.filter(p => p.category === "Blend").length }
          ]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category.toLowerCase() === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'featured':
        if (a.featured === b.featured) {
          return a.name.localeCompare(b.name);
        }
        return a.featured ? -1 : 1;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div>
      {/* ========== HERO SECTION ========== */}
      <section style={{
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, var(--color-vintage-charcoal) 0%, var(--color-vintage-coffee) 100%)',
        position: 'relative',
        paddingTop: '6rem'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a961' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.5
        }}></div>
        
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '2rem' }}>
          <span className="cabin-tagline">Koleksi</span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            fontWeight: 400,
            letterSpacing: '0.08em',
            color: 'var(--color-vintage-cream)',
            marginTop: '1rem',
            marginBottom: '1.5rem'
          }}>
            Produk Kami
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--color-vintage-beige)',
            maxWidth: '600px',
            margin: '0 auto',
            fontStyle: 'italic'
          }}>
            Jelajahi berbagai pilihan kopi premium dari seluruh Nusantara
          </p>
          <div className="cabin-ornament" style={{ marginTop: '2rem' }}>
            <div className="cabin-ornament-line"></div>
            <div className="cabin-ornament-diamond"></div>
            <div className="cabin-ornament-line"></div>
          </div>
        </div>
      </section>

      {/* ========== FILTER BAR ========== */}
      <section style={{
        background: 'var(--color-vintage-cream)',
        borderBottom: '1px solid var(--color-border)',
        padding: '1.5rem 0',
        position: 'sticky',
        top: '60px',
        zIndex: 40
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Category Filter */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    padding: '0.625rem 1.25rem',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    border: selectedCategory === category.id 
                      ? '2px solid var(--color-vintage-gold)' 
                      : '2px solid var(--color-border)',
                    background: selectedCategory === category.id 
                      ? 'var(--color-vintage-gold)' 
                      : 'transparent',
                    color: selectedCategory === category.id 
                      ? 'var(--color-vintage-coffee)' 
                      : 'var(--color-vintage-brown)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {category.name}
                  <span style={{ 
                    marginLeft: '0.375rem',
                    opacity: 0.7 
                  }}>
                    ({category.count})
                  </span>
                </button>
              ))}
            </div>

            {/* Sort & Count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '0.625rem 1rem',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8125rem',
                  border: '2px solid var(--color-border)',
                  background: 'transparent',
                  color: 'var(--color-vintage-coffee)',
                  cursor: 'pointer',
                  minWidth: '180px'
                }}
              >
                <option value="name">Nama (A-Z)</option>
                <option value="price-low">Harga: Rendah → Tinggi</option>
                <option value="price-high">Harga: Tinggi → Rendah</option>
                <option value="featured">Produk Premium</option>
              </select>

              <div style={{
                padding: '0.625rem 1rem',
                background: 'var(--color-vintage-charcoal)',
                color: 'var(--color-vintage-gold)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.05em'
              }}>
                {sortedProducts.length} Produk
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PRODUCTS GRID ========== */}
      <section className="cabin-section" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
        <div className="container">
          {loading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '6rem 0' 
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                border: '3px solid var(--color-vintage-beige)',
                borderTop: '3px solid var(--color-vintage-gold)',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                animation: 'vintage-spin 1s linear infinite'
              }}></div>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.125rem',
                color: 'var(--color-vintage-brown)',
                fontStyle: 'italic'
              }}>
                Memuat koleksi kopi...
              </p>
            </div>
          ) : sortedProducts.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2rem'
            }}>
              {sortedProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '6rem 0' 
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                border: '2px solid var(--color-vintage-gold)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: 'var(--color-vintage-gold)'
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.5rem',
                color: 'var(--color-vintage-coffee)',
                marginBottom: '0.5rem'
              }}>
                Tidak Ada Produk
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-vintage-brown)'
              }}>
                Tidak ada produk dalam kategori ini.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ========== BOTTOM CTA ========== */}
      <section className="cabin-section cabin-section-dark" style={{ 
        paddingTop: '4rem', 
        paddingBottom: '4rem'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem'
          }}>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.75rem',
                color: 'var(--color-vintage-cream)',
                marginBottom: '0.5rem'
              }}>
                Butuh Bantuan Memilih?
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-vintage-beige)'
              }}>
                Tim kami siap membantu Anda menemukan kopi yang sempurna
              </p>
            </div>
            <a 
              href="mailto:info@kopiking.id"
              className="cabin-btn"
              style={{ whiteSpace: 'nowrap' }}
            >
              <span>Hubungi Kami</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
