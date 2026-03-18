import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { BottomSheet } from './components/BottomSheet';
import { generatePalette } from '../utils/colorPalette';
import type { PaletteShade } from '../utils/colorPalette';
import { generateNeutralPalette, applyNeutralToDOM, resetNeutral, hexToOklchHue } from '../utils/neutralTint';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Heading } from '../components/Heading';
import { DonationBox } from '../components/DonationBox';
import { Testimonial } from '../components/Testimonial';
import { Document } from '../components/Document';
import { SignDocument } from '../components/SignDocument';
import { Form } from '../components/Form';
import { SocialFollow } from '../components/SocialFollow';
import { List } from '../components/List';
import { ProductList } from '../components/ProductList';

const DEFAULT_COLOR = '#7D38EF';
const DEFAULT_FONT = 'Inter';
const DEFAULT_RADIUS = 'Medium';
const DEFAULT_TINT = 50;

type RadiusScale = 'Small' | 'Medium' | 'Large' | 'XLarge';

const RADIUS_MODES: { scale: RadiusScale; lg: string }[] = [
  { scale: 'Small', lg: '6px' },
  { scale: 'Medium', lg: '12px' },
  { scale: 'Large', lg: '16px' },
  { scale: 'XLarge', lg: '24px' },
];

function applyRadius(scale: RadiusScale, canvas: HTMLElement | null) {
  if (!canvas) return;
  if (scale === 'Medium') {
    canvas.removeAttribute('data-radius');
  } else {
    canvas.setAttribute('data-radius', scale.toLowerCase());
  }
}

function resetRadius(canvas: HTMLElement | null) {
  if (canvas) canvas.removeAttribute('data-radius');
}

const PRESET_COLORS = [
  '#7D38EF', '#DF2125', '#0385C8', '#19A44B', '#F97101', '#DC7801',
  '#E91E63', '#00B5D4', '#8D5DF9', '#64A501',
];

const FONT_OPTIONS = [
  'Inter',
  'Frances',
  'IBM Plex Mono',
  'Fredoka',
  'JetBrains Mono',
  'Instrument Sans',
  'Figtree',
  'Hanken Grotesk',
  'Geist',
  'DM Sans',
  'Public Sans',
  'Google Sans',
  'Bricolage Grotesque',
  'Varela Round',
];

function loadGoogleFont(fontName: string) {
  const id = `gfont-${fontName.replace(/\s+/g, '-')}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

/**
 * Calculate relative luminance from hex and return appropriate contrast color
 */
function getContrastColor(hex: string): string {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  // sRGB to linear
  const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  // WCAG: if luminance > 0.4, use dark text; otherwise white
  return luminance > 0.4 ? '#091141' : '#FFFFFF';
}

function applyPaletteToDOM(palette: PaletteShade[]) {
  const root = document.documentElement;
  const map: Record<string, string> = {};
  for (const shade of palette) {
    map[shade.key] = shade.hex;
  }

  // Only set primitive palette — semantic tokens reference these via var()
  root.style.setProperty('--primary-50', map['50']);
  root.style.setProperty('--primary-100', map['100']);
  root.style.setProperty('--primary-200', map['200']);
  root.style.setProperty('--primary-300', map['300']);
  root.style.setProperty('--primary-400', map['400']);
  root.style.setProperty('--primary-500', map['500']);
  root.style.setProperty('--primary-600', map['600']);
  root.style.setProperty('--primary-700', map['700']);
  root.style.setProperty('--primary-800', map['800']);
  root.style.setProperty('--primary-900', map['900']);
  root.style.setProperty('--primary-950', map['950']);

  // Auto-contrast: set fg-inverse based on button bg luminance
  // Light mode uses primary-600, dark mode uses primary-400
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  const btnBgShade = dark ? map['400'] : map['600'];
  root.style.setProperty('--fg-inverse', getContrastColor(btnBgShade));
}

function hslHueToHex(h: number): string {
  // Fixed saturation 75%, lightness 45% for vibrant brand colors
  const s = 0.75;
  const l = 0.45;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function hexToHslHue(hex: string): number {
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

function resetPalette() {
  const root = document.documentElement;
  const props = [
    '--primary-50', '--primary-100', '--primary-200', '--primary-300', '--primary-400',
    '--primary-500', '--primary-600', '--primary-700', '--primary-800', '--primary-900', '--primary-950',
    '--fg-inverse',
  ];
  props.forEach(p => root.style.removeProperty(p));
}

function isDarkMode(): boolean {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

export function ThemesView() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [brandHue, setBrandHue] = useState(() => hexToHslHue(DEFAULT_COLOR));
  const [tint, setTint] = useState(DEFAULT_TINT);
  const [font, setFont] = useState(DEFAULT_FONT);
  const [radius, setRadius] = useState<RadiusScale>(DEFAULT_RADIUS as RadiusScale);
  const [, setPalette] = useState<PaletteShade[]>(() => generatePalette(DEFAULT_COLOR, isDarkMode()));

  const handleColorChange = useCallback((newColor: string) => {
    setColor(newColor);
    setBrandHue(hexToHslHue(newColor));
    const newPalette = generatePalette(newColor, isDarkMode());
    setPalette(newPalette);
    applyPaletteToDOM(newPalette);
    const neutralPalette = generateNeutralPalette(newColor, tint, isDarkMode());
    applyNeutralToDOM(neutralPalette);
  }, [tint]);

  const handleHueChange = useCallback((hue: number) => {
    setBrandHue(hue);
    const newColor = hslHueToHex(hue);
    setColor(newColor);
    const newPalette = generatePalette(newColor, isDarkMode());
    setPalette(newPalette);
    applyPaletteToDOM(newPalette);
    const neutralPalette = generateNeutralPalette(newColor, tint, isDarkMode());
    applyNeutralToDOM(neutralPalette);
  }, [tint]);

  const handleTintChange = useCallback((newTint: number) => {
    setTint(newTint);
    const neutralPalette = generateNeutralPalette(color, newTint, isDarkMode());
    applyNeutralToDOM(neutralPalette);
  }, [color]);

  const handleFontChange = useCallback((newFont: string) => {
    setFont(newFont);
    loadGoogleFont(newFont);
    document.documentElement.style.setProperty('--font-family', `'${newFont}', -apple-system, BlinkMacSystemFont, sans-serif`);
  }, []);

  const handleRadiusChange = useCallback((scale: RadiusScale) => {
    setRadius(scale);
    applyRadius(scale, canvasRef.current);
  }, []);

  const handleReset = useCallback(() => {
    setColor(DEFAULT_COLOR);
    setBrandHue(hexToHslHue(DEFAULT_COLOR));
    setTint(DEFAULT_TINT);
    setFont(DEFAULT_FONT);
    setRadius(DEFAULT_RADIUS as RadiusScale);
    const newPalette = generatePalette(DEFAULT_COLOR, isDarkMode());
    setPalette(newPalette);
    resetPalette();
    resetNeutral();
    resetRadius(canvasRef.current);
    document.documentElement.style.removeProperty('--font-family');
  }, []);

  // Apply palette + neutrals whenever color or tint changes, and on theme toggle
  useEffect(() => {
    const palette = generatePalette(color, isDarkMode());
    applyPaletteToDOM(palette);
    const neutralPalette = generateNeutralPalette(color, tint, isDarkMode());
    applyNeutralToDOM(neutralPalette);

    const observer = new MutationObserver(() => {
      applyPaletteToDOM(generatePalette(color, isDarkMode()));
      applyNeutralToDOM(generateNeutralPalette(color, tint, isDarkMode()));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      observer.disconnect();
    };
  }, [color, tint]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetPalette();
      resetNeutral();
      resetRadius(canvasRef.current);
      document.documentElement.style.removeProperty('--font-family');
    };
  }, []);

  const sidebarContent: ReactNode = (
    <>
      <div className="themes-view__sidebar-section">
        <h3 className="themes-view__sidebar-title">Brand Color</h3>
          <div className="themes-view__hue-row">
            <input
              type="range"
              min="0"
              max="360"
              value={brandHue}
              onChange={(e) => handleHueChange(Number(e.target.value))}
              className="themes-view__hue-range"
            />
            <div className="themes-view__picker-wrapper">
              <input
                type="color"
                value={color}
                onChange={(e) => handleColorChange(e.target.value)}
                className="themes-view__picker-circle"
              />
            </div>
          </div>
        </div>

        <div className="themes-view__sidebar-section">
          <h3 className="themes-view__sidebar-title">Base Color</h3>
          <div className="themes-view__tint-slider">
            <input
              type="range"
              min="0"
              max="100"
              value={tint}
              onChange={(e) => handleTintChange(Number(e.target.value))}
              className="themes-view__tint-range"
              style={{
                background: `linear-gradient(to right, #808080, oklch(0.55 0.15 ${hexToOklchHue(color)}))`,
              }}
            />
            <div className="themes-view__tint-labels">
              <span>Grey</span>
              <span>Tinted</span>
            </div>
          </div>
        </div>

        <div className="themes-view__sidebar-section">
          <h3 className="themes-view__sidebar-title">Presets</h3>
          <div className="themes-view__presets">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                className={`themes-view__preset${color.toUpperCase() === c ? ' active' : ''}`}
                style={{ background: c }}
                onClick={() => handleColorChange(c)}
                title={c}
              />
            ))}
          </div>
        </div>

        <div className="themes-view__sidebar-section">
          <h3 className="themes-view__sidebar-title">Font Family</h3>
          <div className="themes-view__font-list">
            {FONT_OPTIONS.map((f) => {
              loadGoogleFont(f);
              return (
                <button
                  key={f}
                  className={`themes-view__font-item${font === f ? ' active' : ''}`}
                  style={{ fontFamily: `'${f}', sans-serif` }}
                  onClick={() => handleFontChange(f)}
                  onMouseEnter={() => {
                    document.documentElement.style.setProperty('--font-family', `'${f}', -apple-system, BlinkMacSystemFont, sans-serif`);
                  }}
                  onMouseLeave={() => {
                    document.documentElement.style.setProperty('--font-family', `'${font}', -apple-system, BlinkMacSystemFont, sans-serif`);
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        <div className="themes-view__sidebar-section">
          <h3 className="themes-view__sidebar-title">Border Radius</h3>
          <div className="themes-view__radius-options">
            {RADIUS_MODES.map(({ scale, lg }) => (
              <button
                key={scale}
                className={`themes-view__radius-btn${radius === scale ? ' active' : ''}`}
                onClick={() => handleRadiusChange(scale)}
              >
                <div className="themes-view__radius-preview" style={{ borderRadius: lg }} />
                <span>{scale}</span>
              </button>
            ))}
          </div>
        </div>

      <button className="themes-view__reset" onClick={handleReset}>Reset to Default</button>
    </>
  );

  return (
    <div className="themes-view">
      {/* Left: Settings Panel (desktop) */}
      <aside className="themes-view__sidebar">
        {sidebarContent}
      </aside>

      {/* Mobile: floating button + bottom sheet */}
      <div className="mobile-fab mobile-fab--themes">
        <button className="mobile-fab__btn" onClick={() => setSheetOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          </svg>
        </button>
      </div>
      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Theme Settings">
        <div className="themes-view__sidebar themes-view__sidebar--sheet">
          {sidebarContent}
        </div>
      </BottomSheet>

      {/* Right: Preview as App Page */}
      <main className="themes-view__preview">
        <div className="themes-view__canvas" ref={canvasRef}>
        <div className="themes-view__app">
          {/* Hero Section */}
          <section className="themes-view__section">
            <Heading size="Large" alignment="Center" heading="Welcome to Our Store" subheading="Discover amazing products and support our mission." />
            <div className="themes-view__btn-row">
              <Button variant="Default" size="Default" label="Get Started" leftIcon="ArrowRight" rightIcon="none" shrinked />
              <Button variant="Outlined" size="Default" label="Learn More" leftIcon="none" rightIcon="none" shrinked />
            </div>
          </section>

          {/* Products */}
          <section className="themes-view__section">
            <ProductList title="Featured Products" buttonLabel="Add to Cart" />
          </section>

          {/* Cards Row */}
          <section className="themes-view__section">
            <Heading size="Small" heading="Our Services" subheading="What we offer" />
            <Card imageStyle="Icon" layout="Horizontal" action="Button" iconName="MessageCircle" title="Consulting" description="Expert guidance for your business" buttonLabel="Book Now" />
            <Card imageStyle="Icon" layout="Horizontal" action="Button" iconName="Palette" title="Design" description="Beautiful interfaces that convert" buttonLabel="View Work" />
            <Card imageStyle="Icon" layout="Horizontal" action="Button" iconName="Code" title="Development" description="Scalable solutions built to last" buttonLabel="Start Project" />
          </section>

          {/* List Section */}
          <section className="themes-view__section">
            <Heading size="Small" heading="Recent Updates" subheading="Stay up to date" />
            <List layout="Basic" imageStyle="Square" size="Compact" action="Icon" actionIconFilled={false} items={[
              { title: 'New feature release v2.5', description: 'Performance improvements and bug fixes' },
              { title: 'Community meetup next week', description: 'Join us for the monthly gathering' },
              { title: 'Partnership announcement', description: 'Exciting collaboration coming soon' },
            ]} />
          </section>

          {/* Documents & Forms Row */}
          <section className="themes-view__section">
            <Heading size="Small" heading="Resources" subheading="Forms and documents" />
            <div className="themes-view__docs-row">
              <Form label="Contact Form" description="Get in touch with us" />
              <SignDocument label="Terms of Service" description="Required before proceeding" />
              <Document alignment="Left" size="Normal" fileName="Brand Guidelines.pdf" description="4.2 MB - PDF Document" />
              <Document hasFile={false} />
            </div>
          </section>

          {/* Testimonial */}
          <section className="themes-view__section">
            <Testimonial items={[
              { name: 'Sarah Johnson', text: '\u201CThis platform transformed how we collect donations. The interface is intuitive and our donors love it.\u201D' },
              { name: 'Michael Chen', text: '\u201CSetup was incredibly easy. We were up and running in minutes, not days.\u201D' },
              { name: 'Emily Davis', text: '\u201CThe best investment we made for our nonprofit. Highly recommended!\u201D' },
            ]} />
          </section>

          {/* Donation */}
          <section className="themes-view__section themes-view__section--center">
            <DonationBox
              headingAlignment="Center"
              title="Support Our Cause"
              description="Every contribution makes a difference in someone's life."
              amounts={['$10.00', '$25.00', '$50.00', '$100.00']}
              showCustomAmount
              buttonLabel="Donate Now"
              goalProgress={72}
              raisedAmount="$7,200"
              goalAmount="$10,000"
            />
          </section>

          {/* Footer: Social + Buttons */}
          <section className="themes-view__section themes-view__section--center themes-view__section--footer">
            <SocialFollow filled />
          </section>
        </div>
        </div>
      </main>
    </div>
  );
}
