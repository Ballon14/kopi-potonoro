'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/products';
import { useRouter } from 'next/navigation';

export default function OrderSuccessPage({ params }) {
  const { id } = use(params);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`);
        const data = await response.json();

        if (data.success) {
          setOrder(data.order);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to load order details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-vintage-cream)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="cabin-loader"></div>
          <p style={{ marginTop: '1rem', color: 'var(--color-vintage-coffee)' }}>Memuat pesanan...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-vintage-cream)',
        padding: '2rem'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h1 style={{ color: 'var(--color-vintage-rust)', fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1rem' }}>
            Pesanan Tidak Ditemukan
          </h1>
          <p style={{ marginBottom: '2rem', color: 'var(--color-vintage-charcoal)' }}>
            {error || 'Maaf, kami tidak dapat menemukan detail pesanan Anda.'}
          </p>
          <Link href="/" className="cabin-btn cabin-btn-solid">
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    );
  }

  const isSuccess = order.status === 'paid' || order.status === 'settlement';
  const isPending = order.status === 'pending';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-vintage-cream)',
      paddingTop: '6rem',
      paddingBottom: '4rem'
    }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>
          {/* Header Status */}
          <div style={{
            background: isSuccess ? 'var(--color-vintage-coffee)' : (isPending ? 'var(--color-vintage-charcoal)' : 'var(--color-vintage-rust)'),
            padding: '3rem 2rem',
            textAlign: 'center',
            color: 'var(--color-vintage-cream)',
            position: 'relative',
            overflow: 'hidden'
          }}>
             <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                opacity: 0.3
             }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 1.5rem',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(255,255,255,0.2)'
              }}>
                {isSuccess ? (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : isPending ? (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                ) : (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                )}
              </div>
              
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.5rem' }}>
                {isSuccess ? 'Pembayaran Berhasil!' : (isPending ? 'Menunggu Pembayaran' : 'Pembayaran Gagal')}
              </h1>
              <p style={{ opacity: 0.9, fontFamily: 'var(--font-sans)' }}>
                Order ID: {order.midtrans_order_id || order._id}
              </p>
            </div>
          </div>

          {/* Order Content */}
          <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: '1.25rem', 
                color: 'var(--color-vintage-coffee)',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--color-border)',
                marginBottom: '1rem'
              }}>
                Rincian Pesanan
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {order.items.map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       <div style={{
                         width: '50px',
                         height: '50px',
                         background: 'var(--color-vintage-beige)',
                         overflow: 'hidden',
                         borderRadius: '4px'
                       }}>
                         {item.image && (
                           <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                         )}
                       </div>
                       <div>
                         <p style={{ fontWeight: 600, color: 'var(--color-vintage-charcoal)', margin: 0 }}>{item.name}</p>
                         <p style={{ fontSize: '0.875rem', color: 'var(--color-vintage-brown)', margin: 0 }}>
                           {item.quantity} x {formatPrice(item.price)}
                         </p>
                       </div>
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--color-vintage-coffee)' }}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div style={{ 
              background: 'var(--color-vintage-light)', 
              padding: '1.5rem', 
              borderRadius: '8px',
              marginBottom: '2rem' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--color-vintage-brown)' }}>Status Pembayaran</span>
                <span style={{ 
                  fontWeight: 600, 
                  color: isSuccess ? 'green' : (isPending ? 'orange' : 'red'),
                  textTransform: 'capitalize'
                }}>
                  {order.status}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed rgba(0,0,0,0.1)' }}>
                <span style={{ fontWeight: 600, fontSize: '1.125rem', color: 'var(--color-vintage-charcoal)' }}>Total Bayar</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-vintage-gold)' }}>
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Link href="/products" className="cabin-btn" style={{ textAlign: 'center' }}>
                <span>Belanja Lagi</span>
              </Link>
              {isSuccess && (
                 <button className="cabin-btn cabin-btn-solid" style={{ textAlign: 'center' }} onClick={() => window.print()}>
                  <span>Cetak Invoice</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
