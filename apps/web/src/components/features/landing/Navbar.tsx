'use client';

import { useState } from 'react';

interface NavbarProps {
  visible: boolean;
}

const NAV_LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
];

export default function Navbar({ visible }: NavbarProps) {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-12px)',
        transition: 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 40px',
          fontFamily: 'var(--font-inter), system-ui, sans-serif',
        }}
      >
        {/* Logo — serif, warm */}
        <a
          href="/"
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: '18px',
            fontWeight: 600,
            color: '#2a2a2a',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          Hisab Kitab
        </a>

        {/* Nav Links — minimal, quiet hover */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onMouseEnter={() => setHoveredLink(link.label)}
              onMouseLeave={() => setHoveredLink(null)}
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: hoveredLink === link.label ? '#1a1a1a' : '#6b6b6b',
                textDecoration: 'none',
                transition: 'color 0.25s ease',
                letterSpacing: '0.01em',
              }}
            >
              {link.label}
            </a>
          ))}

          {/* CTA — subtle dark pill */}
          <a
            href="#get-started"
            style={{
              marginLeft: '8px',
              padding: '10px 22px',
              borderRadius: '100px',
              fontSize: '13px',
              fontWeight: 600,
              background: '#1a1a1a',
              color: '#f5f0e6',
              textDecoration: 'none',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.04)';
              e.currentTarget.style.opacity = '0.88';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.opacity = '1';
            }}
          >
            Get started
          </a>
        </div>
      </div>
    </nav>
  );
}
