'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    featuredProducts: 0,
    categories: []
  });
  const [orderStats, setOrderStats] = useState({
    counts: { all: 0, pending: 0, paid: 0, processing: 0, shipped: 0, delivered: 0 },
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch product stats
        const productRes = await fetch('/api/products');
        const productData = await productRes.json();
        if (productData.success) {
          const products = productData.data;
          setStats({
            totalProducts: products.length,
            featuredProducts: products.filter(p => p.featured).length,
            lowStockProducts: products.filter(p => p.stock < 10).length,
            categories: [
              { name: 'Arabica', count: products.filter(p => p.category === 'Arabica').length },
              { name: 'Robusta', count: products.filter(p => p.category === 'Robusta').length },
              { name: 'Blend', count: products.filter(p => p.category === 'Blend').length }
            ]
          });
        }

        // Fetch order stats
        const orderRes = await fetch('/api/admin/orders?limit=1');
        const orderData = await orderRes.json();
        if (orderData.success) {
          setOrderStats({
            counts: orderData.counts,
            totalRevenue: orderData.totalRevenue
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          fontWeight: 400,
          color: 'var(--color-vintage-coffee)',
          marginBottom: '0.5rem'
        }}>
          Dashboard
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--color-vintage-brown)'
        }}>
          Selamat datang di panel admin Pondok Kopi Potorono
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          border: '1px solid var(--color-border)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'var(--color-vintage-gold)'
          }}></div>
          <h3 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-vintage-brown)',
            marginBottom: '0.5rem'
          }}>
            Total Produk
          </h3>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.5rem',
            color: 'var(--color-vintage-coffee)'
          }}>
            {loading ? '...' : stats.totalProducts}
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          border: '1px solid var(--color-border)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'var(--color-vintage-brown)'
          }}></div>
          <h3 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-vintage-brown)',
            marginBottom: '0.5rem'
          }}>
            Produk Featured
          </h3>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.5rem',
            color: 'var(--color-vintage-coffee)'
          }}>
            {loading ? '...' : stats.featuredProducts}
          </p>
        </div>

        {stats.categories.map((cat, index) => (
          <div key={index} style={{
            background: 'white',
            padding: '1.5rem',
            border: '1px solid var(--color-border)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: index === 0 ? '#8B4513' : index === 1 ? '#654321' : '#A0522D'
            }}></div>
            <h3 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-vintage-brown)',
              marginBottom: '0.5rem'
            }}>
              {cat.name}
            </h3>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.5rem',
              color: 'var(--color-vintage-coffee)'
            }}>
              {loading ? '...' : cat.count}
            </p>
          </div>
        ))}
      </div>

      {/* Order Stats Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.25rem',
          color: 'var(--color-vintage-coffee)',
          marginBottom: '1rem'
        }}>
          Statistik Pesanan
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem'
        }}>
          {/* Revenue */}
          <div style={{
            background: 'linear-gradient(135deg, var(--color-vintage-charcoal) 0%, var(--color-vintage-coffee) 100%)',
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <h3 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-vintage-gold)',
              marginBottom: '0.5rem'
            }}>
              Total Pendapatan
            </h3>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              color: 'var(--color-vintage-cream)'
            }}>
              {loading ? '...' : `Rp ${orderStats.totalRevenue.toLocaleString('id-ID')}`}
            </p>
          </div>

          {/* Total Orders */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            border: '1px solid var(--color-border)',
            position: 'relative'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: '#3B82F6' }}></div>
            <h3 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-vintage-brown)',
              marginBottom: '0.5rem'
            }}>
              Total Pesanan
            </h3>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-vintage-coffee)' }}>
              {loading ? '...' : orderStats.counts.all}
            </p>
          </div>

          {/* Pending */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            border: '1px solid var(--color-border)',
            position: 'relative'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: '#F59E0B' }}></div>
            <h3 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-vintage-brown)',
              marginBottom: '0.5rem'
            }}>
              Menunggu Bayar
            </h3>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#F59E0B' }}>
              {loading ? '...' : orderStats.counts.pending}
            </p>
          </div>

          {/* Processing */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            border: '1px solid var(--color-border)',
            position: 'relative'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: '#6366F1' }}></div>
            <h3 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-vintage-brown)',
              marginBottom: '0.5rem'
            }}>
              Perlu Diproses
            </h3>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#6366F1' }}>
              {loading ? '...' : (orderStats.counts.paid + orderStats.counts.processing)}
            </p>
          </div>

          {/* Delivered */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            border: '1px solid var(--color-border)',
            position: 'relative'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: '#10B981' }}></div>
            <h3 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-vintage-brown)',
              marginBottom: '0.5rem'
            }}>
              Selesai
            </h3>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#10B981' }}>
              {loading ? '...' : orderStats.counts.delivered}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: 'white',
        padding: '1.5rem',
        border: '1px solid var(--color-border)'
      }}>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.25rem',
          color: 'var(--color-vintage-coffee)',
          marginBottom: '1rem'
        }}>
          Aksi Cepat
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
          <Link 
            href="/admin/products"
            className="cabin-btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            <span>Lihat Semua Produk</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
