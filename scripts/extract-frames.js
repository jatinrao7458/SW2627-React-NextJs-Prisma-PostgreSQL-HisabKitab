/**
 * extract-frames.js
 * 
 * Extracts frames from 0707.mp4 video for scroll-driven animation.
 * Uses ffmpeg-static (already in devDependencies) to extract frames as WebP images.
 * 
 * Usage: node scripts/extract-frames.js
 * 
 * Output: apps/web/public/animation/frames/frame_XXXX.webp
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const FPS = 24;           // 24 frames per second for smooth animation
const QUALITY = 75;       // WebP quality (0-100, lower = smaller)
const SCALE_WIDTH = 1280; // Output width (height auto-calculated)

const ROOT = path.resolve(__dirname, '..');
const VIDEO_PATH = path.join(ROOT, 'reference', '0707.mp4');
const OUTPUT_DIR = path.join(ROOT, 'apps', 'web', 'public', 'animation', 'frames');

// Try to find ffmpeg
let ffmpegPath;
try {
  // First try ffmpeg-static from root node_modules
  ffmpegPath = require('ffmpeg-static');
  console.log(`✅ Using ffmpeg-static: ${ffmpegPath}`);
} catch {
  try {
    // Try from apps/web/node_modules
    ffmpegPath = require(path.join(ROOT, 'apps', 'web', 'node_modules', 'ffmpeg-static'));
    console.log(`✅ Using ffmpeg-static (web): ${ffmpegPath}`);
  } catch {
    // Fall back to system ffmpeg
    try {
      execSync('ffmpeg -version', { stdio: 'ignore' });
      ffmpegPath = 'ffmpeg';
      console.log('✅ Using system ffmpeg');
    } catch {
      console.error('❌ ffmpeg not found. Install it or add ffmpeg-static to devDependencies.');
      console.error('   npm install --save-dev ffmpeg-static');
      process.exit(1);
    }
  }
}

// Verify input video exists
if (!fs.existsSync(VIDEO_PATH)) {
  console.error(`❌ Video not found at: ${VIDEO_PATH}`);
  console.error('   Expected: reference/0707.mp4');
  process.exit(1);
}

// Create output directory
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Get video info
console.log('\n📊 Analyzing video...');
const probeCmd = `"${ffmpegPath}" -i "${VIDEO_PATH}" 2>&1`;
try {
  execSync(probeCmd, { encoding: 'utf-8' });
} catch (e) {
  // ffmpeg -i always returns non-zero, parse stderr for info
  const output = e.stderr || e.stdout || '';
  const durationMatch = output.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
  if (durationMatch) {
    const hours = parseFloat(durationMatch[1]);
    const minutes = parseFloat(durationMatch[2]);
    const seconds = parseFloat(durationMatch[3]);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const expectedFrames = Math.floor(totalSeconds * FPS);
    console.log(`   Duration: ${durationMatch[0].replace('Duration: ', '')}`);
    console.log(`   Expected frames at ${FPS}fps: ~${expectedFrames}`);
  }
}

// Extract frames
console.log(`\n🎬 Extracting frames at ${FPS}fps, ${SCALE_WIDTH}px wide, WebP quality ${QUALITY}...`);
console.log(`   Output: ${OUTPUT_DIR}\n`);

const ffmpegCmd = [
  `"${ffmpegPath}"`,
  `-i "${VIDEO_PATH}"`,
  `-vf "fps=${FPS},scale=${SCALE_WIDTH}:-1"`,
  `-c:v libwebp`,
  `-quality ${QUALITY}`,
  `-y`,
  `"${path.join(OUTPUT_DIR, 'frame_%04d.webp')}"`
].join(' ');

try {
  execSync(ffmpegCmd, { stdio: 'inherit' });
} catch (e) {
  console.error('❌ Frame extraction failed.');
  console.error(e.message);
  process.exit(1);
}

// Count output files
const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.webp'));
console.log(`\n✅ Extracted ${files.length} frames to ${OUTPUT_DIR}`);

// Calculate total size
const totalSize = files.reduce((sum, f) => {
  return sum + fs.statSync(path.join(OUTPUT_DIR, f)).size;
}, 0);
const avgSize = Math.round(totalSize / files.length / 1024);
console.log(`   Total size: ${(totalSize / 1024 / 1024).toFixed(1)}MB`);
console.log(`   Avg frame size: ${avgSize}KB`);

// Write a manifest JSON for the component to know frame count
const manifest = {
  frameCount: files.length,
  fps: FPS,
  width: SCALE_WIDTH,
  format: 'webp',
  prefix: 'frame_',
  basePath: '/animation/frames/',
};

const manifestPath = path.join(ROOT, 'apps', 'web', 'public', 'animation', 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`   Manifest written to: ${manifestPath}`);
console.log('\n🎉 Done! Frames are ready for the ScrollAnimation component.');
