/**
 * Neutral Tint Generator using OKLCH color space
 *
 * Uses native CSS oklch() for perceptually uniform neutral palettes.
 * Tint slider controls chroma (color intensity) while keeping
 * lightness consistent across hues.
 */

interface NeutralShade {
  key: string;
  css: string;
}

// OKLCH lightness and max chroma per shade
// L: 0-1 (perceptual lightness), C: 0-0.4 (chroma/saturation)
const NEUTRAL_SHADES: { key: string; l: number; maxC: number }[] = [
  { key: '0',   l: 1.00,  maxC: 0 },
  { key: '50',  l: 0.965, maxC: 0.02 },
  { key: '100', l: 0.905, maxC: 0.035 },
  { key: '200', l: 0.845, maxC: 0.045 },
  { key: '300', l: 0.695, maxC: 0.06 },
  { key: '400', l: 0.545, maxC: 0.07 },
  { key: '500', l: 0.42,  maxC: 0.065 },
  { key: '600', l: 0.35,  maxC: 0.06 },
  { key: '700', l: 0.29,  maxC: 0.055 },
  { key: '800', l: 0.21,  maxC: 0.05 },
  { key: '900', l: 0.18,  maxC: 0.045 },
  { key: '950', l: 0.12,  maxC: 0.04 },
];

/**
 * Extract hue from hex color using standard RGB→HSL hue extraction
 */
function hexToHue(hex: string): number {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;

  if (max !== min) {
    const d = max - min;
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return Math.round(h * 360);
}

/**
 * Generate tinted neutral palette using OKLCH
 * @param brandHex - Brand color hex to extract hue from
 * @param tintAmount - 0 (pure grey) to 100 (fully tinted)
 * @returns Array of shades with oklch() CSS values
 */
function generateNeutralPalette(brandHex: string, tintAmount: number): NeutralShade[] {
  const hue = hexToHue(brandHex);
  const tint = Math.max(0, Math.min(100, tintAmount)) / 100;

  return NEUTRAL_SHADES.map(({ key, l, maxC }) => {
    const chroma = maxC * tint;
    // Use oklch() CSS native function — no conversion needed
    const css = chroma === 0
      ? `oklch(${l} 0 0)`
      : `oklch(${l} ${chroma.toFixed(4)} ${hue})`;
    return { key, css };
  });
}

/**
 * Apply neutral palette to CSS custom properties
 */
function applyNeutralToDOM(palette: NeutralShade[]) {
  const root = document.documentElement;
  for (const shade of palette) {
    root.style.setProperty(`--neutral-${shade.key}`, shade.css);
  }
}

function resetNeutral() {
  const root = document.documentElement;
  NEUTRAL_SHADES.forEach(({ key }) => {
    root.style.removeProperty(`--neutral-${key}`);
  });
}

export { generateNeutralPalette, applyNeutralToDOM, resetNeutral, hexToHue };
export type { NeutralShade };
