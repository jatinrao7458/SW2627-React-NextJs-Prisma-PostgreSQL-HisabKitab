'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollAnimationProps {
  frameCount: number;
  basePath: string;
  prefix: string;
  format: string;
  padDigits?: number;
  bufferAhead?: number;
  bufferBehind?: number;
  lerpFactor?: number;
  /** Pixels of wheel-delta to traverse all frames */
  totalWheelTravel?: number;
  /** Called on every frame update with progress 0-1 */
  onProgress?: (progress: number) => void;
  /** Called once when animation reaches the last frame */
  onComplete?: () => void;
}

export default function ScrollAnimation({
  frameCount,
  basePath,
  prefix,
  format,
  padDigits = 4,
  bufferAhead = 40,
  bufferBehind = 20,
  lerpFactor = 0.1,
  totalWheelTravel = 4000,
  onProgress,
  onComplete,
}: ScrollAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  // Single mutable state ref to avoid dependency loops
  const engine = useRef({
    cache: new Map<number, HTMLImageElement>(),
    loading: new Set<number>(),
    currentFrame: 1,
    targetFrame: 1,
    lastDrawn: -1,
    rafId: 0,
    wheelAccum: 0,
    completed: false,
    locked: true,
  });

  const getFrameUrl = useCallback(
    (i: number) => `${basePath}${prefix}${String(i).padStart(padDigits, '0')}.${format}`,
    [basePath, prefix, padDigits, format]
  );

  // Draw frame to canvas with object-fit:cover
  function drawFrame(index: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = engine.current.cache.get(index);
    if (!img) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    // object-fit: cover math
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const ir = iw / ih, cr = w / h;
    let sx = 0, sy = 0, sw = iw, sh = ih;
    if (ir > cr) { sw = ih * cr; sx = (iw - sw) / 2; }
    else { sh = iw / cr; sy = (ih - sh) / 2; }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
    engine.current.lastDrawn = index;
  }

  // Preload sliding window
  function preloadAround(center: number) {
    const e = engine.current;
    const lo = Math.max(1, center - bufferBehind);
    const hi = Math.min(frameCount, center + bufferAhead);
    for (let i = lo; i <= hi; i++) {
      if (!e.cache.has(i) && !e.loading.has(i)) {
        e.loading.add(i);
        const img = new Image();
        img.onload = () => { e.cache.set(i, img); e.loading.delete(i); };
        img.onerror = () => e.loading.delete(i);
        img.src = getFrameUrl(i);
      }
    }
    // GC distant frames
    for (const k of e.cache.keys()) {
      if (k < center - bufferBehind * 3 || k > center + bufferAhead * 3) {
        e.cache.delete(k);
      }
    }
  }

  useEffect(() => {
    const e = engine.current;

    // Lock body scroll
    document.body.style.overflow = 'hidden';
    e.locked = true;

    // Load first frame
    const img1 = new Image();
    img1.onload = () => {
      e.cache.set(1, img1);
      drawFrame(1);
      setReady(true);
      preloadAround(1);
    };
    img1.src = getFrameUrl(1);

    // Render loop
    function tick() {
      const diff = e.targetFrame - e.currentFrame;
      if (Math.abs(diff) > 0.05) {
        e.currentFrame += diff * lerpFactor;
      } else {
        e.currentFrame = e.targetFrame;
      }

      const idx = Math.max(1, Math.min(frameCount, Math.round(e.currentFrame)));
      if (idx !== e.lastDrawn) {
        drawFrame(idx);
      }

      // Report progress
      const progress = (idx - 1) / (frameCount - 1);
      onProgress?.(progress);

      // Check completion
      if (idx >= frameCount && !e.completed) {
        e.completed = true;
        // Unlock body scroll
        document.body.style.overflow = '';
        e.locked = false;
        onComplete?.();
      }

      e.rafId = requestAnimationFrame(tick);
    }
    e.rafId = requestAnimationFrame(tick);

    // Wheel handler — drives the animation instead of native scroll
    function onWheel(ev: WheelEvent) {
      if (!e.locked) return; // after completion, let native scroll work

      ev.preventDefault(); // block native scroll

      // Accumulate wheel delta
      e.wheelAccum += ev.deltaY;

      // Clamp to valid range
      e.wheelAccum = Math.max(0, Math.min(totalWheelTravel, e.wheelAccum));

      // Map accumulated delta → frame index (1-based)
      const progress = e.wheelAccum / totalWheelTravel;
      e.targetFrame = 1 + progress * (frameCount - 1);

      // Handle reverse scroll: if scrolling back to start, re-lock if needed
      if (e.completed && progress < 0.98) {
        e.completed = false;
        document.body.style.overflow = 'hidden';
        e.locked = true;
      }

      preloadAround(Math.round(e.targetFrame));
    }

    window.addEventListener('wheel', onWheel, { passive: false });

    // Resize handler
    function onResize() { e.lastDrawn = -1; }
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(e.rafId);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      // Restore scroll on unmount
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0">
      {/* Loading state */}
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#e8e0d0] z-10">
          <div className="w-12 h-12 rounded-full border-3 border-[#3a3a3a]/20 border-t-[#3a3a3a] animate-spin" />
        </div>
      )}

      <canvas
        ref={canvasRef}
        className={`block w-full h-full transition-opacity duration-700 ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
