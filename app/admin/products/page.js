'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter(p => p._id !== id));
        alert('Produk berhasil dihapus');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal menghapus produk');
    }
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem' 
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: 400,
            color: 'var(--color-vintage-coffee)',
            marginBottom: '0.5rem'
          }}>
            Kelola Produk
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-vintage-brown)'
          }}>
            {products.length} produk tersedia
          </p>
        </div>
        <Link 
          href="/admin/products/new"
          className="cabin-btn cabin-btn-solid"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span>Tambah Produk</span>
        </Link>
      </div>

      {/* Products Table */}
      <div style={{
        background: 'white',
        border: '1px solid var(--color-border)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-vintage-brown)' }}>Memuat...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-vintage-brown)', marginBottom: '1rem' }}>
              Belum ada produk
            </p>
            <Link href="/admin/products/new" className="cabin-btn cabin-btn-solid">
              <span>Tambah Produk Pertama</span>
            </Link>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-vintage-beige)' }}>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-vintage-coffee)'
                }}>
                  Produk
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-vintage-coffee)'
                }}>
                  Kategori
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-vintage-coffee)'
                }}>
                  Harga
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'center',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-vintage-coffee)'
                }}>
                  Stock
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'center',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-vintage-coffee)'
                }}>
                  Featured
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'right',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-vintage-coffee)'
                }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr 
                  key={product._id}
                  style={{ 
                    borderTop: '1px solid var(--color-border)',
                    background: index % 2 === 0 ? 'white' : 'rgba(232, 220, 196, 0.3)'
                  }}
                >
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        background: 'var(--color-vintage-beige)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        overflow: 'hidden'
                      }}>
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-vintage-brown)" strokeWidth="1.5" style={{ opacity: 0.4 }}>
                            <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                          </svg>
                        )}
                      </div>
                      <div>
                        <p style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: 'var(--color-vintage-coffee)',
                          marginBottom: '0.125rem'
                        }}>
                          {product.name}
                        </p>
                        <p style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.75rem',
                          color: 'var(--color-vintage-brown)'
                        }}>
                          {product.origin}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.75rem',
                      background: 'var(--color-vintage-beige)',
                      color: 'var(--color-vintage-coffee)'
                    }}>
                      {product.category}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      color: 'var(--color-vintage-gold)'
                    }}>
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: product.stock === 0 ? '#FEE2E2' : product.stock < 10 ? '#FEF3C7' : '#D1FAE5',
                      color: product.stock === 0 ? '#991B1B' : product.stock < 10 ? '#92400E' : '#065F46'
                    }}>
                      {product.stock === 0 && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="15" y1="9" x2="9" y2="15"/>
                          <line x1="9" y1="9" x2="15" y2="15"/>
                        </svg>
                      )}
                      {product.stock}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    {product.featured ? (
                      <span style={{ color: 'var(--color-vintage-gold)' }}>★</span>
                    ) : (
                      <span style={{ color: 'var(--color-border)' }}>☆</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <Link 
                        href={`/admin/products/${product._id}/edit`}
                        style={{
                          padding: '0.5rem 0.75rem',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.75rem',
                          border: '1px solid var(--color-vintage-brown)',
                          background: 'transparent',
                          color: 'var(--color-vintage-brown)',
                          textDecoration: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        style={{
                          padding: '0.5rem 0.75rem',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.75rem',
                          border: '1px solid var(--color-vintage-rust)',
                          background: 'transparent',
                          color: 'var(--color-vintage-rust)',
                          cursor: 'pointer'
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
