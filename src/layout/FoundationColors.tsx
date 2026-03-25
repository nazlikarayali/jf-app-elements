import { useEffect, useState } from 'react';

interface PaletteShade {
  name: string;
  variable: string;
}

const neutralShades: PaletteShade[] = [
  { name: '0', variable: '--neutral-0' },
  { name: '50', variable: '--neutral-50' },
  { name: '100', variable: '--neutral-100' },
  { name: '200', variable: '--neutral-200' },
  { name: '300', variable: '--neutral-300' },
  { name: '400', variable: '--neutral-400' },
  { name: '500', variable: '--neutral-500' },
  { name: '600', variable: '--neutral-600' },
  { name: '700', variable: '--neutral-700' },
  { name: '800', variable: '--neutral-800' },
  { name: '900', variable: '--neutral-900' },
  { name: '950', variable: '--neutral-950' },
];

const primaryShades: PaletteShade[] = [
  { name: '50', variable: '--primary-50' },
  { name: '100', variable: '--primary-100' },
  { name: '200', variable: '--primary-200' },
  { name: '300', variable: '--primary-300' },
  { name: '400', variable: '--primary-400' },
  { name: '500', variable: '--primary-500' },
  { name: '600', variable: '--primary-600' },
  { name: '700', variable: '--primary-700' },
  { name: '800', variable: '--primary-800' },
  { name: '900', variable: '--primary-900' },
  { name: '950', variable: '--primary-950' },
];

const colorCanvas = document.createElement('canvas');
colorCanvas.width = 1;
colorCanvas.height = 1;
const colorCtx = colorCanvas.getContext('2d', { willReadFrequently: true })!;

function cssToHex(cssColor: string): string {
  // Draw the color onto a 1x1 canvas and read the pixel back as RGB
  // This handles any CSS color format: rgb, oklch, hsl, etc.
  colorCtx.clearRect(0, 0, 1, 1);
  colorCtx.fillStyle = '#000000';
  colorCtx.fillStyle = cssColor;
  colorCtx.fillRect(0, 0, 1, 1);
  const [r, g, b] = colorCtx.getImageData(0, 0, 1, 1).data;
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
}

function resolveColor(variable: string, el: HTMLElement): string {
  const temp = document.createElement('div');
  temp.style.color = `var(${variable})`;
  el.appendChild(temp);
  const resolved = getComputedStyle(temp).color;
  el.removeChild(temp);
  return cssToHex(resolved);
}

function isLightColor(hex: string): boolean {
  const match = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!match) return true;
  const r = parseInt(match[1], 16);
  const g = parseInt(match[2], 16);
  const b = parseInt(match[3], 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

interface ResolvedShade {
  name: string;
  variable: string;
  light: string;
  dark: string;
}

function PaletteRow({ shade }: { shade: ResolvedShade }) {
  return (
    <div className="foundation-colors__row">
      <div className="foundation-colors__label">{shade.name}</div>
      <div
        className="foundation-colors__swatch"
        style={{ background: shade.light }}
        data-light={isLightColor(shade.light) ? '' : undefined}
        data-dark={!isLightColor(shade.light) ? '' : undefined}
      >
        {shade.light}
      </div>
      <div
        className="foundation-colors__swatch"
        style={{ background: shade.dark }}
        data-light={isLightColor(shade.dark) ? '' : undefined}
        data-dark={!isLightColor(shade.dark) ? '' : undefined}
      >
        {shade.dark}
      </div>
    </div>
  );
}

function PaletteSection({ title, shades, resolvedShades }: { title: string; shades: PaletteShade[]; resolvedShades: Map<string, ResolvedShade> }) {
  return (
    <div className="foundation-colors__section">
      <h3 className="foundation-colors__section-title">{title}</h3>
      <div className="foundation-colors__header">
        <div className="foundation-colors__label" />
        <div className="foundation-colors__mode-label">Light</div>
        <div className="foundation-colors__mode-label">Dark</div>
      </div>
      {shades.map((shade) => {
        const resolved = resolvedShades.get(shade.variable);
        if (!resolved) return null;
        return <PaletteRow key={shade.variable} shade={resolved} />;
      })}
    </div>
  );
}

export function FoundationColors() {
  const [resolvedShades, setResolvedShades] = useState<Map<string, ResolvedShade>>(new Map());

  useEffect(() => {
    const root = document.documentElement;
    const allShades = [...neutralShades, ...primaryShades];
    const map = new Map<string, ResolvedShade>();

    // Save current theme
    const currentTheme = root.getAttribute('data-theme');

    // Resolve light mode colors
    root.removeAttribute('data-theme');
    for (const shade of allShades) {
      const light = resolveColor(shade.variable, root);
      map.set(shade.variable, { name: shade.name, variable: shade.variable, light, dark: '' });
    }

    // Resolve dark mode colors
    root.setAttribute('data-theme', 'dark');
    for (const shade of allShades) {
      const entry = map.get(shade.variable)!;
      entry.dark = resolveColor(shade.variable, root);
    }

    // Restore original theme
    if (currentTheme) {
      root.setAttribute('data-theme', currentTheme);
    } else {
      root.removeAttribute('data-theme');
    }

    setResolvedShades(map);
  }, []);

  return (
    <main className="main-content">
      <div className="component-view">
        <div className="component-view__toolbar">
          <div className="component-view__name">
            <h2>Colors</h2>
            <span className="component-view__tag">Foundations</span>
          </div>
        </div>
        <div className="foundation-colors">
          <PaletteSection title="Neutral" shades={neutralShades} resolvedShades={resolvedShades} />
          <PaletteSection title="Primary" shades={primaryShades} resolvedShades={resolvedShades} />
        </div>
      </div>
    </main>
  );
}
