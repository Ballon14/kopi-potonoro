'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: 'var(--color-vintage-charcoal)',
      color: 'var(--color-vintage-cream)',
      position: 'relative'
    }}>
      {/* Decorative Top Border */}
      <div style={{
        height: '4px',
        background: 'linear-gradient(to right, var(--color-vintage-brown), var(--color-vintage-gold), var(--color-vintage-brown))'
      }}></div>

      <div className="container" style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '3rem',
          marginBottom: '4rem'
        }}>
          {/* Brand Section */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                border: '2px solid var(--color-vintage-gold)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-vintage-gold)" strokeWidth="2">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                  <line x1="6" y1="1" x2="6" y2="4"/>
                  <line x1="10" y1="1" x2="10" y2="4"/>
                  <line x1="14" y1="1" x2="14" y2="4"/>
                </svg>
              </div>
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 400,
                  letterSpacing: '0.1em',
                  color: 'var(--color-vintage-cream)',
                  margin: 0,
                  textTransform: 'uppercase'
                }}>
                  Pondok Kopi Potorono
                </h3>
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.2em',
                  color: 'var(--color-vintage-gold)',
                  textTransform: 'uppercase'
                }}>
                  Since 1950
                </span>
              </div>
            </div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              lineHeight: 1.8,
              color: 'var(--color-vintage-beige)',
              marginBottom: '1.5rem'
            }}>
              Menghadirkan cita rasa kopi Nusantara terbaik dari berbagai penjuru Indonesia. 
              Setiap biji kopi dipilih dengan cermat untuk memberikan pengalaman yang tak terlupakan.
            </p>
            
            {/* Social Links */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              {['instagram', 'facebook', 'whatsapp'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid rgba(201, 169, 97, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-vintage-cream)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--color-vintage-gold)';
                    e.target.style.color = 'var(--color-vintage-coffee)';
                    e.target.style.borderColor = 'var(--color-vintage-gold)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = 'var(--color-vintage-cream)';
                    e.target.style.borderColor = 'rgba(201, 169, 97, 0.3)';
                  }}
                  aria-label={social}
                >
                  {social === 'instagram' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="18" cy="6" r="1" fill="currentColor"/>
                    </svg>
                  )}
                  {social === 'facebook' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  )}
                  {social === 'whatsapp' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-vintage-gold)',
              marginBottom: '1.5rem'
            }}>
              Navigasi
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { href: '/', label: 'Beranda' },
                { href: '/products', label: 'Produk' },
                { href: '/about', label: 'Tentang Kami' },
                { href: '/cart', label: 'Keranjang' }
              ].map((link) => (
                <li key={link.href} style={{ marginBottom: '0.75rem' }}>
                  <Link 
                    href={link.href}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9375rem',
                      color: 'var(--color-vintage-beige)',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--color-vintage-gold)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--color-vintage-beige)'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-vintage-gold)',
              marginBottom: '1.5rem'
            }}>
              Kontak
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '0.75rem',
                marginBottom: '1rem' 
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-vintage-gold)" strokeWidth="2" style={{ flexShrink: 0, marginTop: '0.125rem' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-vintage-beige)', fontSize: '0.9375rem' }}>
                  Jl. Kaliabu - Kajoran, Sambak,<br/>Kec. Kajoran, Kabupaten Magelang,<br/>Jawa Tengah 56163
                </span>
              </li>
              <li style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                marginBottom: '1rem' 
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-vintage-gold)" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-vintage-beige)', fontSize: '0.9375rem' }}>
                  0857-7772-9305
                </span>
              </li>
              <li style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem' 
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-vintage-gold)" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-vintage-beige)', fontSize: '0.9375rem' }}>
                  info@kopiking.id
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-vintage-gold)',
              marginBottom: '1.5rem'
            }}>
              Newsletter
            </h4>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              color: 'var(--color-vintage-beige)',
              marginBottom: '1rem'
            }}>
              Dapatkan info terbaru tentang produk dan promo spesial.
            </p>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input 
                type="email" 
                placeholder="Email Anda"
                style={{
                  padding: '0.875rem 1rem',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.875rem',
                  border: '1px solid rgba(201, 169, 97, 0.3)',
                  background: 'transparent',
                  color: 'var(--color-vintage-cream)',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
              />
              <button 
                type="submit"
                style={{
                  padding: '0.875rem 1.5rem',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  border: '2px solid var(--color-vintage-gold)',
                  background: 'var(--color-vintage-gold)',
                  color: 'var(--color-vintage-coffee)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'var(--color-vintage-gold)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--color-vintage-gold)';
                  e.target.style.color = 'var(--color-vintage-coffee)';
                }}
              >
                Berlangganan
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(201, 169, 97, 0.3), transparent)',
          marginBottom: '2rem'
        }}></div>

        {/* Bottom Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.8125rem',
            color: 'rgba(248, 244, 237, 0.5)',
            margin: 0
          }}>
            © {currentYear} Pondok Kopi Potorono. Warisan Cita Rasa Nusantara. All rights reserved.
          </p>
          <div style={{
            display: 'flex',
            gap: '1.5rem'
          }}>
            <a href="#" style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8125rem',
              color: 'rgba(248, 244, 237, 0.5)',
              textDecoration: 'none',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--color-vintage-gold)'}
            onMouseLeave={(e) => e.target.style.color = 'rgba(248, 244, 237, 0.5)'}
            >
              Privacy Policy
            </a>
            <a href="#" style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8125rem',
              color: 'rgba(248, 244, 237, 0.5)',
              textDecoration: 'none',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--color-vintage-gold)'}
            onMouseLeave={(e) => e.target.style.color = 'rgba(248, 244, 237, 0.5)'}
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
