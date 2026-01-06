'use client';

import Link from 'next/link';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Daftar email yang diizinkan sebagai admin
const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];

export default function AdminLayout({ children }) {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        // Belum login, redirect ke sign-in
        router.push('/sign-in?redirect_url=/admin');
        return;
      }

      // Cek apakah email user ada di daftar admin
      const userEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase();
      const isUserAdmin = ADMIN_EMAILS.includes(userEmail);
      
      setIsAdmin(isUserAdmin);
      setChecking(false);
    }
  }, [isLoaded, user, router]);

  // Loading state
  if (!isLoaded || checking) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-vintage-cream)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid var(--color-vintage-beige)',
            borderTop: '3px solid var(--color-vintage-gold)',
            borderRadius: '50%',
            margin: '0 auto 1rem',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-vintage-brown)'
          }}>
            Memeriksa akses...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Tidak punya akses admin
  if (!isAdmin) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, var(--color-vintage-charcoal) 0%, var(--color-vintage-coffee) 100%)',
        paddingTop: '80px'
      }}>
        <div style={{
          background: 'var(--color-surface)',
          padding: '3rem',
          maxWidth: '450px',
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Ornamental corners */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            width: '30px',
            height: '30px',
            borderTop: '2px solid var(--color-vintage-rust)',
            borderLeft: '2px solid var(--color-vintage-rust)'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            width: '30px',
            height: '30px',
            borderBottom: '2px solid var(--color-vintage-rust)',
            borderRight: '2px solid var(--color-vintage-rust)'
          }}></div>

          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 1.5rem',
            border: '2px solid var(--color-vintage-rust)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-vintage-rust)" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.75rem',
            color: 'var(--color-vintage-coffee)',
            marginBottom: '1rem'
          }}>
            Akses Ditolak
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-vintage-brown)',
            marginBottom: '0.5rem'
          }}>
            Maaf, Anda tidak memiliki akses ke halaman admin.
          </p>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.875rem',
            color: 'var(--color-vintage-brown)',
            opacity: 0.7,
            marginBottom: '2rem'
          }}>
            Login sebagai: {user?.primaryEmailAddress?.emailAddress}
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link 
              href="/"
              className="cabin-btn cabin-btn-solid"
            >
              <span>Kembali ke Toko</span>
            </Link>
            <button
              onClick={() => signOut()}
              className="cabin-btn"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Punya akses admin
  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh'
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: 'var(--color-vintage-charcoal)',
        padding: '2rem 0',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        overflowY: 'auto'
      }}>
        <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-vintage-gold)',
            marginBottom: '0.5rem'
          }}>
            Admin Panel
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.875rem',
            color: 'var(--color-vintage-beige)'
          }}>
            Halo, {user?.firstName || 'Admin'}
          </p>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.6875rem',
            color: 'var(--color-vintage-gold)',
            marginTop: '0.25rem'
          }}>
            ✓ Admin Access
          </p>
        </div>

        <nav>
          <Link 
            href="/admin"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.875rem 1.5rem',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.875rem',
              color: 'var(--color-vintage-cream)',
              textDecoration: 'none',
              transition: 'all 0.2s',
              borderLeft: '3px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(201, 169, 97, 0.1)';
              e.target.style.borderLeftColor = 'var(--color-vintage-gold)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderLeftColor = 'transparent';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </Link>
          <Link 
            href="/admin/products"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.875rem 1.5rem',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.875rem',
              color: 'var(--color-vintage-cream)',
              textDecoration: 'none',
              transition: 'all 0.2s',
              borderLeft: '3px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(201, 169, 97, 0.1)';
              e.target.style.borderLeftColor = 'var(--color-vintage-gold)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderLeftColor = 'transparent';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
            </svg>
            Produk
          </Link>
          <Link 
            href="/admin/orders"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.875rem 1.5rem',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.875rem',
              color: 'var(--color-vintage-cream)',
              textDecoration: 'none',
              transition: 'all 0.2s',
              borderLeft: '3px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(201, 169, 97, 0.1)';
              e.target.style.borderLeftColor = 'var(--color-vintage-gold)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderLeftColor = 'transparent';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            Pesanan
          </Link>
          <Link 
            href="/admin/chats"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.875rem 1.5rem',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.875rem',
              color: 'var(--color-vintage-cream)',
              textDecoration: 'none',
              transition: 'all 0.2s',
              borderLeft: '3px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(201, 169, 97, 0.1)';
              e.target.style.borderLeftColor = 'var(--color-vintage-gold)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderLeftColor = 'transparent';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Chat Support
          </Link>
          <Link 
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.875rem 1.5rem',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.875rem',
              color: 'var(--color-vintage-beige)',
              textDecoration: 'none',
              transition: 'all 0.2s',
              borderLeft: '3px solid transparent',
              marginTop: '2rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(201, 169, 97, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Kembali ke Toko
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        marginLeft: '260px',
        padding: '2rem',
        background: 'var(--color-vintage-cream)',
        minHeight: '100vh'
      }}>
        {children}
      </main>
    </div>
  );
}
