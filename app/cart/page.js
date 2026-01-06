'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/products';
import { useUser } from '@clerk/nextjs';
import ShippingCalculator from '@/components/ShippingCalculator';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [selectedShippingService, setSelectedShippingService] = useState(null);
  const [orderNotes, setOrderNotes] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  
  // Customer Address
  const [customerAddress, setCustomerAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    postalCode: ''
  });

  useEffect(() => {
    // Load Midtrans Snap Script
    const snapScript = 'https://app.sandbox.midtrans.com/snap/snap.js';
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    
    const script = document.createElement('script');
    script.src = snapScript;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;
    
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Load saved address from localStorage
  useEffect(() => {
    const savedAddress = localStorage.getItem('kopiking_address');
    if (savedAddress) {
      setCustomerAddress(JSON.parse(savedAddress));
    }
  }, []);

  // Save address to localStorage when it changes
  const handleAddressChange = (field, value) => {
    const newAddress = { ...customerAddress, [field]: value };
    setCustomerAddress(newAddress);
    localStorage.setItem('kopiking_address', JSON.stringify(newAddress));
  };

  const handleApplyPromo = () => {
    setPromoError('');
    // Example promo codes
    const promoCodes = {
      'KOPIKING10': 0.1,  // 10% discount
      'KOPI20': 0.2,    // 20% discount
      'NEWUSER': 0.15   // 15% for new users
    };
    
    if (promoCodes[promoCode.toUpperCase()]) {
      setPromoApplied(true);
      const discount = getCartTotal() * promoCodes[promoCode.toUpperCase()];
      setPromoDiscount(discount);
    } else {
      setPromoError('Kode promo tidak valid');
      setPromoApplied(false);
      setPromoDiscount(0);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoApplied(false);
    setPromoDiscount(0);
    setPromoError('');
  };

  const handleShippingSelected = (cost, service) => {
    setShippingCost(cost);
    setSelectedShippingService(service);
  };

  const handleCheckout = async () => {
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    // Validate required fields
    if (!customerAddress.fullName || !customerAddress.phone || !customerAddress.address) {
      alert('Mohon lengkapi data pengiriman terlebih dahulu');
      return;
    }

    if (shippingCost === 0) {
      alert('Mohon pilih layanan pengiriman terlebih dahulu');
      return;
    }

    setLoading(true);

    try {
      const finalTotal = getCartTotal() - promoDiscount + shippingCost;
      
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          total: finalTotal,
          shippingCost,
          shippingService: selectedShippingService,
          promoCode: promoApplied ? promoCode : null,
          promoDiscount,
          customerAddress,
          orderNotes
        }),
      });

      const data = await response.json();

      if (data.success) {
        window.snap.pay(data.token, {
          onSuccess: function(result) {
            clearCart();
            console.log('Payment success:', result);
            router.push(`/order/success/${data.order.midtrans_order_id}`);
          },
          onPending: function(result) {
            clearCart();
            console.log('Payment pending:', result);
            router.push(`/order/success/${data.order.midtrans_order_id}`);
          },
          onError: function(result) {
            alert('Pembayaran Gagal!');
            console.log(result);
          },
          onClose: function() {
            alert('Anda menutup popup pembayaran sebelum menyelesaikan pembayaran.');
          }
        });
      } else {
        alert(data.error || 'Gagal memproses pembayaran');
      }
    } catch (error) {
      console.error('Checkout Error:', error);
      alert('Terjadi kesalahan saat memproses pembayaran');
    } finally {
      setLoading(false);
    }
  };

  const getCartWeight = () => {
    // Parse weight from each product (e.g., "200g", "250g")
    return cart.reduce((total, item) => {
      const weightStr = item.weight || '200g';
      const weight = parseInt(weightStr.replace(/[^\d]/g, '')) || 200;
      return total + (weight * item.quantity);
    }, 0);
  };

  const handleClearCart = () => {
    clearCart();
    setShowConfirmClear(false);
    setShippingCost(0);
    setSelectedShippingService(null);
    setPromoCode('');
    setPromoApplied(false);
    setPromoDiscount(0);
  };

  const getFinalTotal = () => {
    return getCartTotal() - promoDiscount + shippingCost;
  };

  if (cart.length === 0) {
    return (
      <div>
        {/* ========== HERO SECTION (Empty) ========== */}
        <section style={{
          minHeight: '70vh',
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
          
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '2rem', maxWidth: '500px' }}>
            {/* Coffee Cup Animation */}
            <div style={{
              width: '150px',
              height: '150px',
              margin: '0 auto 2rem',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                border: '2px solid var(--color-vintage-gold)',
                borderRadius: '50%',
                animation: 'pulse 2s ease-in-out infinite'
              }}></div>
              <div style={{
                position: 'absolute',
                inset: '15px',
                border: '1px solid var(--color-vintage-gold)',
                borderRadius: '50%',
                opacity: 0.5,
                animation: 'pulse 2s ease-in-out infinite 0.5s'
              }}></div>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--color-vintage-gold)" strokeWidth="1.5">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
              </div>
            </div>
            
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 400,
              letterSpacing: '0.05em',
              color: 'var(--color-vintage-cream)',
              marginBottom: '1rem'
            }}>
              Keranjang Kosong
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.125rem',
              color: 'var(--color-vintage-beige)',
              marginBottom: '2rem',
              fontStyle: 'italic',
              lineHeight: 1.8
            }}>
              Belum ada produk dalam keranjang Anda.<br/>
              Mari jelajahi koleksi kopi premium kami!
            </p>
            
            {/* Decorative line */}
            <div style={{
              width: '60px',
              height: '2px',
              background: 'var(--color-vintage-gold)',
              margin: '0 auto 2rem'
            }}></div>
            
            <Link href="/products" className="cabin-btn cabin-btn-solid">
              <span>Belanja Sekarang</span>
            </Link>
          </div>
        </section>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.7; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div>
      {/* ========== HERO SECTION (With Items) ========== */}
      <section style={{
        minHeight: '35vh',
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
          <span className="cabin-tagline">Checkout</span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 400,
            letterSpacing: '0.08em',
            color: 'var(--color-vintage-cream)',
            marginTop: '1rem',
            marginBottom: '1rem'
          }}>
            Keranjang Anda
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.125rem',
            color: 'var(--color-vintage-beige)',
            fontStyle: 'italic'
          }}>
            {cart.length} produk • {cart.reduce((sum, item) => sum + item.quantity, 0)} item • Berat: {getCartWeight()}g
          </p>
        </div>
      </section>

      {/* ========== CART CONTENT ========== */}
      <section className="cabin-section" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
            
            {/* Left Column - Cart Items & Address */}
            <div style={{ gridColumn: 'span 12', order: 2 }} className="lg-col-8">
              
              {/* Cart Items */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  paddingBottom: '1rem', 
                  borderBottom: '1px solid var(--color-vintage-border)',
                  marginBottom: '1.5rem'
                }}>
                  <h2 style={{ 
                    fontFamily: 'var(--font-heading)', 
                    fontSize: '1.5rem', 
                    color: 'var(--color-vintage-coffee)',
                    margin: 0
                  }}>
                    Item Pesanan
                  </h2>
                  <button
                    onClick={() => setShowConfirmClear(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-vintage-rust)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      fontFamily: 'var(--font-sans)',
                      padding: '0.5rem',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    Kosongkan
                  </button>
                </div>

                {/* Confirm Clear Modal */}
                {showConfirmClear && (
                  <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                  }}>
                    <div style={{
                      background: 'var(--color-vintage-cream)',
                      padding: '2rem',
                      borderRadius: '8px',
                      maxWidth: '400px',
                      textAlign: 'center',
                      boxShadow: 'var(--shadow-xl)'
                    }}>
                      <h3 style={{ 
                        fontFamily: 'var(--font-heading)', 
                        marginBottom: '1rem',
                        color: 'var(--color-vintage-coffee)'
                      }}>
                        Kosongkan Keranjang?
                      </h3>
                      <p style={{ 
                        color: 'var(--color-vintage-dark-brown)', 
                        marginBottom: '1.5rem',
                        fontSize: '0.95rem'
                      }}>
                        Semua item dalam keranjang akan dihapus. Tindakan ini tidak dapat dibatalkan.
                      </p>
                      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button
                          onClick={() => setShowConfirmClear(false)}
                          style={{
                            padding: '0.75rem 1.5rem',
                            border: '2px solid var(--color-vintage-brown)',
                            background: 'transparent',
                            color: 'var(--color-vintage-brown)',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            transition: 'all 0.2s'
                          }}
                        >
                          Batal
                        </button>
                        <button
                          onClick={handleClearCart}
                          style={{
                            padding: '0.75rem 1.5rem',
                            border: '2px solid var(--color-vintage-rust)',
                            background: 'var(--color-vintage-rust)',
                            color: 'white',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            transition: 'all 0.2s'
                          }}
                        >
                          Hapus Semua
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {cart.map((item, index) => (
                    <div 
                      key={item.id} 
                      style={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-vintage-border)',
                        padding: '1.5rem',
                        display: 'grid',
                        gridTemplateColumns: '100px 1fr auto',
                        gap: '1.5rem',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        animation: `fadeIn 0.3s ease ${index * 0.1}s both`
                      }}
                    >
                      {/* Top accent line */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(to right, var(--color-vintage-brown), var(--color-vintage-gold), var(--color-vintage-brown))'
                      }}></div>

                      {/* Image */}
                      <div style={{
                        width: '100px',
                        height: '100px',
                        background: 'var(--color-vintage-beige)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {item.imageUrl ? (
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        ) : (
                          <div style={{ 
                            width: '100%', 
                            height: '100%', 
                            background: 'linear-gradient(135deg, var(--color-vintage-brown) 0%, var(--color-vintage-gold) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-vintage-cream)" strokeWidth="1.5">
                              <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                              <line x1="6" y1="1" x2="6" y2="4"/>
                              <line x1="10" y1="1" x2="10" y2="4"/>
                              <line x1="14" y1="1" x2="14" y2="4"/>
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <Link 
                            href={`/products/${item.id}`} 
                            style={{
                              fontFamily: 'var(--font-heading)',
                              fontSize: '1.25rem',
                              color: 'var(--color-vintage-coffee)',
                              textDecoration: 'none',
                              transition: 'color 0.2s'
                            }}
                          >
                            {item.name}
                          </Link>
                          <p style={{
                            fontSize: '0.875rem',
                            color: 'var(--color-vintage-brown)',
                            margin: '0.25rem 0 0.5rem'
                          }}>
                            {item.origin} • {item.weight} • {item.roast}
                          </p>
                          <p style={{
                            fontSize: '0.875rem',
                            color: 'var(--color-vintage-gold)',
                            fontFamily: 'var(--font-display)'
                          }}>
                            {formatPrice(item.price)} / pack
                          </p>
                        </div>

                        {/* Quantity Controls - Mobile Friendly */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          marginTop: '1rem'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            border: '1px solid var(--color-vintage-brown)',
                            padding: '0.25rem'
                          }}>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              style={{
                                width: '32px',
                                height: '32px',
                                border: 'none',
                                background: 'transparent',
                                color: 'var(--color-vintage-brown)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.25rem',
                                fontWeight: 600,
                                transition: 'all 0.2s'
                              }}
                            >
                              −
                            </button>
                            <span style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '1.125rem',
                              minWidth: '40px',
                              textAlign: 'center',
                              color: 'var(--color-vintage-coffee)'
                            }}>
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              style={{
                                width: '32px',
                                height: '32px',
                                border: 'none',
                                background: 'transparent',
                                color: 'var(--color-vintage-brown)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.25rem',
                                fontWeight: 600,
                                transition: 'all 0.2s'
                              }}
                            >
                              +
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--color-vintage-rust)',
                              cursor: 'pointer',
                              padding: '0.5rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.8rem',
                              fontFamily: 'var(--font-sans)',
                              opacity: 0.8,
                              transition: 'opacity 0.2s'
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                            Hapus
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div style={{
                        textAlign: 'right',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        justifyContent: 'center'
                      }}>
                        <span style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.5rem',
                          color: 'var(--color-vintage-gold)'
                        }}>
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Address Form */}
              <div style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-vintage-border)',
                padding: '2rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  position: 'relative',
                  paddingTop: '3px'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(to right, var(--color-vintage-brown), var(--color-vintage-gold), var(--color-vintage-brown))'
                  }}></div>
                </div>
                
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  color: 'var(--color-vintage-coffee)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-vintage-gold)" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Alamat Pengiriman
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-sans)',
                      color: 'var(--color-vintage-brown)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '0.5rem'
                    }}>
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      value={customerAddress.fullName}
                      onChange={(e) => handleAddressChange('fullName', e.target.value)}
                      placeholder="Nama penerima"
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        border: '1px solid var(--color-vintage-border)',
                        background: 'var(--color-vintage-cream)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        color: 'var(--color-vintage-coffee)',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-sans)',
                      color: 'var(--color-vintage-brown)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '0.5rem'
                    }}>
                      No. Telepon *
                    </label>
                    <input
                      type="tel"
                      value={customerAddress.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        border: '1px solid var(--color-vintage-border)',
                        background: 'var(--color-vintage-cream)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        color: 'var(--color-vintage-coffee)',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-sans)',
                      color: 'var(--color-vintage-brown)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '0.5rem'
                    }}>
                      Kode Pos
                    </label>
                    <input
                      type="text"
                      value={customerAddress.postalCode}
                      onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                      placeholder="12345"
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        border: '1px solid var(--color-vintage-border)',
                        background: 'var(--color-vintage-cream)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        color: 'var(--color-vintage-coffee)',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                    />
                  </div>
                  
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-sans)',
                      color: 'var(--color-vintage-brown)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '0.5rem'
                    }}>
                      Alamat Lengkap *
                    </label>
                    <textarea
                      value={customerAddress.address}
                      onChange={(e) => handleAddressChange('address', e.target.value)}
                      placeholder="Jalan, RT/RW, Kelurahan, Kecamatan"
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        border: '1px solid var(--color-vintage-border)',
                        background: 'var(--color-vintage-cream)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        color: 'var(--color-vintage-coffee)',
                        outline: 'none',
                        resize: 'vertical',
                        transition: 'border-color 0.2s'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-vintage-border)',
                padding: '2rem'
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  color: 'var(--color-vintage-coffee)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-vintage-gold)" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                  Catatan Pesanan (Opsional)
                </h3>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Tambahkan catatan untuk pesanan Anda, misalnya: instruksi pengiriman khusus, preferensi roasting level, dll."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '1px solid var(--color-vintage-border)',
                    background: 'var(--color-vintage-cream)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    color: 'var(--color-vintage-coffee)',
                    outline: 'none',
                    resize: 'vertical',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>
            </div>

            {/* Right Column - Summary & Shipping */}
            <div style={{ gridColumn: 'span 12', order: 1 }} className="lg-col-4">
              {/* Order Summary */}
              <div style={{
                background: 'var(--color-vintage-charcoal)',
                padding: '2rem',
                position: 'relative',
                marginBottom: '1.5rem'
              }}>
                {/* Ornamental corners */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  width: '2rem',
                  height: '2rem',
                  borderTop: '2px solid var(--color-vintage-gold)',
                  borderLeft: '2px solid var(--color-vintage-gold)'
                }}></div>
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  width: '2rem',
                  height: '2rem',
                  borderBottom: '2px solid var(--color-vintage-gold)',
                  borderRight: '2px solid var(--color-vintage-gold)'
                }}></div>

                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  color: 'var(--color-vintage-cream)',
                  textAlign: 'center',
                  marginBottom: '2rem',
                  letterSpacing: '0.05em'
                }}>
                  Ringkasan Pesanan
                </h2>

                {/* Items Summary */}
                <div style={{ marginBottom: '1.5rem' }}>
                  {cart.map(item => (
                    <div 
                      key={item.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: 'var(--color-vintage-beige)',
                        fontSize: '0.9rem',
                        marginBottom: '0.5rem',
                        paddingBottom: '0.5rem',
                        borderBottom: '1px solid rgba(255,255,255,0.1)'
                      }}
                    >
                      <span>{item.name} × {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div style={{
                  height: '1px',
                  background: 'linear-gradient(to right, transparent, var(--color-vintage-gold), transparent)',
                  margin: '1.5rem 0'
                }}></div>

                {/* Promo Code */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--color-vintage-gold)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    marginBottom: '0.75rem'
                  }}>
                    Kode Promo
                  </label>
                  {!promoApplied ? (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Masukkan kode"
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          border: '1px solid var(--color-vintage-brown)',
                          background: 'rgba(255,255,255,0.05)',
                          color: 'var(--color-vintage-cream)',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.875rem',
                          outline: 'none',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em'
                        }}
                      />
                      <button
                        onClick={handleApplyPromo}
                        disabled={!promoCode}
                        style={{
                          padding: '0.75rem 1rem',
                          background: 'var(--color-vintage-gold)',
                          color: 'var(--color-vintage-coffee)',
                          border: 'none',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          cursor: 'pointer',
                          opacity: promoCode ? 1 : 0.5,
                          transition: 'opacity 0.2s'
                        }}
                      >
                        Pakai
                      </button>
                    </div>
                  ) : (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      background: 'rgba(76, 175, 80, 0.1)',
                      border: '1px solid rgba(76, 175, 80, 0.3)'
                    }}>
                      <div>
                        <span style={{ 
                          color: '#4caf50', 
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.875rem',
                          fontWeight: 600
                        }}>
                          ✓ {promoCode}
                        </span>
                        <span style={{ 
                          color: 'var(--color-vintage-beige)', 
                          fontSize: '0.8rem',
                          marginLeft: '0.5rem'
                        }}>
                          (-{formatPrice(promoDiscount)})
                        </span>
                      </div>
                      <button
                        onClick={handleRemovePromo}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-vintage-rust)',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                  {promoError && (
                    <p style={{ 
                      color: 'var(--color-vintage-rust)', 
                      fontSize: '0.8rem',
                      marginTop: '0.5rem'
                    }}>
                      {promoError}
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-vintage-beige)' }}>
                    <span>Subtotal</span>
                    <span>{formatPrice(getCartTotal())}</span>
                  </div>
                  {promoApplied && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4caf50' }}>
                      <span>Diskon</span>
                      <span>-{formatPrice(promoDiscount)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-vintage-beige)' }}>
                    <span>Ongkir</span>
                    <span style={{ 
                      color: shippingCost ? 'var(--color-vintage-cream)' : 'var(--color-vintage-brown)',
                      fontStyle: shippingCost ? 'normal' : 'italic'
                    }}>
                      {shippingCost ? formatPrice(shippingCost) : 'Pilih layanan'}
                    </span>
                  </div>
                  {selectedShippingService && (
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: 'var(--color-vintage-brown)',
                      textAlign: 'right',
                      marginTop: '-0.5rem'
                    }}>
                      {selectedShippingService}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div style={{
                  height: '1px',
                  background: 'linear-gradient(to right, transparent, var(--color-vintage-gold), transparent)',
                  margin: '1.5rem 0'
                }}></div>

                {/* Total */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2rem'
                }}>
                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.125rem',
                    color: 'var(--color-vintage-cream)'
                  }}>
                    Total
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    color: 'var(--color-vintage-gold)'
                  }}>
                    {formatPrice(getFinalTotal())}
                  </span>
                </div>

                {/* Checkout Button */}
                {!isSignedIn ? (
                  <Link 
                    href="/sign-in"
                    className="cabin-btn cabin-btn-solid"
                    style={{ 
                      width: '100%', 
                      textAlign: 'center', 
                      display: 'block',
                      marginBottom: '1rem'
                    }}
                  >
                    <span>Login untuk Checkout</span>
                  </Link>
                ) : (
                  <button 
                    onClick={handleCheckout}
                    disabled={loading || shippingCost === 0}
                    className="cabin-btn cabin-btn-solid"
                    style={{ 
                      width: '100%',
                      marginBottom: '1rem',
                      opacity: (loading || shippingCost === 0) ? 0.6 : 1,
                      cursor: (loading || shippingCost === 0) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <span>
                      {loading ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                          </svg>
                          Memproses...
                        </span>
                      ) : shippingCost === 0 ? (
                        'Pilih Ongkir Dulu'
                      ) : (
                        'Bayar Sekarang'
                      )}
                    </span>
                  </button>
                )}
                
                <Link 
                  href="/products" 
                  className="cabin-btn"
                  style={{ 
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    textDecoration: 'none' 
                  }}
                >
                  <span>Lanjut Belanja</span>
                </Link>

                {/* Security Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '1.5rem',
                  color: 'var(--color-vintage-brown)',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-sans)'
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Pembayaran Aman via Midtrans
                </div>
              </div>

              {/* Shipping Calculator */}
              <ShippingCalculator 
                cartWeight={getCartWeight()} 
                onShippingSelected={handleShippingSelected}
                customerAddress={customerAddress}
              />
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (min-width: 1024px) {
          .lg-col-8 {
            grid-column: span 8 !important;
            order: 1 !important;
          }
          .lg-col-4 {
            grid-column: span 4 !important;
            order: 2 !important;
          }
          .lg-col-4 > div:first-child {
            position: sticky;
            top: 100px;
          }
        }
        input:focus, textarea:focus {
          border-color: var(--color-vintage-gold) !important;
        }
      `}</style>
    </div>
  );
}
