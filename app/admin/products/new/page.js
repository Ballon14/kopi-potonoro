'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Arabica',
    origin: '',
    weight: '250g',
    roast: 'Medium',
    tastingNotes: '',
    featured: false,
    stock: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Tipe file tidak valid! Gunakan JPG, PNG, WebP, atau GIF.');
        return;
      }

      if (file.size > 5000000) { // Limit to 5MB
        alert('Ukuran gambar terlalu besar! Maksimal 5MB.');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      // Append all text fields
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      
      // Append file if exists
      if (imageFile) {
        data.append('image', imageFile);
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        body: data // Send FormData directly
      });

      const result = await res.json();
      
      if (result.success) {
        alert('Produk berhasil ditambahkan!');
        router.push('/admin/products');
      } else {
        alert(result.error || 'Gagal menambahkan produk');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.875rem 1rem',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9375rem',
    border: '2px solid var(--color-border)',
    background: 'white',
    color: 'var(--color-vintage-coffee)',
    outline: 'none',
    transition: 'border-color 0.3s'
  };

  const labelStyle = {
    display: 'block',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',
    fontWeight: 500,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--color-vintage-coffee)',
    marginBottom: '0.5rem'
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link 
          href="/admin/products"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.875rem',
            color: 'var(--color-vintage-brown)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Kembali ke Daftar Produk
        </Link>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          fontWeight: 400,
          color: 'var(--color-vintage-coffee)'
        }}>
          Tambah Produk Baru
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{
        background: 'white',
        padding: '2rem',
        border: '1px solid var(--color-border)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          {/* Image Upload */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>Foto Produk</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                border: '2px dashed var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-vintage-beige)',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {preview ? (
                  <img 
                    src={preview} 
                    alt="Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <span style={{ color: 'var(--color-vintage-brown)', fontSize: '0.75rem' }}>No Image</span>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.875rem',
                    color: 'var(--color-vintage-brown)'
                  }}
                />
                <p style={{
                  marginTop: '0.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--color-vintage-rust)'
                }}>
                  * Format: JPG, PNG, WebP, GIF. Maksimal 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>Nama Produk *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Contoh: Kopi Gayo Premium"
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-vintage-gold)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            />
          </div>

          {/* Description */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>Deskripsi *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Deskripsikan produk kopi Anda..."
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-vintage-gold)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            />
          </div>

          {/* Price & Stock */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', gridColumn: 'span 2' }}>
            <div>
              <label style={labelStyle}>Harga (Rp) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                placeholder="Contoh: 85000"
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-vintage-gold)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>
            <div>
              <label style={labelStyle}>Stok Produk *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                placeholder="0"
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-vintage-gold)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Kategori *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="Arabica">Arabica</option>
              <option value="Robusta">Robusta</option>
              <option value="Blend">Blend</option>
            </select>
          </div>

          {/* Origin */}
          <div>
            <label style={labelStyle}>Asal Daerah *</label>
            <input
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              required
              placeholder="Contoh: Aceh Gayo"
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-vintage-gold)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            />
          </div>

          {/* Weight */}
          <div>
            <label style={labelStyle}>Berat</label>
            <select
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="100g">100g</option>
              <option value="200g">200g</option>
              <option value="250g">250g</option>
              <option value="500g">500g</option>
              <option value="1kg">1kg</option>
            </select>
          </div>

          {/* Roast Level */}
          <div>
            <label style={labelStyle}>Tingkat Roasting</label>
            <select
              name="roast"
              value={formData.roast}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Light">Light</option>
              <option value="Light-Medium">Light-Medium</option>
              <option value="Medium">Medium</option>
              <option value="Medium-Dark">Medium-Dark</option>
              <option value="Dark">Dark</option>
            </select>
          </div>

          {/* Tasting Notes */}
          <div>
            <label style={labelStyle}>Tasting Notes</label>
            <input
              type="text"
              name="tastingNotes"
              value={formData.tastingNotes}
              onChange={handleChange}
              placeholder="Pisahkan dengan koma: Cokelat, Karamel, Buah"
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-vintage-gold)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            />
          </div>

          {/* Featured */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                style={{
                  width: '20px',
                  height: '20px',
                  accentColor: 'var(--color-vintage-gold)'
                }}
              />
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9375rem',
                color: 'var(--color-vintage-coffee)'
              }}>
                Tampilkan sebagai Produk Featured
              </span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Link 
            href="/admin/products"
            className="cabin-btn"
          >
            <span>Batal</span>
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="cabin-btn cabin-btn-solid"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            <span>{loading ? 'Menyimpan...' : 'Simpan Produk'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
