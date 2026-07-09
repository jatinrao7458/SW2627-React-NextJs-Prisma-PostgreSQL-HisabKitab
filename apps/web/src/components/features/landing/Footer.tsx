'use client';

export default function Footer() {
  return (
    <footer
      style={{
        padding: '48px 40px',
        fontFamily: 'var(--font-inter), system-ui, sans-serif',
        borderTop: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <p style={{ fontSize: '13px', color: '#999', fontWeight: 400 }}>
          © {new Date().getFullYear()} Hisab Kitab
        </p>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['Privacy', 'Terms', 'Contact'].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              style={{
                fontSize: '13px',
                color: '#999',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#1a1a1a'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#999'; }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
