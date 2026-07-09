'use client';

interface ScrollIndicatorProps {
  progress?: number;
}

export default function ScrollIndicator({ progress = 0 }: ScrollIndicatorProps) {
  // Fade out by 15% progress
  const opacity = progress < 0.05 ? 1 : Math.max(0, 1 - (progress - 0.05) / 0.1);
  // Start dark (on paper), switch to white when ink darkens
  const inkDark = progress > 0.15;

  if (opacity <= 0) return null;

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none transition-colors duration-500"
      style={{ opacity }}
    >
      <span className={`text-xs font-medium uppercase tracking-widest ${
        inkDark ? 'text-white/50' : 'text-[#2a2a2a]/50'
      }`}>
        Scroll to explore
      </span>

      {/* Mouse icon with animated scroll wheel */}
      <div className={`w-6 h-10 rounded-full border-2 flex justify-center pt-2 ${
        inkDark ? 'border-white/30' : 'border-[#2a2a2a]/30'
      }`}>
        <div className={`w-1 h-2 rounded-full animate-bounce ${
          inkDark ? 'bg-white/50' : 'bg-[#2a2a2a]/40'
        }`} />
      </div>
    </div>
  );
}
