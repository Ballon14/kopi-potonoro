'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('all');
  const [counts, setCounts] = useState({});
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updating, setUpdating] = useState(null);

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
    pending: { bg: '#FEF3C7', color: '#92400E', label: 'Menunggu' },
    paid: { bg: '#D1FAE5', color: '#065F46', label: 'Dibayar' },
    processing: { bg: '#DBEAFE', color: '#1E40AF', label: 'Diproses' },
    shipped: { bg: '#E0E7FF', color: '#3730A3', label: 'Dikirim' },
    delivered: { bg: '#D1FAE5', color: '#065F46', label: 'Selesai' },
    failed: { bg: '#FEE2E2', color: '#991B1B', label: 'Gagal' },
    cancelled: { bg: '#F3F4F6', color: '#374151', label: 'Dibatalkan' }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?status=${activeStatus}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
        setCounts(data.counts);
        setTotalRevenue(data.totalRevenue);
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
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        fetchOrders(); // Refresh counts
      } else {
        alert(data.error || 'Gagal update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Gagal update status');
    } finally {
      setUpdating(null);
    }
  };

  const updateTrackingNumber = async (orderId, trackingNumber) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracking_number: trackingNumber })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, tracking_number: trackingNumber } : o));
        alert('Nomor resi berhasil disimpan');
      } else {
        alert(data.error || 'Gagal menyimpan nomor resi');
      }
    } catch (error) {
      console.error('Error updating tracking:', error);
      alert('Gagal menyimpan nomor resi');
    }
  };

  const getNextStatus = (currentStatus) => {
    const flow = {
      pending: null,
      paid: 'processing',
      processing: 'shipped',
      shipped: 'delivered'
    };
    return flow[currentStatus] || null;
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          fontWeight: 400,
          color: 'var(--color-vintage-coffee)',
          marginBottom: '0.5rem'
        }}>
          Kelola Pesanan
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--color-vintage-brown)'
        }}>
          Total Pendapatan: <strong style={{ color: 'var(--color-vintage-gold)' }}>{formatPrice(totalRevenue)}</strong>
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {statusTabs.slice(0, 5).map(tab => (
          <div
            key={tab.id}
            onClick={() => setActiveStatus(tab.id)}
            style={{
              background: 'white',
              padding: '1rem',
              border: activeStatus === tab.id ? '2px solid var(--color-vintage-gold)' : '1px solid var(--color-border)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-vintage-brown)',
              marginBottom: '0.25rem'
            }}>
              {tab.label}
            </p>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              color: 'var(--color-vintage-coffee)'
            }}>
              {counts[tab.id] || 0}
            </p>
          </div>
        ))}
      </div>

      {/* Status Tabs */}
      <div style={{
        display: 'flex',
        gap: '0',
        overflowX: 'auto',
        marginBottom: '1.5rem',
        borderBottom: '1px solid var(--color-border)'
      }}>
        {statusTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveStatus(tab.id)}
            style={{
              padding: '0.75rem 1.25rem',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem',
              fontWeight: 500,
              color: activeStatus === tab.id ? 'var(--color-vintage-coffee)' : 'var(--color-vintage-brown)',
              background: 'transparent',
              border: 'none',
              borderBottom: activeStatus === tab.id ? '2px solid var(--color-vintage-gold)' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
            {counts[tab.id] > 0 && (
              <span style={{
                marginLeft: '0.5rem',
                background: activeStatus === tab.id ? 'var(--color-vintage-gold)' : 'var(--color-vintage-beige)',
                color: activeStatus === tab.id ? 'white' : 'var(--color-vintage-brown)',
                padding: '0.125rem 0.5rem',
                borderRadius: '10px',
                fontSize: '0.7rem'
              }}>
                {counts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div style={{
        background: 'white',
        border: '1px solid var(--color-border)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-vintage-brown)' }}>Memuat pesanan...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-vintage-brown)' }}>Tidak ada pesanan</p>
          </div>
        ) : (
          <div>
            {orders.map((order, index) => (
              <div
                key={order._id}
                style={{
                  borderTop: index > 0 ? '1px solid var(--color-border)' : 'none'
                }}
              >
                {/* Order Row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr',
                    gap: '1rem',
                    padding: '1rem 1.5rem',
                    alignItems: 'center',
                    background: index % 2 === 0 ? 'white' : 'rgba(232, 220, 196, 0.2)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                >
                  {/* Order ID & Date */}
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: 'var(--color-vintage-coffee)'
                    }}>
                      {order.midtrans_order_id}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.75rem',
                      color: 'var(--color-vintage-brown)'
                    }}>
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  {/* Customer */}
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      color: 'var(--color-vintage-dark-brown)'
                    }}>
                      {order.user_name || 'Unknown'}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.7rem',
                      color: 'var(--color-vintage-brown)'
                    }}>
                      {order.user_email}
                    </p>
                  </div>

                  {/* Items */}
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.8rem',
                      color: 'var(--color-vintage-dark-brown)'
                    }}>
                      {order.items?.reduce((sum, item) => sum + item.quantity, 0)} item
                    </p>
                  </div>

                  {/* Total */}
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      color: 'var(--color-vintage-gold)'
                    }}>
                      {formatPrice(order.total_amount)}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
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

                  {/* Actions */}
                  <div onClick={e => e.stopPropagation()}>
                    {getNextStatus(order.status) && (
                      <button
                        onClick={() => updateOrderStatus(order._id, getNextStatus(order.status))}
                        disabled={updating === order._id}
                        style={{
                          padding: '0.5rem 0.75rem',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.7rem',
                          fontWeight: 500,
                          background: 'var(--color-vintage-gold)',
                          color: 'white',
                          border: 'none',
                          cursor: updating === order._id ? 'wait' : 'pointer',
                          opacity: updating === order._id ? 0.6 : 1
                        }}
                      >
                        {updating === order._id ? '...' : statusStyles[getNextStatus(order.status)]?.label}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order._id && (
                  <div style={{
                    padding: '1.5rem',
                    background: 'var(--color-vintage-surface)',
                    borderTop: '1px dashed var(--color-border)'
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '1.5rem'
                    }}>
                      {/* Items */}
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
                          Produk
                        </h4>
                        {order.items?.map((item, idx) => (
                          <div key={idx} style={{
                            display: 'flex',
                            gap: '0.5rem',
                            padding: '0.5rem 0',
                            borderBottom: '1px solid var(--color-border)'
                          }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              background: 'var(--color-vintage-beige)',
                              borderRadius: '4px',
                              overflow: 'hidden'
                            }}>
                              {item.image && (
                                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              )}
                            </div>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-vintage-coffee)' }}>
                                {item.name}
                              </p>
                              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--color-vintage-brown)' }}>
                                {item.quantity} x {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Shipping */}
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
                        {order.shipping_address && (
                          <div style={{ marginBottom: '1rem' }}>
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-vintage-dark-brown)', lineHeight: 1.5 }}>
                              {order.shipping_address.fullName}<br />
                              {order.shipping_address.phone}<br />
                              {order.shipping_address.address}<br />
                              {order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postalCode}
                            </p>
                          </div>
                        )}
                        {order.shipping_service && (
                          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--color-vintage-brown)' }}>
                            Kurir: {order.shipping_service}
                          </p>
                        )}
                        
                        {/* Tracking Number Input */}
                        {(order.status === 'shipped' || order.status === 'processing') && (
                          <div style={{ marginTop: '1rem' }}>
                            <label style={{
                              fontFamily: 'var(--font-sans)',
                              fontSize: '0.7rem',
                              fontWeight: 500,
                              color: 'var(--color-vintage-brown)',
                              display: 'block',
                              marginBottom: '0.25rem'
                            }}>
                              No. Resi
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <input
                                type="text"
                                defaultValue={order.tracking_number || ''}
                                placeholder="Masukkan nomor resi"
                                style={{
                                  flex: 1,
                                  padding: '0.5rem',
                                  fontFamily: 'var(--font-sans)',
                                  fontSize: '0.85rem',
                                  border: '1px solid var(--color-border)',
                                  background: 'white'
                                }}
                                onBlur={(e) => {
                                  if (e.target.value !== order.tracking_number) {
                                    updateTrackingNumber(order._id, e.target.value);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        )}
                        {order.tracking_number && order.status !== 'shipped' && order.status !== 'processing' && (
                          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: 'var(--color-vintage-dark-brown)', marginTop: '0.5rem' }}>
                            No. Resi: <strong>{order.tracking_number}</strong>
                          </p>
                        )}
                      </div>

                      {/* Payment */}
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
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-vintage-dark-brown)' }}>
                          Metode: {order.payment_type || '-'}
                        </p>
                        {order.subtotal && (
                          <div style={{ marginTop: '0.5rem' }}>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--color-vintage-brown)' }}>
                              Subtotal: {formatPrice(order.subtotal)}
                            </p>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--color-vintage-brown)' }}>
                              Ongkir: {formatPrice(order.shipping_cost || 0)}
                            </p>
                            {order.promo_discount > 0 && (
                              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--color-vintage-rust)' }}>
                                Diskon: -{formatPrice(order.promo_discount)}
                              </p>
                            )}
                            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--color-vintage-coffee)', marginTop: '0.5rem' }}>
                              Total: {formatPrice(order.total_amount)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
