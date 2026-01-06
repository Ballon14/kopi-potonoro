'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    checkMobile();
    handleScroll();
    
    window.addEventListener('resize', checkMobile);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // List of paths that have a dark hero section and support transparent navbar
  const heroPages = ['/', '/about', '/products', '/cart'];
  const isHeroPage = heroPages.includes(pathname);
  const shouldBeSolid = isScrolled || !isHeroPage;

  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: shouldBeSolid ? 'var(--color-vintage-charcoal)' : 'transparent',
    backdropFilter: shouldBeSolid ? 'blur(10px)' : 'none',
    boxShadow: shouldBeSolid ? '0 4px 20px rgba(0,0,0,0.2)' : 'none',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    borderBottom: shouldBeSolid ? '1px solid rgba(201, 169, 97, 0.2)' : 'none'
  };

  const linkStyle = {
    fontFamily: 'var(--font-sans)',
    fontWeight: 400,
    fontSize: '0.8125rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--color-vintage-cream)',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    position: 'relative',
    padding: '0.5rem 0'
  };

  return (
    <nav style={navStyle}>
      <div className="container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: shouldBeSolid ? '0.75rem 0' : '1.25rem 0',
          transition: 'padding 0.3s ease'
        }}>
          {/* Logo */}
          <Link href="/" style={{textDecoration: 'none'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '2px solid var(--color-vintage-gold)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-vintage-gold)" strokeWidth="2">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                  <line x1="6" y1="1" x2="6" y2="4"/>
                  <line x1="10" y1="1" x2="10" y2="4"/>
                  <line x1="14" y1="1" x2="14" y2="4"/>
                </svg>
              </div>
              <div>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 400,
                  letterSpacing: '0.1em',
                  color: 'var(--color-vintage-cream)',
                  margin: 0,
                  textTransform: 'uppercase'
                }}>
                  KopiKing
                </h1>
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.2em',
                  color: 'var(--color-vintage-gold)',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginTop: '-2px'
                }}>
                  Since 1950
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Menu */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
              <Link 
                href="/" 
                style={linkStyle}
                onMouseEnter={(e) => e.target.style.color = 'var(--color-vintage-gold)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--color-vintage-cream)'}
              >
                Beranda
              </Link>
              <Link 
                href="/products" 
                style={linkStyle}
                onMouseEnter={(e) => e.target.style.color = 'var(--color-vintage-gold)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--color-vintage-cream)'}
              >
                Produk
              </Link>
              <Link 
                href="/about" 
                style={linkStyle}
                onMouseEnter={(e) => e.target.style.color = 'var(--color-vintage-gold)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--color-vintage-cream)'}
              >
                Tentang
              </Link>
              <Link 
                href="/cart" 
                style={{
                  ...linkStyle,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-vintage-gold)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-vintage-cream)'}
              >
                Keranjang
                {cartCount > 0 && (
                  <span style={{
                    backgroundColor: 'var(--color-vintage-gold)',
                    color: 'var(--color-vintage-coffee)',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    padding: '0.125rem 0.375rem',
                    borderRadius: '10px',
                    marginLeft: '0.25rem'
                  }}>
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Auth - Clerk */}
              <SignedOut>
                <Link 
                  href="/sign-in" 
                  style={{
                    ...linkStyle,
                    padding: '0.5rem 1.25rem',
                    border: '1px solid var(--color-vintage-gold)',
                    color: 'var(--color-vintage-gold)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--color-vintage-gold)';
                    e.target.style.color = 'var(--color-vintage-coffee)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = 'var(--color-vintage-gold)';
                  }}
                >
                  Masuk
                </Link>
              </SignedOut>
              <SignedIn>
                <Link 
                  href="/orders" 
                  style={linkStyle}
                  onMouseEnter={(e) => e.target.style.color = 'var(--color-vintage-gold)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--color-vintage-cream)'}
                >
                  Pesanan
                </Link>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: {
                        width: '36px',
                        height: '36px',
                        border: '2px solid var(--color-vintage-gold)'
                      }
                    }
                  }}
                />
              </SignedIn>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <SignedIn>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: {
                        width: '32px',
                        height: '32px',
                        border: '2px solid var(--color-vintage-gold)'
                      }
                    }
                  }}
                />
              </SignedIn>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={{
                  background: 'none',
                  border: '2px solid var(--color-vintage-gold)',
                  color: 'var(--color-vintage-gold)',
                  cursor: 'pointer',
                  padding: '0.5rem 1rem',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--color-vintage-gold)';
                  e.target.style.color = 'var(--color-vintage-coffee)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--color-vintage-gold)';
                }}
              >
                {isMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobile && isMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'var(--color-vintage-charcoal)',
            borderTop: '1px solid rgba(201, 169, 97, 0.2)',
            animation: 'fadeInDown 0.3s ease-out'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '1.5rem'
            }}>
              <Link 
                href="/" 
                style={{...linkStyle, padding: '1rem 0', borderBottom: '1px solid rgba(201, 169, 97, 0.1)'}} 
                onClick={() => setIsMenuOpen(false)}
              >
                Beranda
              </Link>
              <Link 
                href="/products" 
                style={{...linkStyle, padding: '1rem 0', borderBottom: '1px solid rgba(201, 169, 97, 0.1)'}} 
                onClick={() => setIsMenuOpen(false)}
              >
                Produk
              </Link>
              <Link 
                href="/about" 
                style={{...linkStyle, padding: '1rem 0', borderBottom: '1px solid rgba(201, 169, 97, 0.1)'}} 
                onClick={() => setIsMenuOpen(false)}
              >
                Tentang
              </Link>
              <Link 
                href="/cart" 
                style={{...linkStyle, padding: '1rem 0', borderBottom: '1px solid rgba(201, 169, 97, 0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem'}} 
                onClick={() => setIsMenuOpen(false)}
              >
                Keranjang {cartCount > 0 && `(${cartCount})`}
              </Link>
              <SignedIn>
                <Link 
                  href="/orders" 
                  style={{...linkStyle, padding: '1rem 0', borderBottom: '1px solid rgba(201, 169, 97, 0.1)'}} 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pesanan Saya
                </Link>
              </SignedIn>
              <SignedOut>
                <Link 
                  href="/sign-in" 
                  style={{
                    ...linkStyle, 
                    padding: '1rem 0',
                    color: 'var(--color-vintage-gold)'
                  }} 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Masuk / Daftar
                </Link>
              </SignedOut>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
