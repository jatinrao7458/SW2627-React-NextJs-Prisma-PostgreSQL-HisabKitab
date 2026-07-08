'use client';

interface HeroOverlayProps {
  progress: number; // 0-1 from ScrollAnimation
}

export default function HeroOverlay({ progress }: HeroOverlayProps) {
  // Text becomes visible when ink background is dark enough (~25% progress)
  const textVisible = progress > 0.2;
  // Staggered delays for each element
  const fadeBase = textVisible ? 1 : 0;

  // Fade out text near the end of animation (~85%)
  const fadeOut = progress > 0.85 ? Math.max(0, 1 - (progress - 0.85) / 0.15) : 1;
  const opacity = fadeBase * fadeOut;

  return (
    <div
      className="fixed inset-0 z-10 pointer-events-none flex items-center"
      style={{ opacity }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="max-w-xl pointer-events-auto">
          {/* Main Heading */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
            style={{
              fontFamily: 'var(--font-heading)',
              transform: `translateY(${textVisible ? 0 : 20}px)`,
              opacity: textVisible ? 1 : 0,
              transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease-out',
            }}
          >
            Hisab Kitab
          </h1>

          {/* Subtitle */}
          <p
            className="text-base sm:text-lg font-semibold text-white/80 uppercase tracking-[0.2em] mb-2"
            style={{
              transform: `translateY(${textVisible ? 0 : 20}px)`,
              opacity: textVisible ? 1 : 0,
              transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s, opacity 0.6s ease-out 0.1s',
            }}
          >
            Digital Ledger App
          </p>

          {/* Tagline */}
          <p
            className="text-xl sm:text-2xl lg:text-3xl font-medium text-white/70 mb-8"
            style={{
              fontFamily: 'var(--font-heading)',
              transform: `translateY(${textVisible ? 0 : 20}px)`,
              opacity: textVisible ? 1 : 0,
              transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s, opacity 0.6s ease-out 0.2s',
            }}
          >
            Simplify Your Finances.
            <br />
            Track. Manage. Grow.
          </p>

          {/* CTA Button */}
          <a
            href="#get-started"
            className="inline-block px-8 py-4 bg-[#e8e0d0] text-[#1a1a1a] text-sm font-bold uppercase tracking-wider rounded-full
              hover:bg-white hover:scale-105 hover:shadow-[0_0_30px_rgba(232,224,208,0.3)]
              active:scale-[0.98]
              transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
              pointer-events-auto"
            style={{
              transform: `translateY(${textVisible ? 0 : 20}px)`,
              opacity: textVisible ? 1 : 0,
              transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s, opacity 0.6s ease-out 0.3s, background-color 0.3s, box-shadow 0.3s, scale 0.2s',
            }}
          >
            Start Your Free Trial
          </a>
        </div>
      </div>
    </div>
  );
}
