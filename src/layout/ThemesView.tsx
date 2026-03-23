import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { Icon } from '../components/Icon/Icon';
import { useIconLibrary, type IconLibrary, type IconStyle } from '../context/IconLibraryContext';
import { ICON_LIBRARIES, loadLibrary } from '../utils/iconRegistry';
import { BottomSheet } from './components/BottomSheet';
import { generatePalette, applySecondaryPaletteToDOM, resetSecondaryPalette } from '../utils/colorPalette';
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
import { Table } from '../components/Table';
import { SocialFollow } from '../components/SocialFollow';
import { List } from '../components/List';
import { ProductList } from '../components/ProductList';

const DEFAULT_COLOR = '#7D38EF';
const DEFAULT_FONT = 'Inter';
const DEFAULT_HEADING_FONT = '';
const DEFAULT_RADIUS = 'Medium';
const DEFAULT_TINT = 50;
const DEFAULT_HARMONY = 150;

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

interface ThemePreset {
  name: string;
  color: string;
  font: string;
  headingFont: string;
  iconLibrary: IconLibrary;
  radius: RadiusScale;
  tint: number;
  mode: 'light' | 'dark';
  harmonyOffset: number;
}

const THEME_PRESETS: ThemePreset[] = [
  { name: 'Default', color: '#7D38EF', font: 'Inter', headingFont: '', iconLibrary: 'lucide', radius: 'Medium', tint: 50, mode: 'light', harmonyOffset: 150 },
  { name: 'Ocean Breeze', color: '#0385C8', font: 'DM Sans', headingFont: 'Playfair Display', iconLibrary: 'lucide', radius: 'Large', tint: 30, mode: 'light', harmonyOffset: 150 },
  { name: 'Midnight Blue', color: '#0385C8', font: 'Geist', headingFont: '', iconLibrary: 'phosphor', radius: 'Medium', tint: 20, mode: 'dark', harmonyOffset: 150 },
  { name: 'Forest', color: '#19A44B', font: 'Public Sans', headingFont: 'Lora', iconLibrary: 'tabler', radius: 'Small', tint: 40, mode: 'light', harmonyOffset: 120 },
  { name: 'Sunset', color: '#F97101', font: 'Bricolage Grotesque', headingFont: '', iconLibrary: 'lucide', radius: 'Large', tint: 60, mode: 'light', harmonyOffset: 180 },
  { name: 'Cherry', color: '#DF2125', font: 'Instrument Sans', headingFont: 'Merriweather', iconLibrary: 'lucide', radius: 'Medium', tint: 35, mode: 'light', harmonyOffset: 150 },
  { name: 'Dark Elegance', color: '#8D5DF9', font: 'Figtree', headingFont: 'Playfair Display', iconLibrary: 'phosphor', radius: 'XLarge', tint: 70, mode: 'dark', harmonyOffset: 160 },
  { name: 'Minimal Dark', color: '#64A501', font: 'Hanken Grotesk', headingFont: '', iconLibrary: 'tabler', radius: 'Small', tint: 10, mode: 'dark', harmonyOffset: 150 },
  { name: 'Warm Gold', color: '#DC7801', font: 'Fredoka', headingFont: '', iconLibrary: 'lucide', radius: 'XLarge', tint: 80, mode: 'light', harmonyOffset: 200 },
  { name: 'Rose', color: '#E91E63', font: 'Varela Round', headingFont: 'Lora', iconLibrary: 'phosphor', radius: 'Large', tint: 55, mode: 'light', harmonyOffset: 150 },
  { name: 'Aqua Night', color: '#00B5D4', font: 'JetBrains Mono', headingFont: '', iconLibrary: 'lucide', radius: 'Medium', tint: 25, mode: 'dark', harmonyOffset: 150 },
  { name: 'Monochrome', color: '#353C6A', font: 'IBM Plex Mono', headingFont: '', iconLibrary: 'tabler', radius: 'Small', tint: 0, mode: 'light', harmonyOffset: 150 },
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

const HEADING_FONT_OPTIONS = [
  'Playfair Display',
  'Merriweather',
  'Lora',
  'Libre Baskerville',
  'Fraunces',
  'DM Serif Display',
  'Bitter',
  'Sora',
  'Space Grotesk',
  'Outfit',
  ...FONT_OPTIONS,
];

interface FontPairing {
  heading: string;
  body: string;
  tags: string[];
}

const FONT_PAIRINGS: FontPairing[] = [
  { heading: 'Playfair Display', body: 'DM Sans', tags: ['sophisticated', 'editorial'] },
  { heading: 'Playfair Display', body: 'Source Serif 4', tags: ['elegant', 'traditional'] },
  { heading: 'DM Serif Display', body: 'Libre Baskerville', tags: ['literary', 'warm'] },
  { heading: 'Cormorant Garamond', body: 'Raleway', tags: ['elegant', 'dramatic'] },
  { heading: 'Cormorant Garamond', body: 'Lora', tags: ['dramatic', 'literary'] },
  { heading: 'EB Garamond', body: 'Inter', tags: ['academic', 'refined'] },
  { heading: 'EB Garamond', body: 'Crimson Text', tags: ['scholarly', 'literary'] },
  { heading: 'Merriweather', body: 'Mulish', tags: ['reliable', 'readable'] },
  { heading: 'Lora', body: 'Nunito Sans', tags: ['warm', 'approachable'] },
  { heading: 'Bitter', body: 'Open Sans', tags: ['reliable', 'editorial'] },
  { heading: 'Bitter', body: 'Lora', tags: ['warm', 'narrative'] },
  { heading: 'Space Grotesk', body: 'DM Sans', tags: ['playful', 'startup'] },
  { heading: 'Sora', body: 'Public Sans', tags: ['modern', 'confident'] },
  { heading: 'Outfit', body: 'Libre Baskerville', tags: ['structured', 'professional'] },
  { heading: 'Outfit', body: 'IBM Plex Sans', tags: ['trustworthy', 'precise'] },
  { heading: 'Montserrat', body: 'Karla', tags: ['modern', 'bold'] },
  { heading: 'Plus Jakarta Sans', body: 'PT Serif', tags: ['curated', 'contemporary'] },
  { heading: 'Plus Jakarta Sans', body: 'Inter', tags: ['friendly', 'professional'] },
  { heading: 'Manrope', body: 'DM Sans', tags: ['analytical', 'clear'] },
  { heading: 'Urbanist', body: 'Libre Franklin', tags: ['clean', 'startup'] },
  { heading: 'Bricolage Grotesque', body: 'Figtree', tags: ['creative', 'geometric'] },
  { heading: 'Oswald', body: 'Barlow', tags: ['commanding', 'editorial'] },
  { heading: 'Anton', body: 'Work Sans', tags: ['bold', 'impactful'] },
  { heading: 'Josefin Sans', body: 'Raleway', tags: ['elegant', 'sophisticated'] },
  { heading: 'Quicksand', body: 'Cabin', tags: ['playful', 'approachable'] },
  { heading: 'Poppins', body: 'Hind', tags: ['friendly', 'warm'] },
  { heading: 'Nunito', body: 'Nunito Sans', tags: ['friendly', 'approachable'] },
  { heading: 'Roboto Slab', body: 'Roboto', tags: ['systematic', 'professional'] },
  { heading: 'Archivo Black', body: 'Archivo', tags: ['raw', 'brutalist'] },
  { heading: 'Barlow Condensed', body: 'Barlow', tags: ['efficient', 'modern'] },
  { heading: 'Fjalla One', body: 'Josefin Sans', tags: ['impactful', 'commanding'] },
  { heading: 'Figtree', body: 'Overpass', tags: ['calm', 'clear'] },
  { heading: 'Geist', body: 'Geist', tags: ['modern', 'minimal'] },
  { heading: 'Inter', body: 'Inter', tags: ['clean', 'neutral'] },
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

function PresetDropdown({ presets, active, onSelect }: { presets: ThemePreset[]; active: string; onSelect: (p: ThemePreset) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const activePreset = presets.find(p => p.name === active);

  return (
    <div className="preset-dropdown" ref={ref}>
      <button className="preset-dropdown__trigger" onClick={() => setOpen(!open)}>
        {activePreset && <span className="preset-dropdown__circle" style={{ background: activePreset.color }} />}
        <span className="preset-dropdown__label">{active || 'Select theme'}</span>
        <Icon name="ChevronDown" size={16} className={`preset-dropdown__chevron${open ? ' open' : ''}`} />
      </button>
      {open && (
        <div className="preset-dropdown__menu">
          {presets.map((p) => (
            <button
              key={p.name}
              className={`preset-dropdown__item${p.name === active ? ' active' : ''}`}
              onClick={() => { onSelect(p); setOpen(false); }}
            >
              <span className="preset-dropdown__circle" style={{ background: p.color }} />
              <span className="preset-dropdown__item-label">{p.name}</span>
              {p.name === active && <Icon name="Check" size={16} className="preset-dropdown__check" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FontDropdown({ fonts, active, onChange }: { fonts: string[]; active: string; onChange: (f: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fonts.forEach(loadGoogleFont);
  }, [fonts]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="preset-dropdown" ref={ref}>
      <button className="preset-dropdown__trigger" onClick={() => setOpen(!open)}>
        <span className="preset-dropdown__label" style={{ fontFamily: `'${active}', sans-serif` }}>{active}</span>
        <Icon name="ChevronDown" size={16} className={`preset-dropdown__chevron${open ? ' open' : ''}`} />
      </button>
      {open && (
        <div className="preset-dropdown__menu">
          {fonts.map((f) => (
            <button
              key={f}
              className={`preset-dropdown__item${f === active ? ' active' : ''}`}
              style={{ fontFamily: `'${f}', sans-serif` }}
              onClick={() => { onChange(f); setOpen(false); }}
            >
              <span className="preset-dropdown__item-label">{f}</span>
              {f === active && <Icon name="Check" size={16} className="preset-dropdown__check" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FontPairingDropdown({ pairings, activeHeading, activeBody, onSelect }: {
  pairings: FontPairing[];
  activeHeading: string;
  activeBody: string;
  onSelect: (p: FontPairing) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pairings.forEach(p => { loadGoogleFont(p.heading); loadGoogleFont(p.body); });
  }, [pairings]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const activePairing = pairings.find(p => p.heading === activeHeading && p.body === activeBody);

  return (
    <div className="preset-dropdown" ref={ref}>
      <button className="preset-dropdown__trigger" onClick={() => setOpen(!open)}>
        <span className="preset-dropdown__label">
          {activePairing ? (
            <span className="font-pairing-label">
              <span style={{ fontFamily: `'${activePairing.heading}', sans-serif`, fontWeight: 600 }}>{activePairing.heading}</span>
              <span className="font-pairing-label__sep">+</span>
              <span style={{ fontFamily: `'${activePairing.body}', sans-serif` }}>{activePairing.body}</span>
            </span>
          ) : 'Select a pairing'}
        </span>
        <Icon name="ChevronDown" size={16} className={`preset-dropdown__chevron${open ? ' open' : ''}`} />
      </button>
      {open && (
        <div className="preset-dropdown__menu font-pairing-menu">
          {pairings.map((p, i) => {
            const isActive = p.heading === activeHeading && p.body === activeBody;
            return (
              <button
                key={i}
                className={`preset-dropdown__item font-pairing-item${isActive ? ' active' : ''}`}
                onClick={() => { onSelect(p); setOpen(false); }}
              >
                <div className="font-pairing-item__fonts">
                  <span className="font-pairing-item__heading" style={{ fontFamily: `'${p.heading}', sans-serif` }}>{p.heading}</span>
                  <span className="font-pairing-item__body" style={{ fontFamily: `'${p.body}', sans-serif` }}>{p.body}</span>
                </div>
                <div className="font-pairing-item__tags">
                  {p.tags.map(t => <span key={t} className="font-pairing-item__tag">{t}</span>)}
                </div>
                {isActive && <Icon name="Check" size={16} className="preset-dropdown__check" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getSecondaryColor(primaryHex: string, offsetDegrees: number): string {
  const primaryHue = hexToHslHue(primaryHex);
  const secondaryHue = (primaryHue + offsetDegrees) % 360;
  return hslHueToHex(secondaryHue);
}

export function ThemesView() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { library: activeIconLibrary, iconStyle: activeIconStyle, setLibrary: setIconLibrary, setIconStyle } = useIconLibrary();
  const [activeTab, setActiveTab] = useState<'colors' | 'style' | 'font' | null>(null);
  const [colorMode, setColorMode] = useState<'light' | 'dark'>(() =>
    document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
  );
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [brandHue, setBrandHue] = useState(() => hexToHslHue(DEFAULT_COLOR));
  const [tint, setTint] = useState(DEFAULT_TINT);
  const [font, setFont] = useState(DEFAULT_FONT);
  const [headingFont, setHeadingFont] = useState(DEFAULT_HEADING_FONT);
  const [radius, setRadius] = useState<RadiusScale>(DEFAULT_RADIUS as RadiusScale);
  const [, setPalette] = useState<PaletteShade[]>(() => generatePalette(DEFAULT_COLOR, isDarkMode()));
  const [harmonyOffset, setHarmonyOffset] = useState(DEFAULT_HARMONY);
  const [secondaryEnabled, setSecondaryEnabled] = useState(false);
  const [activePreset, setActivePreset] = useState('Default');

  const applySecondary = useCallback((primaryColor: string, offset: number, dark: boolean) => {
    const secondaryColor = getSecondaryColor(primaryColor, offset);
    const secondaryPalette = generatePalette(secondaryColor, dark);
    applySecondaryPaletteToDOM(secondaryPalette);
  }, []);

  const removeSecondary = useCallback(() => {
    setSecondaryEnabled(false);
    resetSecondaryPalette();
  }, []);

  const addSecondary = useCallback(() => {
    setSecondaryEnabled(true);
    applySecondary(color, harmonyOffset, isDarkMode());
  }, [color, harmonyOffset, applySecondary]);

  const applyHeadingFontToDOM = useCallback((hFont: string, bodyFont: string) => {
    if (hFont) {
      loadGoogleFont(hFont);
      document.documentElement.style.setProperty('--font-family-heading', `'${hFont}', -apple-system, BlinkMacSystemFont, sans-serif`);
    } else {
      document.documentElement.style.setProperty('--font-family-heading', `'${bodyFont}', -apple-system, BlinkMacSystemFont, sans-serif`);
    }
  }, []);

  const applyPreset = useCallback((preset: ThemePreset) => {
    setActivePreset(preset.name);
    setColor(preset.color);
    setBrandHue(hexToHslHue(preset.color));
    const newPalette = generatePalette(preset.color, preset.mode === 'dark');
    setPalette(newPalette);
    applyPaletteToDOM(newPalette);
    setHarmonyOffset(preset.harmonyOffset);
    if (secondaryEnabled) {
      applySecondary(preset.color, preset.harmonyOffset, preset.mode === 'dark');
    }
    setTint(preset.tint);
    applyNeutralToDOM(generateNeutralPalette(preset.color, preset.tint, preset.mode === 'dark'));
    setFont(preset.font);
    loadGoogleFont(preset.font);
    document.documentElement.style.setProperty('--font-family', `'${preset.font}', -apple-system, BlinkMacSystemFont, sans-serif`);
    setHeadingFont(preset.headingFont);
    applyHeadingFontToDOM(preset.headingFont, preset.font);
    setRadius(preset.radius);
    applyRadius(preset.radius, canvasRef.current);
    loadLibrary(preset.iconLibrary, 'outline').then(() => {
      setIconLibrary(preset.iconLibrary);
      setIconStyle('outline');
    });
    setColorMode(preset.mode);
    if (preset.mode === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('jf-lib-theme', preset.mode);
  }, [secondaryEnabled, applySecondary, applyHeadingFontToDOM, setIconLibrary, setIconStyle]);

  const handleColorChange = useCallback((newColor: string) => {
    setColor(newColor);
    setBrandHue(hexToHslHue(newColor));
    const newPalette = generatePalette(newColor, isDarkMode());
    setPalette(newPalette);
    applyPaletteToDOM(newPalette);
    if (secondaryEnabled) {
      applySecondary(newColor, harmonyOffset, isDarkMode());
    }
    applyNeutralToDOM(generateNeutralPalette(newColor, tint, isDarkMode()));
  }, [tint, harmonyOffset, secondaryEnabled, applySecondary]);

  const handleHueChange = useCallback((hue: number) => {
    setBrandHue(hue);
    const newColor = hslHueToHex(hue);
    setColor(newColor);
    const newPalette = generatePalette(newColor, isDarkMode());
    setPalette(newPalette);
    applyPaletteToDOM(newPalette);
    if (secondaryEnabled) {
      applySecondary(newColor, harmonyOffset, isDarkMode());
    }
    applyNeutralToDOM(generateNeutralPalette(newColor, tint, isDarkMode()));
  }, [tint, harmonyOffset, secondaryEnabled, applySecondary]);

  const handleTintChange = useCallback((newTint: number) => {
    setTint(newTint);
    const neutralPalette = generateNeutralPalette(color, newTint, isDarkMode());
    applyNeutralToDOM(neutralPalette);
  }, [color]);

  const handleHarmonyChange = useCallback((offset: number) => {
    setHarmonyOffset(offset);
    if (secondaryEnabled) {
      applySecondary(color, offset, isDarkMode());
    }
  }, [color, secondaryEnabled, applySecondary]);

  const handleFontChange = useCallback((newFont: string) => {
    setFont(newFont);
    loadGoogleFont(newFont);
    document.documentElement.style.setProperty('--font-family', `'${newFont}', -apple-system, BlinkMacSystemFont, sans-serif`);
    setHeadingFont((prev) => {
      if (!prev) {
        document.documentElement.style.setProperty('--font-family-heading', `'${newFont}', -apple-system, BlinkMacSystemFont, sans-serif`);
      }
      return prev;
    });
  }, []);

  const handleHeadingFontChange = useCallback((newFont: string) => {
    setHeadingFont(newFont);
    setFont((currentBody) => {
      applyHeadingFontToDOM(newFont, currentBody);
      return currentBody;
    });
  }, [applyHeadingFontToDOM]);

  const handlePairingSelect = useCallback((pairing: FontPairing) => {
    setFont(pairing.body);
    loadGoogleFont(pairing.body);
    document.documentElement.style.setProperty('--font-family', `'${pairing.body}', -apple-system, BlinkMacSystemFont, sans-serif`);
    setHeadingFont(pairing.heading);
    applyHeadingFontToDOM(pairing.heading, pairing.body);
  }, [applyHeadingFontToDOM]);

  const handleIconLibraryChange = useCallback(async (lib: IconLibrary) => {
    await loadLibrary(lib, 'outline');
    setIconLibrary(lib);
    setIconStyle('outline');
  }, [setIconLibrary, setIconStyle]);

  const handleIconStyleChange = useCallback(async (style: IconStyle) => {
    await loadLibrary(activeIconLibrary, style);
    setIconStyle(style);
  }, [activeIconLibrary, setIconStyle]);

  const handleRadiusChange = useCallback((scale: RadiusScale) => {
    setRadius(scale);
    applyRadius(scale, canvasRef.current);
  }, []);

  const handleReset = useCallback(() => {
    setColor(DEFAULT_COLOR);
    setBrandHue(hexToHslHue(DEFAULT_COLOR));
    setTint(DEFAULT_TINT);
    setHarmonyOffset(DEFAULT_HARMONY);
    setSecondaryEnabled(false);
    setFont(DEFAULT_FONT);
    setHeadingFont(DEFAULT_HEADING_FONT);
    setRadius(DEFAULT_RADIUS as RadiusScale);
    const newPalette = generatePalette(DEFAULT_COLOR, isDarkMode());
    setPalette(newPalette);
    resetPalette();
    resetSecondaryPalette();
    resetNeutral();
    resetRadius(canvasRef.current);
    document.documentElement.style.removeProperty('--font-family');
    document.documentElement.style.removeProperty('--font-family-heading');
  }, []);

  const handleColorModeChange = useCallback((mode: 'light' | 'dark') => {
    setColorMode(mode);
    if (mode === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('jf-lib-theme', mode);
  }, []);

  const handleTabToggle = useCallback((tab: 'colors' | 'style' | 'font') => {
    setActiveTab((prev) => (prev === tab ? null : tab));
  }, []);

  // Apply palette + neutrals + secondary whenever dependencies change, and on theme toggle
  useEffect(() => {
    const palette = generatePalette(color, isDarkMode());
    applyPaletteToDOM(palette);
    if (secondaryEnabled) {
      applySecondary(color, harmonyOffset, isDarkMode());
    } else {
      resetSecondaryPalette();
    }
    applyNeutralToDOM(generateNeutralPalette(color, tint, isDarkMode()));

    const observer = new MutationObserver(() => {
      applyPaletteToDOM(generatePalette(color, isDarkMode()));
      if (secondaryEnabled) {
        applySecondary(color, harmonyOffset, isDarkMode());
      }
      applyNeutralToDOM(generateNeutralPalette(color, tint, isDarkMode()));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      observer.disconnect();
    };
  }, [color, tint, harmonyOffset, secondaryEnabled, applySecondary]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetPalette();
      resetSecondaryPalette();
      resetNeutral();
      resetRadius(canvasRef.current);
      document.documentElement.style.removeProperty('--font-family');
      document.documentElement.style.removeProperty('--font-family-heading');
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

        {secondaryEnabled ? (
          <div className="themes-view__sidebar-section">
            <div className="themes-view__section-header">
              <h3 className="themes-view__sidebar-title">Secondary Color</h3>
              <button className="themes-view__remove-btn" onClick={removeSecondary} title="Remove secondary color">
                <Icon name="Trash2" size={14} />
              </button>
            </div>
            <div className="themes-view__secondary-color-row">
              <div className="themes-view__harmony-preview" style={{ background: getSecondaryColor(color, harmonyOffset) }} />
              <span className="themes-view__secondary-hex">{getSecondaryColor(color, harmonyOffset)}</span>
            </div>
            <div className="themes-view__harmony-slider">
              <div className="themes-view__harmony-row">
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={harmonyOffset}
                  onChange={(e) => handleHarmonyChange(Number(e.target.value))}
                  className="themes-view__harmony-range"
                  style={{
                    background: `linear-gradient(to right, ${color}, ${getSecondaryColor(color, harmonyOffset)})`,
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="themes-view__sidebar-section">
            <button className="themes-view__add-secondary" onClick={addSecondary}>
              <Icon name="Plus" size={16} />
              <span>Add secondary color scale</span>
            </button>
          </div>
        )}

        <div className="themes-view__sidebar-section">
          <h3 className="themes-view__sidebar-title">Theme Presets</h3>
          <PresetDropdown presets={THEME_PRESETS} active={activePreset} onSelect={applyPreset} />
        </div>

        <div className="themes-view__sidebar-section">
          <h3 className="themes-view__sidebar-title">Font Pairing</h3>
          <FontPairingDropdown
            pairings={FONT_PAIRINGS}
            activeHeading={headingFont || font}
            activeBody={font}
            onSelect={handlePairingSelect}
          />
        </div>

        <div className="themes-view__sidebar-section">
          <h3 className="themes-view__sidebar-title">Body Font</h3>
          <FontDropdown fonts={FONT_OPTIONS} active={font} onChange={handleFontChange} />
        </div>

        <div className="themes-view__sidebar-section">
          <h3 className="themes-view__sidebar-title">Heading Font</h3>
          <FontDropdown fonts={HEADING_FONT_OPTIONS} active={headingFont || font} onChange={handleHeadingFontChange} />
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

        <div className="themes-view__sidebar-section">
          <h3 className="themes-view__sidebar-title">Icon Library</h3>
          <div className="themes-view__icon-library-options">
            {ICON_LIBRARIES.map(({ value, label }) => (
              <button
                key={value}
                className={`themes-view__icon-library-btn${activeIconLibrary === value ? ' active' : ''}`}
                onClick={() => handleIconLibraryChange(value)}
              >
                {label}
              </button>
            ))}
          </div>
          {ICON_LIBRARIES.find(l => l.value === activeIconLibrary)?.hasFill && (
            <div className="themes-view__icon-style-toggle">
              <button
                className={`themes-view__icon-style-btn${activeIconStyle === 'outline' ? ' active' : ''}`}
                onClick={() => handleIconStyleChange('outline')}
              >
                Outline
              </button>
              <button
                className={`themes-view__icon-style-btn${activeIconStyle === 'fill' ? ' active' : ''}`}
                onClick={() => handleIconStyleChange('fill')}
              >
                Fill
              </button>
            </div>
          )}
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

      {/* Mobile: bottom tab bar + bottom sheets */}
      <div className="themes-bottom-bar">
        <button
          className={`themes-bottom-bar__tab${activeTab === 'colors' ? ' active' : ''}`}
          onClick={() => handleTabToggle('colors')}
        >
          <Icon name="Palette" size={20} />
          <span>Colors</span>
        </button>
        <button
          className={`themes-bottom-bar__tab${activeTab === 'style' ? ' active' : ''}`}
          onClick={() => handleTabToggle('style')}
        >
          <Icon name="Contrast" size={20} />
          <span>Style</span>
        </button>
        <button
          className={`themes-bottom-bar__tab${activeTab === 'font' ? ' active' : ''}`}
          onClick={() => handleTabToggle('font')}
        >
          <Icon name="Type" size={20} />
          <span>Font</span>
        </button>
      </div>

      <BottomSheet open={activeTab === 'colors'} onClose={() => setActiveTab(null)} title="Colors" noOverlay>
        <div className="themes-sheet-content">
          <div className="themes-sheet-content__section">
            <h3 className="themes-view__sidebar-title">Theme Presets</h3>
            <div className="themes-view__preset-dropdown-wrapper">
              <select
                className="themes-view__preset-dropdown"
                value={activePreset}
                onChange={(e) => {
                  const preset = THEME_PRESETS.find(p => p.name === e.target.value);
                  if (preset) applyPreset(preset);
                }}
              >
                {THEME_PRESETS.map((p) => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="themes-sheet-content__section">
            <h3 className="themes-view__sidebar-title">Custom Color</h3>
            <div className="themes-sheet-content__presets-row">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  className={`themes-sheet-content__color-circle${color.toUpperCase() === c ? ' active' : ''}`}
                  style={{ background: c }}
                  onClick={() => { handleColorChange(c); setActivePreset(''); }}
                  title={c}
                />
              ))}
            </div>
          </div>
          {secondaryEnabled ? (
            <div className="themes-sheet-content__section">
              <div className="themes-view__section-header">
                <h3 className="themes-view__sidebar-title">Secondary Color</h3>
                <button className="themes-view__remove-btn" onClick={removeSecondary} title="Remove secondary color">
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
              <div className="themes-view__secondary-color-row">
                <div className="themes-view__harmony-preview" style={{ background: getSecondaryColor(color, harmonyOffset) }} />
                <span className="themes-view__secondary-hex">{getSecondaryColor(color, harmonyOffset)}</span>
              </div>
              <div className="themes-view__harmony-slider">
                <div className="themes-view__harmony-row">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={harmonyOffset}
                    onChange={(e) => handleHarmonyChange(Number(e.target.value))}
                    className="themes-view__harmony-range"
                    style={{
                      background: `linear-gradient(to right, ${color}, ${getSecondaryColor(color, harmonyOffset)})`,
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="themes-sheet-content__section">
              <button className="themes-view__add-secondary" onClick={addSecondary}>
                <Icon name="Plus" size={16} />
                <span>Add secondary color scale</span>
              </button>
            </div>
          )}
        </div>
      </BottomSheet>

      <BottomSheet open={activeTab === 'style'} onClose={() => setActiveTab(null)} title="Style" noOverlay>
        <div className="themes-sheet-content">
          <div className="themes-sheet-content__section">
            <h3 className="themes-view__sidebar-title">Color Mode</h3>
            <div className="themes-sheet-content__segmented">
              <button
                className={`themes-sheet-content__seg-btn${colorMode === 'light' ? ' active' : ''}`}
                onClick={() => handleColorModeChange('light')}
              >
                Light
              </button>
              <button
                className={`themes-sheet-content__seg-btn${colorMode === 'dark' ? ' active' : ''}`}
                onClick={() => handleColorModeChange('dark')}
              >
                Dark
              </button>
            </div>
          </div>
          <div className="themes-sheet-content__section">
            <h3 className="themes-view__sidebar-title">Radius</h3>
            <div className="themes-sheet-content__segmented">
              {RADIUS_MODES.map(({ scale }) => (
                <button
                  key={scale}
                  className={`themes-sheet-content__seg-btn${radius === scale ? ' active' : ''}`}
                  onClick={() => handleRadiusChange(scale)}
                >
                  {scale}
                </button>
              ))}
            </div>
          </div>
          <div className="themes-sheet-content__section">
            <h3 className="themes-view__sidebar-title">Icon Library</h3>
            <div className="themes-sheet-content__segmented">
              {ICON_LIBRARIES.map(({ value, label }) => (
                <button
                  key={value}
                  className={`themes-sheet-content__seg-btn${activeIconLibrary === value ? ' active' : ''}`}
                  onClick={() => handleIconLibraryChange(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {ICON_LIBRARIES.find(l => l.value === activeIconLibrary)?.hasFill && (
            <div className="themes-sheet-content__section">
              <h3 className="themes-view__sidebar-title">Icon Style</h3>
              <div className="themes-sheet-content__segmented">
                <button
                  className={`themes-sheet-content__seg-btn${activeIconStyle === 'outline' ? ' active' : ''}`}
                  onClick={() => handleIconStyleChange('outline')}
                >
                  Outline
                </button>
                <button
                  className={`themes-sheet-content__seg-btn${activeIconStyle === 'fill' ? ' active' : ''}`}
                  onClick={() => handleIconStyleChange('fill')}
                >
                  Fill
                </button>
              </div>
            </div>
          )}
        </div>
      </BottomSheet>

      <BottomSheet open={activeTab === 'font'} onClose={() => setActiveTab(null)} title="Font" noOverlay>
        <div className="themes-sheet-content">
          <div className="themes-sheet-content__section">
            <h3 className="themes-view__sidebar-title">Font Pairing</h3>
            <FontPairingDropdown
              pairings={FONT_PAIRINGS}
              activeHeading={headingFont || font}
              activeBody={font}
              onSelect={handlePairingSelect}
            />
          </div>
          <div className="themes-sheet-content__section">
            <h3 className="themes-view__sidebar-title">Body Font</h3>
            <FontDropdown fonts={FONT_OPTIONS} active={font} onChange={handleFontChange} />
          </div>
          <div className="themes-sheet-content__section">
            <h3 className="themes-view__sidebar-title">Heading Font</h3>
            <FontDropdown fonts={HEADING_FONT_OPTIONS} active={headingFont || font} onChange={handleHeadingFontChange} />
          </div>
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
            <ProductList title="Featured Products" buttonLabel="Add to Cart" products={[
              { name: 'Wireless Headphones', price: '$79.99', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop' },
              { name: 'Smart Watch', price: '$199.99', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop' },
              { name: 'Leather Bag', price: '$129.99', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop' },
              { name: 'Running Shoes', price: '$89.99', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop' },
            ]} />
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
              <Table label="Submissions" description="View all form responses" />
              <Document alignment="Left" size="Normal" fileName="Brand Guidelines.pdf" description="4.2 MB - PDF Document" />
            </div>
          </section>

          {/* Open Form */}
          <section className="themes-view__section">
            <Heading size="Small" heading="Registration" subheading="Fill out the form below" />
            <Form showForm />
          </section>

          {/* Testimonial */}
          <section className="themes-view__section">
            <Testimonial items={[
              { name: 'Sarah Johnson', text: '\u201CThis platform transformed how we collect donations. The interface is intuitive and our donors love it.\u201D', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face' },
              { name: 'Michael Chen', text: '\u201CSetup was incredibly easy. We were up and running in minutes, not days.\u201D', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face' },
              { name: 'Emily Davis', text: '\u201CThe best investment we made for our nonprofit. Highly recommended!\u201D', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face' },
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
