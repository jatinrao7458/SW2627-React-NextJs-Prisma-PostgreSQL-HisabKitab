'use client';

interface ScrollIndicatorProps {
  progress?: number;
}

export default function ScrollIndicator({ progress = 0 }: ScrollIndicatorProps) {
  // Fade out by 15% progress
  const opacity = progress < 0.05 ? 1 : Math.max(0, 1 - (progress - 0.05) / 0.1);

  if (opacity <= 0) return null;

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
      style={{ opacity }}
    >
      <span className="text-xs font-medium text-[#2a2a2a]/50 uppercase tracking-widest">
        Scroll to explore
      </span>

      {/* Mouse icon with animated scroll wheel */}
      <div className="w-6 h-10 rounded-full border-2 border-[#2a2a2a]/30 flex justify-center pt-2">
        <div className="w-1 h-2 rounded-full bg-[#2a2a2a]/40 animate-bounce" />
      </div>
    </div>
  );
}
