'use client';

import Link from 'next/link';
import { formatPrice } from '@/lib/products';
import { useCart } from '@/lib/cart';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const productId = product._id || product.id;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link 
      href={`/products/${productId}`} 
      style={{
        display: 'block',
        background: 'var(--color-surface)',
        overflow: 'hidden',
        transition: 'all 0.4s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(42, 33, 24, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Product Image */}
      <div style={{
        position: 'relative',
        aspectRatio: '1',
        overflow: 'hidden',
        background: 'var(--color-vintage-beige)'
      }}>
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transition: 'transform 0.5s ease'
            }}
          />
        ) : (
          /* Coffee Icon Placeholder */
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-vintage-brown)',
            opacity: 0.2
          }}>
            <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" fill="none" stroke="currentColor" strokeWidth="1"/>
              <line x1="6" y1="1" x2="6" y2="4" stroke="currentColor" strokeWidth="1"/>
              <line x1="10" y1="1" x2="10" y2="4" stroke="currentColor" strokeWidth="1"/>
              <line x1="14" y1="1" x2="14" y2="4" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
        )}

        {/* Hover Overlay */}
        <div 
          className="product-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(42, 33, 24, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.3s ease'
          }}
        >
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-vintage-cream)',
            border: '1px solid var(--color-vintage-cream)',
            padding: '0.5rem 1rem'
          }}>
            Lihat Detail
          </span>
        </div>
        
        {/* Featured Badge */}
        {product.featured && (
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'var(--color-vintage-gold)',
            color: 'var(--color-vintage-coffee)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.625rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '0.375rem 0.75rem',
            zIndex: 2
          }}>
            Premium
          </div>
        )}

        {/* Weight Badge */}
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          background: 'var(--color-vintage-coffee)',
          color: 'var(--color-vintage-cream)',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.625rem',
          fontWeight: 500,
          letterSpacing: '0.05em',
          padding: '0.25rem 0.5rem',
          zIndex: 2
        }}>
          {product.weight}
        </div>
      </div>

      {/* Product Info */}
      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
        {/* Category Tag */}
        <div style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.625rem',
          fontWeight: 500,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--color-vintage-gold)',
          marginBottom: '0.5rem'
        }}>
          {product.category}
        </div>

        {/* Product Name */}
        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'var(--color-vintage-coffee)',
          marginBottom: '0.5rem',
          transition: 'color 0.3s ease'
        }}>
          {product.name}
        </h3>

        {/* Origin */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          marginBottom: '0.75rem'
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-vintage-brown)" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.8125rem',
            color: 'var(--color-vintage-brown)'
          }}>
            {product.origin}
          </span>
        </div>

        {/* Tasting Notes */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.375rem',
          marginBottom: '1rem'
        }}>
          {product.tastingNotes.slice(0, 3).map((note, index) => (
            <span
              key={index}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.6875rem',
                padding: '0.25rem 0.5rem',
                background: 'var(--color-vintage-beige)',
                color: 'var(--color-vintage-dark-brown)',
                letterSpacing: '0.02em'
              }}
            >
              {note}
            </span>
          ))}
        </div>

        {/* Price and Cart Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '1rem',
          borderTop: '1px solid var(--color-border)'
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.375rem',
            fontWeight: 400,
            color: 'var(--color-vintage-gold)'
          }}>
            <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>Rp</span>
            {(product.price / 1000).toFixed(0)}K
          </div>

          <button
            onClick={handleAddToCart}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.5rem 1rem',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.6875rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              border: '1px solid var(--color-vintage-brown)',
              background: 'transparent',
              color: 'var(--color-vintage-brown)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--color-vintage-brown)';
              e.target.style.color = 'var(--color-vintage-cream)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'var(--color-vintage-brown)';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Tambah
          </button>
        </div>
      </div>

      <style jsx>{`
        a:hover .product-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </Link>
  );
}
