import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div>
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, var(--color-vintage-charcoal) 0%, var(--color-vintage-coffee) 100%)',
        position: 'relative',
        paddingTop: '4rem',
        paddingBottom: '4rem'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a961' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.5
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              margin: '0 auto 1rem',
              border: '2px solid var(--color-vintage-gold)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-vintage-gold)" strokeWidth="2">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                <line x1="6" y1="1" x2="6" y2="4"/>
                <line x1="10" y1="1" x2="10" y2="4"/>
                <line x1="14" y1="1" x2="14" y2="4"/>
              </svg>
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              fontWeight: 400,
              letterSpacing: '0.1em',
              color: 'var(--color-vintage-cream)',
              margin: 0,
              textTransform: 'uppercase'
            }}>
              KopiKing
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              color: 'var(--color-vintage-beige)',
              marginTop: '0.5rem'
            }}>
              Bergabunglah dengan komunitas pecinta kopi
            </p>
          </div>
          <SignUp />
        </div>
      </section>
    </div>
  );
}
