'use client';

import Link from 'next/link';

export default function AboutPage() {
  const skills = [
    { name: 'Seleksi Biji Kopi', percent: 95, icon: '🌱' },
    { name: 'Proses Roasting', percent: 90, icon: '🔥' },
    { name: 'Quality Control', percent: 98, icon: '✓' },
    { name: 'Packaging', percent: 92, icon: '📦' }
  ];

  const timeline = [
    { 
      year: '1950', 
      title: 'Awal Mula', 
      desc: 'Pondok Kopi Potorono didirikan sebagai kedai kopi kecil di Jakarta dengan visi menghadirkan kopi Nusantara terbaik.',
      icon: '☕'
    },
    { 
      year: '1975', 
      title: 'Ekspansi Petani', 
      desc: 'Membangun jaringan kemitraan langsung dengan petani kopi di Sumatera, Jawa, dan Sulawesi.',
      icon: '🤝'
    },
    { 
      year: '1990', 
      title: 'Modernisasi', 
      desc: 'Investasi dalam fasilitas roasting modern pertama dengan teknologi terkini dari Jerman.',
      icon: '⚙️'
    },
    { 
      year: '2010', 
      title: 'Sertifikasi', 
      desc: 'Memperoleh sertifikasi ISO dan Fair Trade untuk menjamin kualitas dan keberlanjutan.',
      icon: '🏆'
    },
    { 
      year: '2020', 
      title: 'Era Digital', 
      desc: 'Meluncurkan platform e-commerce untuk menjangkau lebih banyak pecinta kopi di seluruh Indonesia.',
      icon: '🚀'
    }
  ];

  const stats = [
    { number: '70+', label: 'Tahun Pengalaman', suffix: '' },
    { number: '200+', label: 'Petani Mitra', suffix: '' },
    { number: '50+', label: 'Varietas Kopi', suffix: '' },
    { number: '15K+', label: 'Pelanggan Setia', suffix: '' }
  ];

  const values = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      ),
      title: 'Kualitas Premium',
      desc: 'Setiap biji kopi melewati proses seleksi ketat dengan standar internasional untuk memastikan cita rasa terbaik.'
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      ),
      title: 'Tradisi & Inovasi',
      desc: 'Menghormati warisan kopi Nusantara sejak 1950 sambil terus berinovasi dalam teknik pengolahan modern.'
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
      title: 'Pemberdayaan Petani',
      desc: 'Kemitraan langsung dengan 200+ petani lokal, memastikan harga adil dan meningkatkan kesejahteraan komunitas.'
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      ),
      title: 'Keberlanjutan',
      desc: 'Komitmen pada praktik pertanian berkelanjutan dan kemasan ramah lingkungan untuk masa depan yang lebih baik.'
    }
  ];

  const origins = [
    { 
      region: 'Aceh Gayo', 
      coffee: 'Arabica Gayo Premium', 
      altitude: '1,200 - 1,700 mdpl',
      note: 'Keasaman cerah dengan body penuh, aroma rempah dan cokelat',
      color: '#8B4513'
    },
    { 
      region: 'Sumatera Utara', 
      coffee: 'Mandailing Gold', 
      altitude: '1,000 - 1,500 mdpl',
      note: 'Karakter earthy yang khas dengan finish herbal yang panjang',
      color: '#654321'
    },
    { 
      region: 'Jawa Barat', 
      coffee: 'Java Preanger', 
      altitude: '1,400 - 1,800 mdpl',
      note: 'Klasik dengan nuansa cokelat, caramel, dan sedikit fruity',
      color: '#5D4037'
    },
    { 
      region: 'Bali Kintamani', 
      coffee: 'Kintamani Organic', 
      altitude: '900 - 1,200 mdpl',
      note: 'Organik dengan aroma floral, citrus, dan sweetness alami',
      color: '#6D4C41'
    },
    { 
      region: 'Sulawesi Toraja', 
      coffee: 'Toraja Sapan', 
      altitude: '1,400 - 1,900 mdpl',
      note: 'Premium dengan body tebal, low acidity, dan smoky undertone',
      color: '#4E342E'
    },
    { 
      region: 'Lampung', 
      coffee: 'Robusta Lampung', 
      altitude: '400 - 800 mdpl',
      note: 'Body tebal dengan crema sempurna, ideal untuk espresso blend',
      color: '#3E2723'
    }
  ];

  return (
    <div>
      {/* ========== HERO SECTION ========== */}
      <section style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, var(--color-vintage-charcoal) 0%, var(--color-vintage-coffee) 100%)',
        position: 'relative',
        paddingTop: '6rem',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a961' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.5
        }}></div>

        {/* Floating Coffee Beans Animation */}
        <div style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none'
        }}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                width: '60px',
                height: '60px',
                opacity: 0.1,
                animation: `float ${4 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`
              }}
            >
              <svg viewBox="0 0 24 24" fill="var(--color-vintage-gold)">
                <ellipse cx="12" cy="12" rx="8" ry="10"/>
                <path d="M12 2c0 0-4 4-4 10s4 10 4 10" fill="none" stroke="var(--color-vintage-charcoal)" strokeWidth="1"/>
              </svg>
            </div>
          ))}
        </div>
        
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '2rem', maxWidth: '900px' }}>
          <span className="cabin-tagline">Sejak 1950</span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 7vw, 5.5rem)',
            fontWeight: 400,
            letterSpacing: '0.08em',
            color: 'var(--color-vintage-cream)',
            marginTop: '1rem',
            marginBottom: '1.5rem',
            lineHeight: 1.1
          }}>
            Tentang Pondok Kopi Potorono
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 2vw, 1.375rem)',
            color: 'var(--color-vintage-beige)',
            maxWidth: '700px',
            margin: '0 auto',
            fontStyle: 'italic',
            lineHeight: 1.8
          }}>
            Lebih dari tujuh dekade menghadirkan cita rasa kopi Nusantara terbaik.
            Sebuah perjalanan panjang yang dimulai dari sebuah impian sederhana.
          </p>
          <div className="cabin-ornament" style={{ marginTop: '2.5rem' }}>
            <div className="cabin-ornament-line"></div>
            <div className="cabin-ornament-diamond"></div>
            <div className="cabin-ornament-line"></div>
          </div>

          {/* Scroll hint */}
          <div style={{ marginTop: '3rem', opacity: 0.6 }}>
            <svg width="24" height="40" viewBox="0 0 24 40" fill="none" stroke="var(--color-vintage-gold)" strokeWidth="1.5">
              <rect x="4" y="1" width="16" height="26" rx="8"/>
              <circle cx="12" cy="10" r="2" fill="var(--color-vintage-gold)">
                <animate attributeName="cy" values="10;16;10" dur="1.5s" repeatCount="indefinite"/>
              </circle>
              <path d="M8 32l4 4 4-4" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </section>

      {/* ========== STATS SECTION ========== */}
      <section style={{
        background: 'var(--color-vintage-charcoal)',
        borderTop: '1px solid rgba(201, 169, 97, 0.2)',
        borderBottom: '1px solid rgba(201, 169, 97, 0.2)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            padding: '4rem 0'
          }}>
            {stats.map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  color: 'var(--color-vintage-gold)',
                  lineHeight: 1
                }}>
                  {stat.number}
                </div>
                <div style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--color-vintage-cream)',
                  marginTop: '0.75rem',
                  opacity: 0.8
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== STORY SECTION ========== */}
      <section className="cabin-section" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '4rem',
            alignItems: 'center'
          }}>
            <div style={{ gridColumn: 'span 12' }} className="lg-col-7">
              <span className="cabin-tagline" style={{ marginBottom: '1rem', display: 'inline-block' }}>
                Warisan Kami
              </span>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: 'var(--color-vintage-coffee)',
                marginBottom: '2rem',
                lineHeight: 1.2
              }}>
                Cerita Di Balik <br/>Setiap Cangkir
              </h2>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.0625rem',
                lineHeight: 1.9,
                color: 'var(--color-vintage-dark-brown)'
              }}>
                <p style={{ marginBottom: '1.5rem' }}>
                  <span style={{ 
                    fontFamily: 'var(--font-display)', 
                    fontSize: '4rem', 
                    float: 'left', 
                    lineHeight: 0.8, 
                    marginRight: '0.5rem',
                    color: 'var(--color-vintage-gold)'
                  }}>K</span>
                  opi Potorono lahir pada tahun 1950 dari sebuah impian sederhana — menghadirkan kopi Nusantara 
                  berkualitas tinggi kepada setiap penikmat kopi. Berawal dari kedai kecil di sudut kota Jakarta, 
                  kami telah tumbuh menjadi salah satu penyedia kopi premium terpercaya di Indonesia.
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                  Selama lebih dari tujuh dekade, kami telah menjalin hubungan erat dengan para petani kopi 
                  di berbagai penjuru Nusantara — dari dataran tinggi Gayo di Aceh, lereng vulkanik Kintamani 
                  di Bali, hingga pegunungan Toraja di Sulawesi. Setiap hubungan dibangun atas dasar 
                  kepercayaan dan komitmen bersama terhadap kualitas.
                </p>
                <p>
                  Hari ini, misi kami tetap sama: membawa cerita dan cita rasa unik dari setiap daerah 
                  penghasil kopi Indonesia langsung ke cangkir Anda. Karena kami percaya, setiap biji kopi 
                  menyimpan cerita yang layak untuk dinikmati.
                </p>
              </div>

              {/* Mission & Vision */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1.5rem',
                marginTop: '2.5rem'
              }}>
                <div style={{
                  padding: '1.5rem',
                  background: 'var(--color-vintage-beige)',
                  borderLeft: '4px solid var(--color-vintage-gold)'
                }}>
                  <h4 style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--color-vintage-gold)',
                    marginBottom: '0.5rem'
                  }}>Misi</h4>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    color: 'var(--color-vintage-dark-brown)',
                    lineHeight: 1.6,
                    margin: 0
                  }}>
                    Menghadirkan kopi berkualitas tinggi sambil memberdayakan komunitas petani lokal.
                  </p>
                </div>
                <div style={{
                  padding: '1.5rem',
                  background: 'var(--color-vintage-beige)',
                  borderLeft: '4px solid var(--color-vintage-gold)'
                }}>
                  <h4 style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--color-vintage-gold)',
                    marginBottom: '0.5rem'
                  }}>Visi</h4>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    color: 'var(--color-vintage-dark-brown)',
                    lineHeight: 1.6,
                    margin: 0
                  }}>
                    Menjadi destinasi utama bagi pecinta kopi Nusantara di seluruh dunia.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ gridColumn: 'span 12' }} className="lg-col-5">
              <div style={{
                background: 'var(--color-vintage-charcoal)',
                padding: '3rem',
                position: 'relative',
                minHeight: '500px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Ornamental corners */}
                <div style={{
                  position: 'absolute',
                  top: '1.5rem',
                  left: '1.5rem',
                  width: '60px',
                  height: '60px',
                  borderTop: '2px solid var(--color-vintage-gold)',
                  borderLeft: '2px solid var(--color-vintage-gold)'
                }}></div>
                <div style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  right: '1.5rem',
                  width: '60px',
                  height: '60px',
                  borderBottom: '2px solid var(--color-vintage-gold)',
                  borderRight: '2px solid var(--color-vintage-gold)'
                }}></div>
                
                <div style={{ textAlign: 'center', color: 'var(--color-vintage-gold)' }}>
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                    <line x1="6" y1="1" x2="6" y2="4"/>
                    <line x1="10" y1="1" x2="10" y2="4"/>
                    <line x1="14" y1="1" x2="14" y2="4"/>
                  </svg>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '4rem',
                    marginTop: '1.5rem',
                    letterSpacing: '0.05em',
                    lineHeight: 1
                  }}>
                    1950
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    marginTop: '0.5rem',
                    opacity: 0.7
                  }}>
                    Established
                  </div>
                  
                  {/* Quote */}
                  <div style={{
                    marginTop: '3rem',
                    padding: '0 1rem'
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontStyle: 'italic',
                      fontSize: '1rem',
                      color: 'var(--color-vintage-beige)',
                      lineHeight: 1.7
                    }}>
                      "Kami tidak hanya menjual kopi, kami berbagi cerita dan tradisi dari setiap penjuru Nusantara."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TIMELINE SECTION ========== */}
      <section className="cabin-section cabin-section-beige" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="cabin-tagline">Perjalanan</span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--color-vintage-coffee)',
              marginTop: '1rem'
            }}>
              Tonggak Sejarah Kami
            </h2>
          </div>

          {/* Timeline */}
          <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto' }}>
            {/* Central line */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '2px',
              background: 'linear-gradient(to bottom, var(--color-vintage-gold), var(--color-vintage-brown))',
              transform: 'translateX(-50%)'
            }} className="timeline-line"></div>

            {timeline.map((item, index) => (
              <div 
                key={index} 
                style={{
                  display: 'flex',
                  justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
                  paddingBottom: index === timeline.length - 1 ? 0 : '3rem',
                  position: 'relative'
                }}
                className="timeline-item"
              >
                {/* Center dot */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: '1.5rem',
                  width: '50px',
                  height: '50px',
                  background: 'var(--color-vintage-gold)',
                  borderRadius: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  zIndex: 2,
                  boxShadow: '0 4px 15px rgba(201, 169, 97, 0.4)'
                }} className="timeline-dot">
                  {item.icon}
                </div>

                {/* Content card */}
                <div style={{
                  width: 'calc(50% - 60px)',
                  padding: '2rem',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  position: 'relative'
                }} className="timeline-card">
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(to right, var(--color-vintage-brown), var(--color-vintage-gold), var(--color-vintage-brown))'
                  }}></div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.5rem',
                    color: 'var(--color-vintage-gold)',
                    marginBottom: '0.5rem',
                    lineHeight: 1
                  }}>
                    {item.year}
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    color: 'var(--color-vintage-coffee)',
                    marginBottom: '0.75rem'
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    color: 'var(--color-vintage-dark-brown)',
                    lineHeight: 1.7,
                    margin: 0
                  }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== VALUES SECTION ========== */}
      <section className="cabin-section" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="cabin-tagline">Prinsip</span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--color-vintage-coffee)',
              marginTop: '1rem'
            }}>
              Nilai-Nilai Kami
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.125rem',
              color: 'var(--color-vintage-dark-brown)',
              maxWidth: '600px',
              margin: '1rem auto 0'
            }}>
              Prinsip yang kami pegang teguh dalam setiap langkah perjalanan kami
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {values.map((value, index) => (
              <div 
                key={index} 
                className="cabin-service-card"
                style={{
                  textAlign: 'center',
                  padding: '3rem 2rem',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  transition: 'all 0.4s ease',
                  position: 'relative'
                }}
              >
                <div className="cabin-service-icon" style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 1.5rem',
                  border: '2px solid var(--color-vintage-gold)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-vintage-gold)',
                  transition: 'all 0.3s ease'
                }}>
                  {value.icon}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  color: 'var(--color-vintage-coffee)',
                  marginBottom: '1rem'
                }}>
                  {value.title}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'var(--color-vintage-dark-brown)',
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== EXPERTISE SECTION ========== */}
      <section className="cabin-section cabin-section-dark" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '4rem',
            alignItems: 'center'
          }}>
            <div style={{ gridColumn: 'span 12' }} className="lg-col-5">
              <span className="cabin-tagline">Keahlian</span>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: 'var(--color-vintage-cream)',
                marginTop: '1rem',
                marginBottom: '1.5rem'
              }}>
                Expertise Kami
              </h2>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.0625rem',
                color: 'var(--color-vintage-beige)',
                lineHeight: 1.8,
                marginBottom: '2rem'
              }}>
                Dengan pengalaman lebih dari 70 tahun, kami telah menyempurnakan setiap aspek 
                dalam menghadirkan kopi berkualitas tinggi — dari seleksi biji, proses roasting, 
                hingga pengemasan yang menjaga kesegaran.
              </p>
              <Link href="/products" className="cabin-btn cabin-btn-solid">
                <span>Lihat Produk Kami</span>
              </Link>
            </div>

            <div style={{ gridColumn: 'span 12' }} className="lg-col-7">
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '2.5rem',
                border: '1px solid rgba(201, 169, 97, 0.2)'
              }}>
                {skills.map((skill, index) => (
                  <div key={index} style={{ marginBottom: index === skills.length - 1 ? 0 : '2rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem'
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--color-vintage-cream)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span>{skill.icon}</span>
                        {skill.name}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.25rem',
                        color: 'var(--color-vintage-gold)'
                      }}>
                        {skill.percent}%
                      </span>
                    </div>
                    <div style={{
                      height: '8px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${skill.percent}%`,
                        background: 'linear-gradient(to right, var(--color-vintage-brown), var(--color-vintage-gold))',
                        borderRadius: '4px',
                        transition: 'width 1.5s ease-out'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== ORIGINS SECTION ========== */}
      <section className="cabin-section cabin-section-beige" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="cabin-tagline">Asal Usul</span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--color-vintage-coffee)',
              marginTop: '1rem'
            }}>
              Dari Sabang Sampai Merauke
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.125rem',
              color: 'var(--color-vintage-dark-brown)',
              maxWidth: '600px',
              margin: '1rem auto 0'
            }}>
              Koleksi kopi kami berasal dari daerah-daerah penghasil kopi terbaik di Indonesia
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {origins.map((origin, index) => (
              <div 
                key={index} 
                style={{
                  padding: '2rem',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.25rem',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Color accent */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  background: origin.color
                }}></div>
                
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'var(--color-vintage-charcoal)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-vintage-gold)" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    color: 'var(--color-vintage-coffee)',
                    marginBottom: '0.25rem'
                  }}>
                    {origin.region}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.75rem',
                    color: 'var(--color-vintage-gold)',
                    marginBottom: '0.25rem',
                    letterSpacing: '0.05em',
                    fontWeight: 600
                  }}>
                    {origin.coffee}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.7rem',
                    color: 'var(--color-vintage-brown)',
                    marginBottom: '0.75rem',
                    letterSpacing: '0.05em'
                  }}>
                    📍 {origin.altitude}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    color: 'var(--color-vintage-dark-brown)',
                    lineHeight: 1.6,
                    margin: 0
                  }}>
                    {origin.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="cabin-section cabin-section-dark" style={{ 
        paddingTop: '6rem', 
        paddingBottom: '6rem',
        background: 'linear-gradient(135deg, var(--color-vintage-charcoal) 0%, var(--color-vintage-coffee) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a961' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <span className="cabin-tagline">Bergabung Bersama Kami</span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: 'var(--color-vintage-cream)',
              marginTop: '1rem',
              marginBottom: '1.5rem'
            }}>
              Mulai Perjalanan Kopi Anda
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.125rem',
              color: 'var(--color-vintage-beige)',
              marginBottom: '2.5rem',
              lineHeight: 1.8
            }}>
              Nikmati kopi premium Indonesia yang dipilih dengan cermat dan diroasting dengan penuh dedikasi. 
              Setiap pembelian Anda membantu mendukung petani lokal di seluruh Nusantara.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/products" className="cabin-btn cabin-btn-solid">
                <span>Jelajahi Produk Kami</span>
              </Link>
              <a href="mailto:info@kopiking.id" className="cabin-btn">
                <span>Hubungi Kami</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CSS for animations and responsive */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @media (min-width: 1024px) {
          .lg-col-5 {
            grid-column: span 5 !important;
          }
          .lg-col-7 {
            grid-column: span 7 !important;
          }
        }
        @media (max-width: 768px) {
          .timeline-line {
            left: 25px !important;
          }
          .timeline-item {
            justify-content: flex-end !important;
            padding-left: 60px !important;
          }
          .timeline-dot {
            left: 25px !important;
          }
          .timeline-card {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
