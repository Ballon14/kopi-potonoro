import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

async function getFeaturedProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products?featured=true`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    const products = data.data || [];
    
    return [
      { id: "all", name: "Semua Kopi", count: products.length },
      { id: "arabica", name: "Arabica", count: products.filter(p => p.category === "Arabica").length },
      { id: "robusta", name: "Robusta", count: products.filter(p => p.category === "Robusta").length },
      { id: "blend", name: "Blend", count: products.filter(p => p.category === "Blend").length }
    ];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const categories = await getCategories();

  const services = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
          <line x1="6" y1="1" x2="6" y2="4"/>
          <line x1="10" y1="1" x2="10" y2="4"/>
          <line x1="14" y1="1" x2="14" y2="4"/>
        </svg>
      ),
      title: "Kopi Pilihan",
      desc: "Biji kopi terbaik dipilih langsung dari petani lokal di berbagai daerah Nusantara"
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      ),
      title: "Kualitas Terjamin",
      desc: "Setiap produk melalui quality control ketat untuk menjamin cita rasa yang konsisten"
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="3" width="15" height="13"/>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      ),
      title: "Pengiriman Cepat",
      desc: "Kami memastikan kopi segar sampai ke tangan Anda dengan pengemasan yang aman"
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      title: "Pemberdayaan Petani",
      desc: "Bermitra langsung dengan petani lokal untuk memastikan kesejahteraan bersama"
    }
  ];

  return (
    <div>
      {/* ========== HERO SECTION ========== */}
      <section className="cabin-hero">
        <div className="parallax-overlay"></div>
        <div className="cabin-hero-content">
          <span className="cabin-tagline" style={{
            animation: 'fadeInDown 0.8s ease-out'
          }}>
            Warisan Sejak 1950
          </span>
          
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            letterSpacing: '0.08em'
          }}>
            Cita Rasa Nusantara
          </h1>
          
          <p style={{
            fontFamily: 'var(--font-body)',
            fontStyle: 'italic'
          }}>
            Nikmati kopi pilihan terbaik dari berbagai penjuru Indonesia. 
            Setiap tegukan membawa Anda dalam perjalanan cita rasa yang tak terlupakan.
          </p>

          <div className="cabin-ornament" style={{ marginBottom: '2rem' }}>
            <div className="cabin-ornament-line"></div>
            <div className="cabin-ornament-diamond"></div>
            <div className="cabin-ornament-line"></div>
          </div>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
            animation: 'fadeInUp 1s ease-out 0.4s both'
          }}>
            <Link href="/products" className="cabin-btn cabin-btn-solid">
              <span>Jelajahi Produk</span>
            </Link>
            <Link href="/about" className="cabin-btn">
              <span>Tentang Kami</span>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'fadeIn 1s ease-out 1s both'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'var(--color-vintage-gold)',
            opacity: 0.6
          }}>
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.625rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem'
            }}>Scroll</span>
            <svg width="20" height="30" viewBox="0 0 20 30" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="1" width="18" height="28" rx="9" />
              <circle cx="10" cy="8" r="2" fill="currentColor">
                <animate attributeName="cy" values="8;14;8" dur="1.5s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>
        </div>
      </section>

      {/* ========== COUNTERS SECTION ========== */}
      <section className="cabin-section cabin-section-dark">
        <div className="container">
          <div className="cabin-counters">
            <div className="cabin-counter">
              <div className="cabin-counter-number">70+</div>
              <div className="cabin-counter-label">Tahun Pengalaman</div>
            </div>
            <div className="cabin-counter">
              <div className="cabin-counter-number">15K+</div>
              <div className="cabin-counter-label">Pelanggan Puas</div>
            </div>
            <div className="cabin-counter">
              <div className="cabin-counter-number">50+</div>
              <div className="cabin-counter-label">Variasi Kopi</div>
            </div>
            <div className="cabin-counter">
              <div className="cabin-counter-number">100+</div>
              <div className="cabin-counter-label">Petani Mitra</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== WHAT WE DO SECTION ========== */}
      <section className="cabin-section" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="cabin-tagline">Layanan Kami</span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-vintage-coffee)',
              marginTop: '1rem'
            }}>
              Apa Yang Kami Tawarkan
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.125rem',
              maxWidth: '600px',
              margin: '1rem auto 0',
              color: 'var(--color-vintage-dark-brown)'
            }}>
              Komitmen kami untuk menghadirkan pengalaman kopi terbaik dari Nusantara
            </p>
          </div>

          <div className="cabin-services">
            {services.map((service, index) => (
              <div key={index} className="cabin-service-card">
                <div className="cabin-service-icon">
                  {service.icon}
                </div>
                <h3 className="cabin-service-title">{service.title}</h3>
                <p className="cabin-service-desc">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURED PRODUCTS ========== */}
      <section className="cabin-section cabin-section-beige" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="cabin-tagline">Koleksi Premium</span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-vintage-coffee)',
              marginTop: '1rem'
            }}>
              Kopi Pilihan Kami
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.125rem',
              maxWidth: '600px',
              margin: '1rem auto 0',
              color: 'var(--color-vintage-dark-brown)'
            }}>
              Koleksi kopi terbaik yang dipilih khusus untuk para penikmat kopi sejati
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{ marginBottom: '3rem' }}>
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/products" className="cabin-btn cabin-btn-solid">
              <span>Lihat Semua Produk</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========== CATEGORIES SECTION ========== */}
      <section className="cabin-section" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="cabin-tagline">Kategori</span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-vintage-coffee)',
              marginTop: '1rem'
            }}>
              Jelajahi Berdasarkan Jenis
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.filter(cat => cat.id !== 'all').map(category => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                style={{
                  display: 'block',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                className="cabin-service-card"
              >
                <div style={{
                  width: '100px',
                  height: '100px',
                  margin: '0 auto 1.5rem',
                  border: '2px solid var(--color-vintage-gold)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-vintage-gold)',
                  transition: 'all 0.3s ease'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                    <line x1="6" y1="1" x2="6" y2="4"/>
                    <line x1="10" y1="1" x2="10" y2="4"/>
                    <line x1="14" y1="1" x2="14" y2="4"/>
                  </svg>
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: 'var(--color-vintage-coffee)',
                  marginBottom: '0.5rem'
                }}>
                  {category.name}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.875rem',
                  color: 'var(--color-vintage-brown)',
                  letterSpacing: '0.05em'
                }}>
                  {category.count} Produk Tersedia
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIAL SECTION ========== */}
      <section className="cabin-section cabin-section-dark" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div className="container">
          <div className="cabin-testimonial">
            <div className="cabin-testimonial-quote">
              Setiap tegukan kopi dari KopiKing membawa saya kembali ke kenangan masa kecil di kampung halaman. 
              Rasa yang autentik dan kualitas yang konsisten membuat mereka menjadi pilihan utama saya.
            </div>
            <div className="cabin-ornament">
              <div className="cabin-ornament-line"></div>
              <div className="cabin-ornament-diamond"></div>
              <div className="cabin-ornament-line"></div>
            </div>
            <div className="cabin-testimonial-author">
              Ahmad Wijaya — Penikmat Kopi Jakarta
            </div>
          </div>
        </div>
      </section>

      {/* ========== STORY SECTION ========== */}
      <section className="cabin-section" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '4rem',
            alignItems: 'center'
          }}>
            <div>
              <span className="cabin-tagline" style={{ marginBottom: '1rem', display: 'inline-block' }}>
                Cerita Kami
              </span>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-vintage-coffee)',
                marginBottom: '1.5rem'
              }}>
                Warisan Tujuh Dekade
              </h2>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.0625rem',
                lineHeight: 1.8,
                color: 'var(--color-vintage-dark-brown)',
                marginBottom: '1rem'
              }}>
                KopiKing lahir dari kecintaan mendalam terhadap kopi Nusantara. 
                Sejak 1950, kami telah berkomitmen untuk menghadirkan kopi terbaik dari berbagai penjuru Indonesia.
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.0625rem',
                lineHeight: 1.8,
                color: 'var(--color-vintage-dark-brown)',
                marginBottom: '2rem'
              }}>
                Setiap biji kopi dipilih dengan cermat langsung dari petani lokal, 
                memastikan kualitas terbaik dan mendukung ekonomi lokal.
              </p>
              <Link href="/about" className="cabin-btn cabin-btn-solid">
                <span>Selengkapnya</span>
              </Link>
            </div>
            <div style={{
              background: 'var(--color-vintage-beige)',
              padding: '3rem',
              position: 'relative',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Ornamental corners */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                width: '60px',
                height: '60px',
                borderTop: '2px solid var(--color-vintage-gold)',
                borderLeft: '2px solid var(--color-vintage-gold)'
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                width: '60px',
                height: '60px',
                borderBottom: '2px solid var(--color-vintage-gold)',
                borderRight: '2px solid var(--color-vintage-gold)'
              }}></div>
              
              <div style={{ textAlign: 'center', color: 'var(--color-vintage-brown)', opacity: 0.3 }}>
                <svg width="180" height="180" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                  <line x1="6" y1="1" x2="6" y2="4" stroke="currentColor" strokeWidth="0.5"/>
                  <line x1="10" y1="1" x2="10" y2="4" stroke="currentColor" strokeWidth="0.5"/>
                  <line x1="14" y1="1" x2="14" y2="4" stroke="currentColor" strokeWidth="0.5"/>
                </svg>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  marginTop: '1rem',
                  letterSpacing: '0.1em'
                }}>
                  Est. 1950
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="cabin-section cabin-section-dark" style={{ 
        paddingTop: '6rem', 
        paddingBottom: '6rem',
        background: 'linear-gradient(135deg, var(--color-vintage-charcoal) 0%, var(--color-vintage-coffee) 100%)'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
            <span className="cabin-tagline">Mulai Sekarang</span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-vintage-cream)',
              marginTop: '1rem',
              marginBottom: '1.5rem'
            }}>
              Rasakan Perbedaannya
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.125rem',
              color: 'var(--color-vintage-beige)',
              marginBottom: '2rem'
            }}>
              Bergabunglah dengan ribuan penikmat kopi yang telah menemukan cita rasa otentik Nusantara bersama KopiKing
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/products" className="cabin-btn cabin-btn-solid">
                <span>Belanja Sekarang</span>
              </Link>
              <Link href="/about" className="cabin-btn">
                <span>Pelajari Lebih Lanjut</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
