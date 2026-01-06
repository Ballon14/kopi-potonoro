'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatPrice } from '@/lib/products';

export default function ShippingCalculator({ cartWeight, onShippingSelected, customerAddress }) {
  const [detectedCity, setDetectedCity] = useState(null);
  const [courier, setCourier] = useState('jne');
  const [loading, setLoading] = useState(false);
  const [detectingCity, setDetectingCity] = useState(false);
  const [costs, setCosts] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [error, setError] = useState('');
  const [detectionStatus, setDetectionStatus] = useState('idle'); // idle, detecting, found, not_found

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Detect city from address
  const detectCity = useCallback(
    debounce(async (address) => {
      if (!address || address.length < 5) {
        setDetectedCity(null);
        setDetectionStatus('idle');
        setCosts([]);
        setSelectedService(null);
        if (onShippingSelected) onShippingSelected(0, null);
        return;
      }

      setDetectingCity(true);
      setDetectionStatus('detecting');
      setError('');

      try {
        const res = await fetch('/api/shipping/detect-city', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address })
        });
        const data = await res.json();

        if (data.success && data.detected) {
          setDetectedCity(data.city);
          setDetectionStatus('found');
          setCosts([]);
          setSelectedService(null);
          if (onShippingSelected) onShippingSelected(0, null);
        } else {
          setDetectedCity(null);
          setDetectionStatus('not_found');
          setCosts([]);
          setSelectedService(null);
          if (onShippingSelected) onShippingSelected(0, null);
        }
      } catch (error) {
        console.error('Error detecting city:', error);
        setDetectedCity(null);
        setDetectionStatus('not_found');
        setError('Gagal mendeteksi kota');
      } finally {
        setDetectingCity(false);
      }
    }, 500),
    [onShippingSelected]
  );

  // Watch for address changes
  useEffect(() => {
    if (customerAddress?.address) {
      detectCity(customerAddress.address);
    } else {
      setDetectedCity(null);
      setDetectionStatus('idle');
    }
  }, [customerAddress?.address]);

  const handleCheckOngkir = async () => {
    if (!detectedCity) return;
    setLoading(true);
    setCosts([]);
    setSelectedService(null);
    setError('');
    try {
      const res = await fetch('/api/shipping/cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: detectedCity.city_id,
          weight: cartWeight,
          courier: courier
        })
      });
      const data = await res.json();
      if (data.success && data.rajaongkir.results[0]?.costs?.length > 0) {
        setCosts(data.rajaongkir.results[0].costs);
      } else {
        setError('Tidak ada layanan pengiriman tersedia untuk rute ini');
      }
    } catch (error) {
      console.error('Error checking ongkir:', error);
      setError('Gagal menghitung ongkos kirim');
    } finally {
      setLoading(false);
    }
  };

  // Check if it's a free shipping test location
  const isFreeShippingLocation = () => {
    if (!detectedCity) return false;
    // Purworejo = gratis ongkir (lokasi toko)
    const freeShippingCities = ['PURWOREJO'];
    return freeShippingCities.some(loc => 
      detectedCity.city_name.toUpperCase().includes(loc)
    );
  };

  const handleSelectFreeShipping = () => {
    setSelectedService({ service: 'FREE', description: 'Gratis Ongkir (Area Purworejo)' });
    if (onShippingSelected) {
      onShippingSelected(0, 'Gratis Ongkir - Area Purworejo');
    }
  };

  const handleSelectService = (cost) => {
    setSelectedService(cost);
    if (onShippingSelected) {
      const courierName = courier.toUpperCase();
      const serviceName = `${courierName} ${cost.service} (${cost.cost[0].etd.replace('HARI', '').trim()} hari)`;
      onShippingSelected(cost.cost[0].value, serviceName);
    }
  };

  return (
    <div style={{
      background: 'var(--color-vintage-charcoal)',
      padding: '2rem',
      position: 'relative'
    }}>
      {/* Ornamental corners */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        width: '1.5rem',
        height: '1.5rem',
        borderTop: '1px solid var(--color-vintage-brown)',
        borderLeft: '1px solid var(--color-vintage-brown)',
        opacity: 0.5
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        right: '1rem',
        width: '1.5rem',
        height: '1.5rem',
        borderBottom: '1px solid var(--color-vintage-brown)',
        borderRight: '1px solid var(--color-vintage-brown)',
        opacity: 0.5
      }}></div>

      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.25rem',
        color: 'var(--color-vintage-cream)',
        marginBottom: '1.5rem',
        textAlign: 'center',
        letterSpacing: '0.08em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem'
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-vintage-gold)" strokeWidth="2">
          <rect x="1" y="3" width="15" height="13"/>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
        Ongkos Kirim Otomatis
      </h3>

      {/* Weight Display */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'rgba(201, 169, 97, 0.1)',
          border: '1px solid var(--color-vintage-gold)',
          color: 'var(--color-vintage-gold)',
          fontSize: '0.8rem',
          fontFamily: 'var(--font-sans)',
          letterSpacing: '0.1em'
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          Berat: {cartWeight}g
        </div>
      </div>

      {/* Detection Status */}
      <div style={{
        marginBottom: '1.5rem',
        padding: '1rem',
        background: detectionStatus === 'found' 
          ? 'rgba(34, 197, 94, 0.1)' 
          : detectionStatus === 'not_found'
          ? 'rgba(239, 68, 68, 0.1)'
          : 'rgba(139, 105, 20, 0.1)',
        border: `1px solid ${
          detectionStatus === 'found' 
            ? 'rgba(34, 197, 94, 0.5)' 
            : detectionStatus === 'not_found'
            ? 'rgba(239, 68, 68, 0.5)'
            : 'var(--color-vintage-brown)'
        }`,
        textAlign: 'center'
      }}>
        {detectionStatus === 'idle' && (
          <div style={{ color: 'var(--color-vintage-beige)', fontSize: '0.9rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Masukkan alamat lengkap untuk deteksi otomatis
          </div>
        )}
        
        {detectionStatus === 'detecting' && (
          <div style={{ color: 'var(--color-vintage-gold)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            Mendeteksi kota dari alamat...
          </div>
        )}
        
        {detectionStatus === 'found' && detectedCity && (
          <div>
            <div style={{ 
              color: 'rgba(34, 197, 94, 1)', 
              fontSize: '0.75rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Kota Terdeteksi
            </div>
            <div style={{ color: 'var(--color-vintage-cream)', fontSize: '1.1rem', fontWeight: 500 }}>
              {detectedCity.type} {detectedCity.city_name}
            </div>
            <div style={{ color: 'var(--color-vintage-beige)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              {detectedCity.province}
            </div>
          </div>
        )}
        
        {detectionStatus === 'not_found' && (
          <div style={{ color: 'rgba(239, 68, 68, 0.9)', fontSize: '0.9rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}>
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Kota tidak terdeteksi. Pastikan alamat mencantumkan nama kota/kabupaten.
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Courier Selection - Visual Cards */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-sans)',
            color: 'var(--color-vintage-gold)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: '0.75rem',
            marginLeft: '0.25rem'
          }}>
            Pilih Kurir
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {[
              { code: 'jne', name: 'JNE', color: '#d32f2f' },
              { code: 'pos', name: 'POS', color: '#e65100' },
              { code: 'tiki', name: 'TIKI', color: '#1a237e' }
            ].map(c => (
              <button
                key={c.code}
                onClick={() => {
                  setCourier(c.code);
                  setCosts([]);
                  setSelectedService(null);
                  if (onShippingSelected) {
                    onShippingSelected(0, null);
                  }
                }}
                style={{
                  padding: '0.75rem 0.5rem',
                  border: courier === c.code ? '2px solid var(--color-vintage-gold)' : '1px solid var(--color-vintage-brown)',
                  background: courier === c.code ? 'rgba(201, 169, 97, 0.1)' : 'transparent',
                  color: courier === c.code ? 'var(--color-vintage-gold)' : 'var(--color-vintage-beige)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <span style={{ fontSize: '1rem', fontWeight: 700 }}>{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        <button 
          onClick={handleCheckOngkir}
          disabled={!detectedCity || loading}
          style={{
            width: '100%',
            padding: '1rem',
            background: (!detectedCity || loading) ? 'var(--color-vintage-brown)' : 'var(--color-vintage-gold)',
            color: 'var(--color-vintage-coffee)',
            border: 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.875rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            cursor: (!detectedCity || loading) ? 'not-allowed' : 'pointer',
            opacity: (!detectedCity || loading) ? 0.5 : 1,
            transition: 'all 0.2s',
            marginTop: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          {loading ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              Menghitung...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              Cek Ongkir
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: 'rgba(160, 82, 45, 0.1)',
          border: '1px solid var(--color-vintage-rust)',
          color: 'var(--color-vintage-rust)',
          fontSize: '0.85rem',
          textAlign: 'center',
          fontFamily: 'var(--font-body)'
        }}>
          {error}
        </div>
      )}

      {/* Free Shipping Option for Test Locations */}
      {detectedCity && isFreeShippingLocation() && (
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(139, 105, 20, 0.3)'
        }}>
          <p style={{
            fontSize: '0.7rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            color: '#22c55e',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: '1rem',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            🎁 Promo Gratis Ongkir - Area Purworejo
          </p>
          
          <button 
            onClick={handleSelectFreeShipping}
            style={{
              padding: '1rem',
              border: selectedService?.service === 'FREE' 
                ? '2px solid #22c55e' 
                : '1px solid rgba(34, 197, 94, 0.3)',
              background: selectedService?.service === 'FREE' 
                ? 'rgba(34, 197, 94, 0.1)' 
                : 'rgba(34, 197, 94, 0.05)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                color: selectedService?.service === 'FREE' ? '#22c55e' : 'var(--color-vintage-cream)',
                display: 'block'
              }}>
                🎉 GRATIS ONGKIR
              </span>
              <span style={{
                fontSize: '0.75rem',
                color: 'var(--color-vintage-beige)',
                opacity: 0.7,
                fontFamily: 'var(--font-body)'
              }}>
                Khusus pengiriman ke area Purworejo dan sekitarnya
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.125rem',
                color: '#22c55e',
                display: 'block'
              }}>
                Rp 0
              </span>
              <span style={{
                fontSize: '0.7rem',
                color: 'var(--color-vintage-beige)',
                opacity: 0.5,
                fontFamily: 'var(--font-sans)'
              }}>
                Instant
              </span>
            </div>
            
            {/* Selected Indicator */}
            {selectedService?.service === 'FREE' && (
              <div style={{
                position: 'absolute',
                right: '-10px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '20px',
                height: '20px',
                background: '#22c55e',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            )}
          </button>
        </div>
      )}

      {/* Results */}
      {costs.length > 0 && (
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(139, 105, 20, 0.3)'
        }}>
          <p style={{
            fontSize: '0.7rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            color: 'var(--color-vintage-cream)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: '1rem',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-vintage-gold)" strokeWidth="2">
              <polyline points="9 11 12 14 22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            Pilih Layanan {courier.toUpperCase()}
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {costs.map((service, idx) => (
              <button 
                key={idx}
                onClick={() => handleSelectService(service)}
                style={{
                  padding: '1rem',
                  border: selectedService === service 
                    ? '2px solid var(--color-vintage-gold)' 
                    : '1px solid rgba(139, 105, 20, 0.3)',
                  background: selectedService === service 
                    ? 'rgba(201, 169, 97, 0.1)' 
                    : 'rgba(139, 105, 20, 0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  position: 'relative'
                }}
              >
                <div>
                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1rem',
                    color: selectedService === service ? 'var(--color-vintage-gold)' : 'var(--color-vintage-cream)',
                    display: 'block'
                  }}>
                    {service.service}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-vintage-beige)',
                    opacity: 0.7,
                    fontFamily: 'var(--font-body)'
                  }}>
                    {service.description}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.125rem',
                    color: 'var(--color-vintage-gold)',
                    display: 'block'
                  }}>
                    {formatPrice(service.cost[0].value)}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    color: 'var(--color-vintage-beige)',
                    opacity: 0.5,
                    fontFamily: 'var(--font-sans)'
                  }}>
                    {service.cost[0].etd.replace('HARI', '').toLowerCase().trim()} hari
                  </span>
                </div>
                
                {/* Selected Indicator */}
                {selectedService === service && (
                  <div style={{
                    position: 'absolute',
                    right: '-10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    background: 'var(--color-vintage-gold)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-vintage-coffee)" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        button:hover:not(:disabled) {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
