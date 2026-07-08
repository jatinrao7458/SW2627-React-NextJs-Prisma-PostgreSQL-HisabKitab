'use client';

interface NavbarProps {
  progress?: number; // 0-1 animation progress
  animationComplete?: boolean;
}

export default function Navbar({ progress = 0, animationComplete = false }: NavbarProps) {
  // Text color shifts from dark to light as ink darkens (~25% progress)
  const inkDark = progress > 0.2;
  // After animation, use standard scrolled state
  const showDarkBg = animationComplete;

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        showDarkBg
          ? 'bg-[#1a1a1a]/90 backdrop-blur-xl border-b border-white/5 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <span
              className={`text-xl lg:text-2xl font-bold tracking-tight transition-colors duration-700 ${
                inkDark || showDarkBg ? 'text-white' : 'text-[#2a2a2a]'
              }`}
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Hisab Kitab
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`relative text-sm font-medium transition-all duration-300
                  hover:scale-[1.02]
                  after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px]
                  after:transition-all after:duration-300 hover:after:w-full
                  ${
                    inkDark || showDarkBg
                      ? 'text-white/60 hover:text-white after:bg-white/40'
                      : 'text-[#2a2a2a]/60 hover:text-[#2a2a2a] after:bg-[#2a2a2a]/30'
                  }`}
              >
                {link.label}
              </a>
            ))}

            {/* CTA Button */}
            <a
              href="#get-started"
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-300
                hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]
                active:scale-[0.98]
                ${
                  inkDark || showDarkBg
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[#2a2a2a] text-[#e8e0d0]'
                }`}
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${
              inkDark || showDarkBg ? 'text-white' : 'text-[#2a2a2a]'
            }`}
            aria-label="Toggle navigation menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
