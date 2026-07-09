'use client';

import { useEffect, useRef, useState } from 'react';

const FEATURES = [
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="6" width="24" height="28" rx="2" />
        <line x1="14" y1="14" x2="26" y2="14" />
        <line x1="14" y1="19" x2="23" y2="19" />
        <line x1="14" y1="24" x2="20" y2="24" />
      </svg>
    ),
    title: 'Smart Billing',
    description: 'Create invoices, track payments, send receipts — all with a single tap. No complexity, just clarity.',
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="15" r="5" />
        <path d="M6 32c0-5.523 4.477-10 10-10s10 4.477 10 32" />
        <circle cx="28" cy="14" r="3.5" />
        <path d="M30 22c2.761 0 5 2.239 5 5v5" />
      </svg>
    ),
    title: 'Staff Dashboard',
    description: 'Your team at a glance. Attendance, payouts, performance — all in one calm, focused view.',
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="8" width="30" height="24" rx="2" />
        <polyline points="10 28 16 20 22 24 28 14" />
      </svg>
    ),
    title: 'Easy Management',
    description: 'Instant quotes, clean reports, real-time numbers. Spend less time managing, more time growing.',
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      style={{
        padding: '100px 40px 120px',
        fontFamily: 'var(--font-inter), system-ui, sans-serif',
      }}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Section Heading — editorial, asymmetric */}
        <div
          style={{
            marginBottom: '72px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(28px, 3.5vw, 44px)',
              fontWeight: 600,
              color: '#1a1a1a',
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              marginBottom: '20px',
            }}
          >
            Modern. Secure.
            <br />
            Efficient.
          </h2>
          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.7,
              color: '#6b6b6b',
              maxWidth: '420px',
            }}
          >
            A complete digital ledger designed for Indian shopkeepers — manage
            transactions, track payments, and stay in control from anywhere.
          </p>
        </div>

        {/* Feature Cards — clean grid, staggered 50ms reveals */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '48px',
          }}
        >
          {FEATURES.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              visible={visible}
              delay={i * 80}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  visible,
  delay,
}: {
  feature: (typeof FEATURES)[number];
  visible: boolean;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        cursor: 'default',
        padding: '8px 0',
      }}
    >
      {/* Icon */}
      <div
        style={{
          color: hovered ? '#1a1a1a' : '#888',
          marginBottom: '20px',
          transition: 'color 0.3s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
        }}
      >
        {feature.icon}
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#1a1a1a',
          marginBottom: '10px',
          letterSpacing: '-0.01em',
        }}
      >
        {feature.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: '14px',
          lineHeight: 1.65,
          color: '#888',
          transition: 'color 0.3s ease',
          ...(hovered ? { color: '#6b6b6b' } : {}),
        }}
      >
        {feature.description}
      </p>
    </div>
  );
}
