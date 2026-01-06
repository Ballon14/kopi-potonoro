'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser, SignInButton } from '@clerk/nextjs';
import { formatPrice } from '@/lib/products';

export default function OrdersPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('all');
  const [counts, setCounts] = useState({});
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, order: null });
  const [deleting, setDeleting] = useState(false);
  const [cancelModal, setCancelModal] = useState({ show: false, order: null });
  const [cancelling, setCancelling] = useState(false);

  const statusTabs = [
    { id: 'all', label: 'Semua' },
    { id: 'pending', label: 'Menunggu' },
    { id: 'paid', label: 'Dibayar' },
    { id: 'processing', label: 'Diproses' },
    { id: 'shipped', label: 'Dikirim' },
    { id: 'delivered', label: 'Selesai' },
    { id: 'cancelled', label: 'Dibatalkan' }
  ];

  const statusStyles = {
    pending: { bg: '#FEF3C7', color: '#92400E', label: 'Menunggu Pembayaran' },
    paid: { bg: '#D1FAE5', color: '#065F46', label: 'Pembayaran Berhasil' },
    processing: { bg: '#DBEAFE', color: '#1E40AF', label: 'Sedang Diproses' },
    shipped: { bg: '#E0E7FF', color: '#3730A3', label: 'Dalam Pengiriman' },
    delivered: { bg: '#D1FAE5', color: '#065F46', label: 'Selesai' },
    failed: { bg: '#FEE2E2', color: '#991B1B', label: 'Gagal' },
    cancelled: { bg: '#F3F4F6', color: '#374151', label: 'Dibatalkan' }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchOrders();
    } else if (isLoaded && !isSignedIn) {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, activeStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?status=${activeStatus}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
        setCounts(data.counts);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteOrder = async () => {
    if (!deleteModal.order) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/orders/${deleteModal.order._id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      
      if (data.success) {
        setOrders(orders.filter(o => o._id !== deleteModal.order._id));
        setDeleteModal({ show: false, order: null });
        // Update counts
        setCounts(prev => ({
          ...prev,
          all: prev.all - 1,
          [deleteModal.order.status]: prev[deleteModal.order.status] - 1
        }));
      } else {
        alert(data.error || 'Gagal menghapus pesanan');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Gagal menghapus pesanan');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelModal.order) return;
    
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${cancelModal.order._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });
      const data = await res.json();
      
      if (data.success) {
        setOrders(orders.map(o => 
          o._id === cancelModal.order._id 
            ? { ...o, status: 'cancelled' } 
            : o
        ));
        setCancelModal({ show: false, order: null });
        // Update counts
        setCounts(prev => ({
          ...prev,
          pending: prev.pending - 1,
          cancelled: prev.cancelled + 1
        }));
      } else {
        alert(data.error || 'Gagal membatalkan pesanan');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Gagal membatalkan pesanan');
    } finally {
      setCancelling(false);
    }
  };

  const handlePayOrder = (order) => {
    if (!order.midtrans_token) {
      alert('Token pembayaran tidak tersedia. Silakan buat pesanan baru.');
      return;
    }

    // Load Midtrans Snap if not already loaded
    if (!window.snap) {
      const script = document.createElement('script');
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY);
      script.onload = () => {
        window.snap.pay(order.midtrans_token, {
          onSuccess: function(result) {
            console.log('Payment success:', result);
            window.location.href = `/order/success/${order.midtrans_order_id}`;
          },
          onPending: function(result) {
            console.log('Payment pending:', result);
            alert('Pembayaran pending. Silakan selesaikan pembayaran.');
            fetchOrders();
          },
          onError: function(result) {
            console.error('Payment error:', result);
            alert('Pembayaran gagal. Silakan coba lagi.');
          },
          onClose: function() {
            console.log('Payment popup closed');
          }
        });
      };
      document.body.appendChild(script);
    } else {
      window.snap.pay(order.midtrans_token, {
        onSuccess: function(result) {
          console.log('Payment success:', result);
          window.location.href = `/order/success/${order.midtrans_order_id}`;
        },
        onPending: function(result) {
          console.log('Payment pending:', result);
          alert('Pembayaran pending. Silakan selesaikan pembayaran.');
          fetchOrders();
        },
        onError: function(result) {
          console.error('Payment error:', result);
          alert('Pembayaran gagal. Silakan coba lagi.');
        },
        onClose: function() {
          console.log('Payment popup closed');
        }
      });
    }
  };

  if (!isLoaded) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-vintage-cream)'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '3px solid var(--color-vintage-beige)',
          borderTop: '3px solid var(--color-vintage-gold)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--color-vintage-cream)',
        paddingTop: '120px'
      }}>
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 2rem',
            border: '2px solid var(--color-vintage-gold)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="var(--color-vintage-gold)" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.5rem',
            color: 'var(--color-vintage-coffee)',
            marginBottom: '1rem'
          }}>
            Silakan Masuk
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-vintage-dark-brown)',
            marginBottom: '2rem',
            fontSize: '1.125rem'
          }}>
            Anda perlu masuk untuk melihat riwayat pesanan
          </p>
          <SignInButton mode="modal">
            <button className="cabin-btn cabin-btn-solid">
              <span>Masuk Sekarang</span>
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--color-vintage-cream)'
    }}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(180deg, var(--color-vintage-charcoal) 0%, var(--color-vintage-coffee) 100%)',
        position: 'relative',
        paddingTop: '120px',
        paddingBottom: '3rem'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a961' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.5
        }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Link href="/" style={{ color: 'var(--color-vintage-beige)', opacity: 0.7, fontSize: '0.875rem' }}>
              Beranda
            </Link>
            <span style={{ color: 'var(--color-vintage-gold)' }}>/</span>
            <span style={{ color: 'var(--color-vintage-cream)', fontSize: '0.875rem' }}>Pesanan Saya</span>
          </div>
          
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: 'var(--color-vintage-cream)',
            marginBottom: '0.5rem'
          }}>
            Riwayat Pesanan
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-vintage-beige)',
            opacity: 0.8
          }}>
            Lihat dan lacak semua pesanan Anda
          </p>
        </div>
      </section>

      {/* Status Tabs */}
      <section style={{
        background: 'white',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: '60px',
        zIndex: 40
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            gap: '0',
            overflowX: 'auto',
            padding: '0.5rem 0'
          }}>
            {statusTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveStatus(tab.id)}
                style={{
                  padding: '1rem 1.5rem',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  color: activeStatus === tab.id ? 'var(--color-vintage-coffee)' : 'var(--color-vintage-brown)',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeStatus === tab.id ? '2px solid var(--color-vintage-gold)' : '2px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
                {counts[tab.id] > 0 && (
                  <span style={{
                    background: activeStatus === tab.id ? 'var(--color-vintage-gold)' : 'var(--color-vintage-beige)',
                    color: activeStatus === tab.id ? 'var(--color-vintage-coffee)' : 'var(--color-vintage-brown)',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '10px',
                    fontSize: '0.7rem',
                    fontWeight: 600
                  }}>
                    {counts[tab.id]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Orders List */}
      <section style={{ padding: '2rem 0 4rem' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div style={{
                width: '50px',
                height: '50px',
                margin: '0 auto 1rem',
                border: '3px solid var(--color-vintage-beige)',
                borderTop: '3px solid var(--color-vintage-gold)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{ color: 'var(--color-vintage-brown)' }}>Memuat pesanan...</p>
            </div>
          ) : orders.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'white',
              border: '1px solid var(--color-border)'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 1.5rem',
                border: '2px solid var(--color-vintage-gold)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-vintage-gold)" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.5rem',
                color: 'var(--color-vintage-coffee)',
                marginBottom: '0.5rem'
              }}>
                Belum Ada Pesanan
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-vintage-dark-brown)',
                marginBottom: '1.5rem'
              }}>
                {activeStatus === 'all' 
                  ? 'Anda belum memiliki pesanan. Mulai belanja sekarang!'
                  : `Tidak ada pesanan dengan status "${statusTabs.find(t => t.id === activeStatus)?.label}"`
                }
              </p>
              <Link href="/products" className="cabin-btn cabin-btn-solid">
                <span>Belanja Sekarang</span>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map(order => (
                <div 
                  key={order._id}
                  style={{
                    background: 'white',
                    border: '1px solid var(--color-border)',
                    overflow: 'hidden'
                  }}
                >
                  {/* Order Header */}
                  <div style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    background: 'var(--color-vintage-surface)'
                  }}>
                    <div>
                      <p style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.75rem',
                        color: 'var(--color-vintage-brown)',
                        marginBottom: '0.25rem'
                      }}>
                        Order ID
                      </p>
                      <p style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1rem',
                        color: 'var(--color-vintage-coffee)',
                        fontWeight: 600
                      }}>
                        {order.midtrans_order_id}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.75rem',
                        color: 'var(--color-vintage-brown)',
                        marginBottom: '0.25rem'
                      }}>
                        {formatDate(order.createdAt)}
                      </p>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        fontFamily: 'var(--font-sans)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        background: statusStyles[order.status]?.bg || '#F3F4F6',
                        color: statusStyles[order.status]?.color || '#374151',
                        borderRadius: '4px'
                      }}>
                        {statusStyles[order.status]?.label || order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      marginBottom: '1rem'
                    }}>
                      {/* Product Images */}
                      <div style={{
                        display: 'flex',
                        gap: '-0.5rem'
                      }}>
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              width: '60px',
                              height: '60px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              border: '2px solid white',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              marginLeft: idx > 0 ? '-15px' : 0,
                              position: 'relative',
                              zIndex: 3 - idx
                            }}
                          >
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <div style={{
                                width: '100%',
                                height: '100%',
                                background: 'var(--color-vintage-beige)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-vintage-brown)" strokeWidth="1.5" opacity="0.5">
                                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                                </svg>
                              </div>
                            )}
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '8px',
                            background: 'var(--color-vintage-charcoal)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: '-15px',
                            border: '2px solid white',
                            color: 'var(--color-vintage-gold)',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.8rem',
                            fontWeight: 600
                          }}>
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>

                      {/* Order Summary */}
                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.9rem',
                          color: 'var(--color-vintage-dark-brown)',
                          marginBottom: '0.25rem'
                        }}>
                          {order.items.map(item => item.name).slice(0, 2).join(', ')}
                          {order.items.length > 2 && ` dan ${order.items.length - 2} lainnya`}
                        </p>
                        <p style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.8rem',
                          color: 'var(--color-vintage-brown)'
                        }}>
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} item
                        </p>
                      </div>

                      {/* Total */}
                      <div style={{ textAlign: 'right' }}>
                        <p style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.7rem',
                          color: 'var(--color-vintage-brown)',
                          marginBottom: '0.25rem'
                        }}>
                          Total Pembayaran
                        </p>
                        <p style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.25rem',
                          color: 'var(--color-vintage-coffee)'
                        }}>
                          {formatPrice(order.total_amount)}
                        </p>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedOrder === order._id && (
                      <div style={{
                        marginTop: '1rem',
                        paddingTop: '1rem',
                        borderTop: '1px dashed var(--color-border)',
                        animation: 'fadeIn 0.3s ease'
                      }}>
                        {/* Items Detail */}
                        <div style={{ marginBottom: '1.5rem' }}>
                          <h4 style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: 'var(--color-vintage-brown)',
                            marginBottom: '1rem'
                          }}>
                            Detail Produk
                          </h4>
                          {order.items.map((item, idx) => (
                            <div 
                              key={idx}
                              style={{
                                display: 'flex',
                                gap: '1rem',
                                padding: '0.75rem 0',
                                borderBottom: idx < order.items.length - 1 ? '1px solid var(--color-border)' : 'none'
                              }}
                            >
                              <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '6px',
                                overflow: 'hidden',
                                background: 'var(--color-vintage-beige)',
                                flexShrink: 0
                              }}>
                                {item.image && (
                                  <img 
                                    src={item.image} 
                                    alt={item.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                )}
                              </div>
                              <div style={{ flex: 1 }}>
                                <p style={{
                                  fontFamily: 'var(--font-heading)',
                                  fontSize: '0.9rem',
                                  color: 'var(--color-vintage-coffee)'
                                }}>
                                  {item.name}
                                </p>
                                <p style={{
                                  fontFamily: 'var(--font-sans)',
                                  fontSize: '0.8rem',
                                  color: 'var(--color-vintage-brown)'
                                }}>
                                  {item.quantity} x {formatPrice(item.price)}
                                </p>
                              </div>
                              <p style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '0.9rem',
                                color: 'var(--color-vintage-coffee)'
                              }}>
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Shipping Info */}
                        {order.shipping_address && (
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1.5rem',
                            padding: '1rem',
                            background: 'var(--color-vintage-surface)',
                            borderRadius: '8px'
                          }}>
                            <div>
                              <h4 style={{
                                fontFamily: 'var(--font-sans)',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                color: 'var(--color-vintage-gold)',
                                marginBottom: '0.5rem'
                              }}>
                                Alamat Pengiriman
                              </h4>
                              <p style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.9rem',
                                color: 'var(--color-vintage-dark-brown)',
                                lineHeight: 1.6
                              }}>
                                {order.shipping_address.fullName}<br/>
                                {order.shipping_address.phone}<br/>
                                {order.shipping_address.address}<br/>
                                {order.shipping_address.postalCode}
                              </p>
                            </div>
                            {order.shipping_service && (
                              <div>
                                <h4 style={{
                                  fontFamily: 'var(--font-sans)',
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  letterSpacing: '0.1em',
                                  textTransform: 'uppercase',
                                  color: 'var(--color-vintage-gold)',
                                  marginBottom: '0.5rem'
                                }}>
                                  Pengiriman
                                </h4>
                                <p style={{
                                  fontFamily: 'var(--font-body)',
                                  fontSize: '0.9rem',
                                  color: 'var(--color-vintage-dark-brown)'
                                }}>
                                  {order.shipping_service}
                                </p>
                                {order.tracking_number && (
                                  <p style={{
                                    fontFamily: 'var(--font-sans)',
                                    fontSize: '0.8rem',
                                    color: 'var(--color-vintage-brown)',
                                    marginTop: '0.25rem'
                                  }}>
                                    No. Resi: <strong>{order.tracking_number}</strong>
                                  </p>
                                )}
                              </div>
                            )}
                            <div>
                              <h4 style={{
                                fontFamily: 'var(--font-sans)',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                color: 'var(--color-vintage-gold)',
                                marginBottom: '0.5rem'
                              }}>
                                Pembayaran
                              </h4>
                              <p style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.9rem',
                                color: 'var(--color-vintage-dark-brown)'
                              }}>
                                {order.payment_type || '-'}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Order Notes */}
                        {order.notes && (
                          <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            background: '#FEF9C3',
                            borderRadius: '8px',
                            borderLeft: '4px solid #EAB308'
                          }}>
                            <h4 style={{
                              fontFamily: 'var(--font-sans)',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              color: '#92400E',
                              marginBottom: '0.25rem'
                            }}>
                              Catatan Pesanan
                            </h4>
                            <p style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: '0.9rem',
                              color: '#78350F'
                            }}>
                              {order.notes}
                            </p>
                          </div>
                        )}

                        {/* Price Breakdown */}
                        <div style={{
                          marginTop: '1rem',
                          paddingTop: '1rem',
                          borderTop: '1px solid var(--color-border)'
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '0.5rem'
                          }}>
                            <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-vintage-brown)', fontSize: '0.9rem' }}>
                              Subtotal
                            </span>
                            <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-vintage-dark-brown)', fontSize: '0.9rem' }}>
                              {formatPrice(order.subtotal || (order.total_amount - (order.shipping_cost || 0) + (order.promo_discount || 0)))}
                            </span>
                          </div>
                          {order.promo_discount > 0 && (
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginBottom: '0.5rem'
                            }}>
                              <span style={{ fontFamily: 'var(--font-body)', color: '#059669', fontSize: '0.9rem' }}>
                                Diskon ({order.promo_code})
                              </span>
                              <span style={{ fontFamily: 'var(--font-body)', color: '#059669', fontSize: '0.9rem' }}>
                                -{formatPrice(order.promo_discount)}
                              </span>
                            </div>
                          )}
                          {order.shipping_cost > 0 && (
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginBottom: '0.5rem'
                            }}>
                              <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-vintage-brown)', fontSize: '0.9rem' }}>
                                Ongkos Kirim
                              </span>
                              <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-vintage-dark-brown)', fontSize: '0.9rem' }}>
                                {formatPrice(order.shipping_cost)}
                              </span>
                            </div>
                          )}
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingTop: '0.5rem',
                            borderTop: '1px solid var(--color-border)'
                          }}>
                            <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-vintage-coffee)', fontSize: '1rem', fontWeight: 600 }}>
                              Total
                            </span>
                            <span style={{ fontFamily: 'var(--font-display)', color: 'var(--color-vintage-coffee)', fontSize: '1.25rem' }}>
                              {formatPrice(order.total_amount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{
                      display: 'flex',
                      gap: '0.75rem',
                      marginTop: '1rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--color-border)'
                    }}>
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                        style={{
                          padding: '0.625rem 1.25rem',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          border: '1px solid var(--color-border)',
                          background: 'transparent',
                          color: 'var(--color-vintage-coffee)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.2s'
                        }}
                      >
                        {expandedOrder === order._id ? 'Sembunyikan' : 'Lihat Detail'}
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                          style={{
                            transform: expandedOrder === order._id ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                          }}
                        >
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </button>
                      
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handlePayOrder(order)}
                            style={{
                              padding: '0.625rem 1.25rem',
                              fontFamily: 'var(--font-sans)',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              border: 'none',
                              background: 'var(--color-vintage-gold)',
                              color: 'var(--color-vintage-coffee)',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            Bayar Sekarang
                          </button>
                          <button
                            onClick={() => setCancelModal({ show: true, order })}
                            style={{
                              padding: '0.625rem 1.25rem',
                              fontFamily: 'var(--font-sans)',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              border: '1px solid #EF4444',
                              background: 'transparent',
                              color: '#EF4444',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="15" y1="9" x2="9" y2="15"/>
                              <line x1="9" y1="9" x2="15" y2="15"/>
                            </svg>
                            Batalkan
                          </button>
                        </>
                      )}

                      {order.status === 'shipped' && order.tracking_number && (
                        <a
                          href={`https://cekresi.com/?noresi=${order.tracking_number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '0.625rem 1.25rem',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            border: '1px solid var(--color-vintage-gold)',
                            background: 'transparent',
                            color: 'var(--color-vintage-gold)',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          Lacak Pengiriman
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                        </a>
                      )}

                      {/* Delete button for pending, failed, cancelled orders */}
                      {['pending', 'failed', 'cancelled'].includes(order.status) && (
                        <button
                          onClick={() => setDeleteModal({ show: true, order })}
                          style={{
                            padding: '0.625rem 1.25rem',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            border: '1px solid var(--color-border)',
                            background: 'transparent',
                            color: 'var(--color-vintage-brown)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                          </svg>
                          Hapus
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            animation: 'fadeIn 0.2s ease'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              margin: '0 auto 1rem',
              background: '#FEE2E2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </div>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              color: 'var(--color-vintage-coffee)',
              marginBottom: '0.5rem'
            }}>
              Hapus Pesanan?
            </h3>
            <p style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-vintage-brown)',
              marginBottom: '1.5rem',
              fontSize: '0.9rem'
            }}>
              Pesanan <strong>{deleteModal.order?.midtrans_order_id}</strong> akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteModal({ show: false, order: null })}
                disabled={deleting}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid var(--color-border)',
                  background: 'white',
                  color: 'var(--color-vintage-coffee)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  borderRadius: '6px'
                }}
              >
                Batal
              </button>
              <button
                onClick={handleDeleteOrder}
                disabled={deleting}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  background: '#EF4444',
                  color: 'white',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  borderRadius: '6px',
                  opacity: deleting ? 0.7 : 1
                }}
              >
                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModal.show && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            animation: 'fadeIn 0.2s ease'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              margin: '0 auto 1rem',
              background: '#FEF3C7',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              color: 'var(--color-vintage-coffee)',
              marginBottom: '0.5rem'
            }}>
              Batalkan Pesanan?
            </h3>
            <p style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-vintage-brown)',
              marginBottom: '1.5rem',
              fontSize: '0.9rem'
            }}>
              Pesanan <strong>{cancelModal.order?.midtrans_order_id}</strong> akan dibatalkan. Anda tidak dapat membayar pesanan ini setelah dibatalkan.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => setCancelModal({ show: false, order: null })}
                disabled={cancelling}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid var(--color-border)',
                  background: 'white',
                  color: 'var(--color-vintage-coffee)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  borderRadius: '6px'
                }}
              >
                Kembali
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  background: '#D97706',
                  color: 'white',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: cancelling ? 'not-allowed' : 'pointer',
                  borderRadius: '6px',
                  opacity: cancelling ? 0.7 : 1
                }}
              >
                {cancelling ? 'Membatalkan...' : 'Ya, Batalkan'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
