// app/page.tsx - SIMPLE TEST VERSION
export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f172a',
      color: 'white',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Hybrid Retail Dashboard
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
          Application is loading...
        </p>
        <a
          href="/login"
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontSize: '1.125rem'
          }}
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}