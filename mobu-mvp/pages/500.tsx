import Link from 'next/link';

export default function Custom500() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '6rem', marginBottom: '1rem', color: '#dc2626' }}>
        500
      </h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#374151' }}>
        Server Error
      </h2>
      <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem', textAlign: 'center' }}>
        Something went wrong on our end. We're working to fix it.
      </p>
      <Link 
        href="/" 
        style={{ 
          padding: '0.75rem 1.5rem', 
          backgroundColor: '#1e40af',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '0.5rem',
          fontSize: '1rem',
          transition: 'background-color 0.2s'
        }}
      >
        Return Home
      </Link>
    </div>
  );
}
