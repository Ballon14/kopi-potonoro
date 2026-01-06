'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/products';
import { useCart } from '@/lib/cart';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${resolvedParams.id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
          
          // Fetch related products
          const relatedRes = await fetch(`/api/products?category=${data.data.category}`);
          const relatedData = await relatedRes.json();
          if (relatedData.success) {
            const related = relatedData.data
              .filter(p => p._id !== data.data._id)
              .slice(0, 4);
            setRelatedProducts(related);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, var(--color-vintage-charcoal) 0%, var(--color-vintage-coffee) 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 1.5rem',
            border: '3px solid rgba(201, 169, 97, 0.2)',
            borderTop: '3px solid var(--color-vintage-gold)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{
            color: 'var(--color-vintage-gold)',
            fontFamily: 'var(--font-body)',
            fontSize: '1.125rem',
            letterSpacing: '0.1em'
          }}>
            Memuat produk...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-vintage-cream)',
        paddingTop: '120px'
      }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{
            width: '120px',
            height: '120px',
            margin: '0 auto 2rem',
            border: '2px solid var(--color-vintage-border)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="var(--color-vintage-brown)" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.5rem',
            color: 'var(--color-vintage-coffee)',
            marginBottom: '1rem'
          }}>
            Produk Tidak Ditemukan
          </h1>
          <p style={{
            color: 'var(--color-vintage-dark-brown)',
            marginBottom: '2rem',
            fontSize: '1.125rem'
          }}>
            Maaf, produk yang Anda cari tidak tersedia.
          </p>
          <Link href="/products" className="cabin-btn cabin-btn-solid">
            <span>Lihat Semua Produk</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= product.stock) {
      setQuantity(newQty);
    }
  };

  // Get roast level visual
  const getRoastLevel = (roast) => {
    const roastLevels = {
      'Light': 1,
      'Light-Medium': 2,
      'Medium': 3,
      'Medium-Dark': 4,
      'Dark': 5
    };
    return roastLevels[roast] || 3;
  };

  return (
    <div>
      {/* Hero Section with Product */}
      <section style={{
        background: 'linear-gradient(180deg, var(--color-vintage-charcoal) 0%, var(--color-vintage-coffee) 100%)',
        position: 'relative',
        paddingTop: '120px',
        paddingBottom: '4rem',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a961' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.5
        }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '2rem',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-sans)'
          }}>
            <Link href="/" style={{ color: 'var(--color-vintage-beige)', textDecoration: 'none', opacity: 0.7, transition: 'opacity 0.2s' }}>
              Beranda
            </Link>
            <span style={{ color: 'var(--color-vintage-gold)' }}>/</span>
            <Link href="/products" style={{ color: 'var(--color-vintage-beige)', textDecoration: 'none', opacity: 0.7, transition: 'opacity 0.2s' }}>
              Produk
            </Link>
            <span style={{ color: 'var(--color-vintage-gold)' }}>/</span>
            <span style={{ color: 'var(--color-vintage-cream)' }}>{product.name}</span>
          </nav>

          {/* Main Product Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '3rem',
            alignItems: 'start'
          }}>
            {/* Product Image */}
            <div style={{ gridColumn: 'span 12' }} className="lg-col-6">
              <div style={{
                position: 'relative',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                overflow: 'hidden',
                aspectRatio: '1',
                border: '1px solid rgba(201, 169, 97, 0.2)'
              }}>
                {product.imageUrl ? (
                  <>
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      onLoad={() => setImageLoaded(true)}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease, opacity 0.3s',
                        opacity: imageLoaded ? 1 : 0,
                        transform: imageLoaded ? 'scale(1)' : 'scale(1.1)'
                      }}
                    />
                    {!imageLoaded && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--color-vintage-coffee)'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          border: '3px solid rgba(201, 169, 97, 0.2)',
                          borderTop: '3px solid var(--color-vintage-gold)',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, var(--color-vintage-brown) 0%, var(--color-vintage-gold) 100%)'
                  }}>
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="var(--color-vintage-cream)" strokeWidth="1" opacity="0.5">
                      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                      <line x1="6" y1="1" x2="6" y2="4"/>
                      <line x1="10" y1="1" x2="10" y2="4"/>
                      <line x1="14" y1="1" x2="14" y2="4"/>
                    </svg>
                  </div>
                )}

                {/* Badges */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  {product.featured && (
                    <span style={{
                      background: 'var(--color-vintage-gold)',
                      color: 'var(--color-vintage-coffee)',
                      padding: '0.5rem 1rem',
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      boxShadow: 'var(--shadow-md)'
                    }}>
                      ★ Premium
                    </span>
                  )}
                  <span style={{
                    background: 'var(--color-vintage-charcoal)',
                    color: 'var(--color-vintage-cream)',
                    padding: '0.5rem 1rem',
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    border: '1px solid var(--color-vintage-gold)'
                  }}>
                    {product.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div style={{ gridColumn: 'span 12' }} className="lg-col-6">
              {/* Title & Price */}
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  fontWeight: 400,
                  letterSpacing: '0.05em',
                  color: 'var(--color-vintage-cream)',
                  marginBottom: '1rem',
                  lineHeight: 1.1
                }}>
                  {product.name}
                </h1>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.5rem',
                    color: 'var(--color-vintage-gold)'
                  }}>
                    {formatPrice(product.price)}
                  </span>
                  <span style={{
                    background: 'rgba(201, 169, 97, 0.2)',
                    color: 'var(--color-vintage-gold)',
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600,
                    border: '1px solid var(--color-vintage-gold)'
                  }}>
                    {product.weight}
                  </span>
                </div>
              </div>

              {/* Quick Info Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                {/* Origin */}
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(201, 169, 97, 0.3)',
                  padding: '1.25rem',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'var(--color-vintage-gold)'
                  }}></div>
                  <p style={{
                    fontSize: '0.65rem',
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--color-vintage-gold)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    marginBottom: '0.5rem'
                  }}>Origin</p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--color-vintage-cream)',
                    fontSize: '1rem',
                    fontFamily: 'var(--font-body)'
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {product.origin}
                  </div>
                </div>

                {/* Roast Level */}
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(201, 169, 97, 0.3)',
                  padding: '1.25rem',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'var(--color-vintage-gold)'
                  }}></div>
                  <p style={{
                    fontSize: '0.65rem',
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--color-vintage-gold)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    marginBottom: '0.5rem'
                  }}>Roast Level</p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: 'var(--color-vintage-cream)'
                  }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map(level => (
                        <div
                          key={level}
                          style={{
                            width: '20px',
                            height: '8px',
                            borderRadius: '2px',
                            background: level <= getRoastLevel(product.roast)
                              ? 'var(--color-vintage-gold)'
                              : 'rgba(255,255,255,0.1)'
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.9rem', fontFamily: 'var(--font-body)' }}>
                      {product.roast}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tasting Notes */}
              {product.tastingNotes && product.tastingNotes.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <p style={{
                    fontSize: '0.65rem',
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--color-vintage-gold)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    marginBottom: '0.75rem'
                  }}>Tasting Notes</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {product.tastingNotes.map((note, index) => (
                      <span 
                        key={index}
                        style={{
                          background: 'rgba(201, 169, 97, 0.1)',
                          border: '1px solid var(--color-vintage-gold)',
                          color: 'var(--color-vintage-cream)',
                          padding: '0.5rem 1rem',
                          fontSize: '0.8rem',
                          fontFamily: 'var(--font-body)',
                          transition: 'all 0.2s'
                        }}
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(201, 169, 97, 0.3)',
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                {/* Stock Status */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <span style={{
                    color: 'var(--color-vintage-beige)',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-body)'
                  }}>Ketersediaan</span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 0.8rem',
                    background: product.stock > 0 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                    border: `1px solid ${product.stock > 0 ? 'rgba(76, 175, 80, 0.5)' : 'rgba(244, 67, 54, 0.5)'}`,
                    borderRadius: '20px'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: product.stock > 0 ? '#4caf50' : '#f44336'
                    }}></div>
                    <span style={{
                      fontSize: '0.8rem',
                      color: product.stock > 0 ? '#4caf50' : '#f44336',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 600
                    }}>
                      {product.stock > 0 ? `${product.stock} pack tersedia` : 'Stok Habis'}
                    </span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <span style={{
                    color: 'var(--color-vintage-beige)',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-body)'
                  }}>Jumlah</span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid var(--color-vintage-gold)'
                  }}>
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      style={{
                        width: '44px',
                        height: '44px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-vintage-gold)',
                        cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                        opacity: quantity <= 1 ? 0.3 : 1,
                        fontSize: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      −
                    </button>
                    <span style={{
                      width: '60px',
                      textAlign: 'center',
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.25rem',
                      color: 'var(--color-vintage-cream)'
                    }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      style={{
                        width: '44px',
                        height: '44px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-vintage-gold)',
                        cursor: quantity >= product.stock ? 'not-allowed' : 'pointer',
                        opacity: quantity >= product.stock ? 0.3 : 1,
                        fontSize: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      +
                    </button>
                  </div>
                  <span style={{
                    color: 'var(--color-vintage-gold)',
                    fontSize: '1.25rem',
                    fontFamily: 'var(--font-display)',
                    marginLeft: 'auto'
                  }}>
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || addedToCart}
                  style={{
                    width: '100%',
                    padding: '1.25rem',
                    background: addedToCart ? '#4caf50' : 'var(--color-vintage-gold)',
                    color: addedToCart ? 'white' : 'var(--color-vintage-coffee)',
                    border: 'none',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    cursor: product.stock <= 0 ? 'not-allowed' : 'pointer',
                    opacity: product.stock <= 0 ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {addedToCart ? (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Ditambahkan!
                    </>
                  ) : product.stock > 0 ? (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 0 1-8 0"/>
                      </svg>
                      Tambah ke Keranjang
                    </>
                  ) : (
                    'Stok Habis'
                  )}
                </button>
              </div>

              {/* Features */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem'
              }}>
                {[
                  { icon: '🚚', text: 'Free Ongkir >Rp500K' },
                  { icon: '☕', text: 'Fresh Roasted' },
                  { icon: '✓', text: '100% Original' }
                ].map((feature, idx) => (
                  <div 
                    key={idx}
                    style={{
                      textAlign: 'center',
                      padding: '0.75rem 0.5rem',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    <span style={{ fontSize: '1.25rem', display: 'block', marginBottom: '0.25rem' }}>
                      {feature.icon}
                    </span>
                    <span style={{
                      fontSize: '0.65rem',
                      color: 'var(--color-vintage-beige)',
                      fontFamily: 'var(--font-sans)'
                    }}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Section */}
      <section style={{
        background: 'var(--color-vintage-cream)',
        padding: '4rem 0'
      }}>
        <div className="container">
          {/* Tabs */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0',
            marginBottom: '3rem',
            borderBottom: '2px solid var(--color-vintage-border)'
          }}>
            {[
              { id: 'description', label: 'Deskripsi' },
              { id: 'brewing', label: 'Cara Seduh' },
              { id: 'storage', label: 'Penyimpanan' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '1rem 2rem',
                  background: 'transparent',
                  border: 'none',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  color: activeTab === tab.id ? 'var(--color-vintage-gold)' : 'var(--color-vintage-brown)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'color 0.2s'
                }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-2px',
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'var(--color-vintage-gold)'
                  }}></div>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            animation: 'fadeIn 0.3s ease'
          }}>
            {activeTab === 'description' && (
              <div style={{ textAlign: 'center' }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  color: 'var(--color-vintage-coffee)',
                  marginBottom: '1.5rem'
                }}>
                  Tentang {product.name}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.125rem',
                  lineHeight: 1.8,
                  color: 'var(--color-vintage-dark-brown)',
                  textAlign: 'justify'
                }}>
                  {product.description}
                </p>
                
                {/* Coffee Details Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1.5rem',
                  marginTop: '3rem',
                  padding: '2rem',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-vintage-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                      Kategori
                    </p>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', color: 'var(--color-vintage-coffee)' }}>
                      {product.category}
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-vintage-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                      Asal
                    </p>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', color: 'var(--color-vintage-coffee)' }}>
                      {product.origin}
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-vintage-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                      Tingkat Sangrai
                    </p>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', color: 'var(--color-vintage-coffee)' }}>
                      {product.roast}
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-vintage-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                      Berat Bersih
                    </p>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', color: 'var(--color-vintage-coffee)' }}>
                      {product.weight}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'brewing' && (
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  color: 'var(--color-vintage-coffee)',
                  marginBottom: '2rem',
                  textAlign: 'center'
                }}>
                  Panduan Penyeduhan
                </h3>
                
                <div style={{
                  display: 'grid',
                  gap: '1.5rem'
                }}>
                  {[
                    { step: 1, title: 'Manual Brew (V60/Chemex)', desc: 'Gunakan rasio 1:15 (kopi:air). Giling kopi medium, tuang air 92-96°C secara perlahan dengan gerakan melingkar. Waktu seduh: 2.5-3 menit.' },
                    { step: 2, title: 'French Press', desc: 'Gunakan rasio 1:12. Giling kopi coarse, tuang air panas dan aduk. Diamkan 4 menit, tekan plunger perlahan, dan sajikan.' },
                    { step: 3, title: 'Espresso', desc: 'Gunakan 18-20g kopi dengan giling halus. Ekstraksi 25-30 detik untuk menghasilkan 36-40ml espresso dengan crema sempurna.' }
                  ].map(item => (
                    <div 
                      key={item.step}
                      style={{
                        display: 'flex',
                        gap: '1.5rem',
                        padding: '1.5rem',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)'
                      }}
                    >
                      <div style={{
                        width: '50px',
                        height: '50px',
                        background: 'var(--color-vintage-gold)',
                        color: 'var(--color-vintage-coffee)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.5rem',
                        flexShrink: 0
                      }}>
                        {item.step}
                      </div>
                      <div>
                        <h4 style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.125rem',
                          color: 'var(--color-vintage-coffee)',
                          marginBottom: '0.5rem'
                        }}>
                          {item.title}
                        </h4>
                        <p style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.95rem',
                          color: 'var(--color-vintage-dark-brown)',
                          lineHeight: 1.7
                        }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'storage' && (
              <div style={{ textAlign: 'center' }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  color: 'var(--color-vintage-coffee)',
                  marginBottom: '2rem'
                }}>
                  Tips Penyimpanan
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {[
                    { icon: '🌡️', title: 'Suhu Ruangan', desc: 'Simpan di tempat sejuk dengan suhu stabil 15-25°C' },
                    { icon: '☀️', title: 'Hindari Cahaya', desc: 'Jauhkan dari paparan sinar matahari langsung' },
                    { icon: '💨', title: 'Kedap Udara', desc: 'Gunakan wadah kedap udara setelah dibuka' },
                    { icon: '📅', title: 'Best Before', desc: 'Nikmati dalam 30 hari setelah roasting untuk rasa optimal' }
                  ].map((item, idx) => (
                    <div 
                      key={idx}
                      style={{
                        padding: '2rem',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        textAlign: 'center'
                      }}
                    >
                      <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>
                        {item.icon}
                      </span>
                      <h4 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.125rem',
                        color: 'var(--color-vintage-coffee)',
                        marginBottom: '0.5rem'
                      }}>
                        {item.title}
                      </h4>
                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem',
                        color: 'var(--color-vintage-dark-brown)'
                      }}>
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section style={{
          background: 'var(--color-vintage-beige)',
          padding: '5rem 0'
        }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-sans)',
                color: 'var(--color-vintage-gold)',
                textTransform: 'uppercase',
                letterSpacing: '0.2em'
              }}>
                Rekomendasi
              </span>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: 'var(--color-vintage-coffee)',
                marginTop: '0.5rem'
              }}>
                Produk Sejenis
              </h2>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}>
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (min-width: 1024px) {
          .lg-col-6 {
            grid-column: span 6 !important;
          }
        }
      `}</style>
    </div>
  );
}
