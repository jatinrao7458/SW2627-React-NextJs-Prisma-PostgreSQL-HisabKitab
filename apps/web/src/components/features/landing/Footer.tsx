export default function Footer() {
  return (
    <footer className="bg-[#0f1419] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3
              className="text-2xl font-bold text-white mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Hisab Kitab
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">
              The modern digital khatabook for shopkeepers. Track transactions,
              manage workers, control inventory — all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {['How It Works', 'Features', 'Pricing', 'Blog'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-white/50 hover:text-emerald-400 transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Contact Us'].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted hover:text-emerald transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Hisab Kitab. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Built with ❤️ by Jatin, Sameer & Anant
          </p>
        </div>
      </div>
    </footer>
  );
}
