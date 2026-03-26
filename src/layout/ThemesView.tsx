import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { Icon } from '../components/Icon/Icon';
import { useIconLibrary, type IconLibrary, type IconStyle } from '../context/IconLibraryContext';
import { ICON_LIBRARIES, loadLibrary } from '../utils/iconRegistry';
import { BottomSheet } from './components/BottomSheet';
import { generatePalette, applySecondaryPaletteToDOM, resetSecondaryPalette } from '../utils/colorPalette';
import type { PaletteShade } from '../utils/colorPalette';
import { generateNeutralPalette, applyNeutralToDOM, resetNeutral } from '../utils/neutralTint';
import { ColorPicker } from './components/ColorPicker';
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
import { DailyTaskManager } from '../components/DailyTaskManager/DailyTaskManager';

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

interface ColorScheme {
  brand: string;
  surface: string;
  text: string;
}

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
  scheme: ColorScheme;
}

// Light presets (top row: custom + 4 light)
const LIGHT_PRESETS: ThemePreset[] = [
  { name: 'Default', color: '#7D38EF', font: 'Inter', headingFont: '', iconLibrary: 'lucide', radius: 'Medium', tint: 50, mode: 'light', harmonyOffset: 150, scheme: { brand: '#7D38EF', surface: '#EDE8FE', text: '#7D38EF' } },
  { name: 'Ocean Breeze', color: '#0385C8', font: 'DM Sans', headingFont: 'Playfair Display', iconLibrary: 'lucide', radius: 'Large', tint: 30, mode: 'light', harmonyOffset: 150, scheme: { brand: '#0385C8', surface: '#D3E9FF', text: '#0385C8' } },
  { name: 'Sunset', color: '#F97101', font: 'Bricolage Grotesque', headingFont: '', iconLibrary: 'lucide', radius: 'Large', tint: 60, mode: 'light', harmonyOffset: 180, scheme: { brand: '#F97101', surface: '#FEF3C5', text: '#F97101' } },
  { name: 'Forest', color: '#19A44B', font: 'Public Sans', headingFont: 'Lora', iconLibrary: 'tabler', radius: 'Small', tint: 40, mode: 'light', harmonyOffset: 120, scheme: { brand: '#19A44B', surface: '#DDFBE8', text: '#19A44B' } },
];

// Dark presets (bottom row: 5 dark)
const DARK_PRESETS: ThemePreset[] = [
  { name: 'Dark Elegance', color: '#8D5DF9', font: 'Figtree', headingFont: 'Playfair Display', iconLibrary: 'phosphor', radius: 'XLarge', tint: 70, mode: 'dark', harmonyOffset: 160, scheme: { brand: '#8D5DF9', surface: '#F0EBFE', text: '#8D5DF9' } },
  { name: 'Cherry Night', color: '#DF2125', font: 'Instrument Sans', headingFont: 'Merriweather', iconLibrary: 'lucide', radius: 'Medium', tint: 35, mode: 'dark', harmonyOffset: 150, scheme: { brand: '#DF2125', surface: '#FDE8E8', text: '#DF2125' } },
  { name: 'Aqua Night', color: '#00B5D4', font: 'JetBrains Mono', headingFont: '', iconLibrary: 'lucide', radius: 'Medium', tint: 25, mode: 'dark', harmonyOffset: 150, scheme: { brand: '#00B5D4', surface: '#DDF3FF', text: '#00B5D4' } },
  { name: 'Cozy', color: '#8B5E3C', font: 'Lora', headingFont: 'Playfair Display', iconLibrary: 'lucide', radius: 'Large', tint: 80, mode: 'dark', harmonyOffset: 150, scheme: { brand: '#8B5E3C', surface: '#F5EDE6', text: '#8B5E3C' } },
  { name: 'Monochrome', color: '#353C6A', font: 'IBM Plex Mono', headingFont: '', iconLibrary: 'tabler', radius: 'Small', tint: 0, mode: 'dark', harmonyOffset: 150, scheme: { brand: '#353C6A', surface: '#DADEF3', text: '#353C6A' } },
];

const THEME_PRESETS: ThemePreset[] = [...LIGHT_PRESETS, ...DARK_PRESETS];

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
        <span className="preset-dropdown__label font-preview" style={{ fontFamily: `'${active}', sans-serif` }}>{active}</span>
        <Icon name="ChevronDown" size={16} className={`preset-dropdown__chevron${open ? ' open' : ''}`} />
      </button>
      {open && (
        <div className="preset-dropdown__menu">
          {fonts.map((f) => (
            <button
              key={f}
              className={`preset-dropdown__item font-preview${f === active ? ' active' : ''}`}
              style={{ fontFamily: `'${f}', sans-serif` }}
              onClick={() => { onChange(f); setOpen(false); }}
            >
              <span className="preset-dropdown__item-label font-preview">{f}</span>
              {f === active && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="preset-dropdown__check"><path d="M20 6 9 17l-5-5"/></svg>}
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
              <span className="font-preview" style={{ fontFamily: `'${activePairing.heading}', sans-serif`, fontWeight: 600 }}>{activePairing.heading}</span>
              <span className="font-pairing-label__sep">+</span>
              <span className="font-preview" style={{ fontFamily: `'${activePairing.body}', sans-serif` }}>{activePairing.body}</span>
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
                  <span className="font-pairing-item__heading font-preview" style={{ fontFamily: `'${p.heading}', sans-serif` }}>{p.heading}</span>
                  <span className="font-pairing-item__body font-preview" style={{ fontFamily: `'${p.body}', sans-serif` }}>{p.body}</span>
                </div>
                {isActive && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="preset-dropdown__check"><path d="M20 6 9 17l-5-5"/></svg>}
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

  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedPreviewItem, setSelectedPreviewItem] = useState<string | null>(null);
  const togglePreviewSelect = useCallback((id: string) => {
    setSelectedPreviewItem(prev => prev === id ? null : id);
  }, []);
  const [pickerPos, setPickerPos] = useState({ top: 0, left: 0 });
  const [customColorChanged, setCustomColorChanged] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const customBtnRef = useRef<HTMLButtonElement>(null);

  // Close picker on outside click
  useEffect(() => {
    if (!pickerOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [pickerOpen]);

  const sidebarContent: ReactNode = (
    <>
        <div className="themes-view__sidebar-section">
          <h3 className="themes-view__sidebar-title">Themes</h3>
          <div className="color-theme-grid">
            {/* Custom color button */}
            <div className="color-theme-grid__custom-wrapper" ref={pickerRef}>
              <button
                ref={customBtnRef}
                className={`color-theme-grid__custom${activePreset === '' ? ' active' : ''}${activePreset === '' && customColorChanged ? ' customized' : ''}`}
                style={activePreset === '' ? { background: color } : undefined}
                onClick={() => {
                  if (activePreset !== '') {
                    setActivePreset('');
                    setCustomColorChanged(false);
                  }
                  if (!pickerOpen && customBtnRef.current) {
                    const rect = customBtnRef.current.getBoundingClientRect();
                    setPickerPos({ top: rect.bottom + 8, left: rect.left });
                  }
                  setPickerOpen(!pickerOpen);
                }}
                title="Custom color"
              >
                <div className="color-theme-grid__custom-inner">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </button>
              {pickerOpen && (
                <div className="color-theme-grid__picker-popup" style={{ top: pickerPos.top, left: pickerPos.left }}>
                  <ColorPicker color={color} onChange={(c) => { setCustomColorChanged(true); handleColorChange(c); }} tint={tint} onTintChange={handleTintChange} />
                </div>
              )}
            </div>
            {THEME_PRESETS.map((preset) => {
              loadGoogleFont(preset.headingFont || preset.font);
              return (
              <button
                key={preset.name}
                className={`color-theme-grid__item${activePreset === preset.name ? ' active' : ''}`}
                onClick={() => { applyPreset(preset); setPickerOpen(false); setCustomColorChanged(false); }}
                title={preset.name}
              >
                <div className="color-theme-grid__outer" style={{ backgroundColor: preset.color }} />
              </button>
              );
            })}
          </div>
        </div>

        {/* Secondary color section hidden for now */}

        <div className="themes-view__sidebar-section">
          <h3 className="themes-view__sidebar-title">Appearing</h3>
          <div className="themes-view__appearing-options">
            {(['light', 'dark'] as const).map((mode) => (
              <button
                key={mode}
                className={`themes-view__appearing-btn${colorMode === mode ? ' active' : ''}`}
                onClick={() => handleColorModeChange(mode)}
              >
                {mode === 'light' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
                <span>{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
              </button>
            ))}
          </div>
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
          <h3 className="themes-view__sidebar-title">Heading Font</h3>
          <FontDropdown fonts={HEADING_FONT_OPTIONS} active={headingFont || font} onChange={handleHeadingFontChange} />
        </div>

        <div className="themes-view__sidebar-section">
          <h3 className="themes-view__sidebar-title">Body Font</h3>
          <FontDropdown fonts={FONT_OPTIONS} active={font} onChange={handleFontChange} />
        </div>

        <div className="themes-view__sidebar-section">
          <h3 className="themes-view__sidebar-title">Border Radius</h3>
          <div className="themes-view__radius-options">
            {RADIUS_MODES.map(({ scale, lg }) => {
              const r = parseInt(lg);
              return (
                <button
                  key={scale}
                  className={`themes-view__radius-btn${radius === scale ? ' active' : ''}`}
                  onClick={() => handleRadiusChange(scale)}
                  title={scale}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d={`M4 24 V${r} Q4 4 ${r} 4 H24`} strokeLinecap="round" />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>

        <div className="themes-view__sidebar-section">
          <h3 className="themes-view__sidebar-title">Icon Style</h3>
          <div className="themes-view__icon-library-options themes-view__icon-library-options--4col">
            {([
              { lib: 'lucide' as const, style: 'outline' as const, svg: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
              )},
              { lib: 'phosphor' as const, style: 'outline' as const, svg: (
                <svg width="24" height="24" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="32" y="48" width="192" height="160" rx="8"/><circle cx="96" cy="112" r="20"/><path d="M224,168l-44.69-44.69a8,8,0,0,0-11.31,0L100.69,190.6,83.31,173.31a8,8,0,0,0-11.31,0L32,213.09"/>
                </svg>
              )},
              { lib: 'tabler' as const, style: 'outline' as const, svg: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 8h.01"/><rect width="16" height="16" x="4" y="4" rx="3"/><path d="m4 15 4-4a3 5 0 0 1 3 0l5 5"/><path d="m14 14 1-1a3 5 0 0 1 3 0l2 2"/>
                </svg>
              )},
              { lib: 'phosphor' as const, style: 'fill' as const, svg: (
                <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm-60,64a12,12,0,1,1,12,12A12,12,0,0,1,156,104ZM40,200V172l52-52,80,80Zm176,0H194.63l-56-56,20-20L216,181.38Z"/>
                </svg>
              )},
            ]).map(({ lib, style, svg }) => {
              const isActive = activeIconLibrary === lib && activeIconStyle === style;
              return (
                <button
                  key={`${lib}-${style}`}
                  className={`themes-view__icon-library-btn${isActive ? ' active' : ''}`}
                  onClick={() => { handleIconLibraryChange(lib); handleIconStyleChange(style); }}
                >
                  {svg}
                </button>
              );
            })}
          </div>
        </div>

    </>
  );

  return (
    <div className="themes-view">
      {/* Left: Settings Panel (desktop) */}
      <aside className="themes-view__sidebar" data-theme="dark">
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
            <div onClick={() => togglePreviewSelect('hero-heading')} style={{ cursor: 'pointer' }}>
              <Heading selected={selectedPreviewItem === 'hero-heading'} size="Large" alignment="Center" heading="Welcome to Our Store" subheading="Discover amazing products and support our mission." />
            </div>
            <div className="themes-view__btn-row">
              <Button variant="Default" size="Default" label="Get Started" leftIcon="ArrowRight" rightIcon="none" shrinked />
              <Button variant="Outlined" size="Default" label="Learn More" leftIcon="none" rightIcon="none" shrinked />
            </div>
          </section>

          {/* Products */}
          <section className="themes-view__section">
            <div onClick={() => togglePreviewSelect('products')} style={{ cursor: 'pointer' }}>
              <ProductList selected={selectedPreviewItem === 'products'} title="Featured Products" buttonLabel="Add to Cart" products={[
                { name: 'Wireless Headphones', price: '$79.99', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop' },
                { name: 'Smart Watch', price: '$199.99', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop' },
                { name: 'Leather Bag', price: '$129.99', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop' },
                { name: 'Running Shoes', price: '$89.99', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop' },
              ]} />
            </div>
          </section>

          {/* Cards Row */}
          <section className="themes-view__section">
            <div onClick={() => togglePreviewSelect('services-heading')} style={{ cursor: 'pointer' }}>
              <Heading selected={selectedPreviewItem === 'services-heading'} size="Small" heading="Our Services" subheading="What we offer" />
            </div>
            <div onClick={() => togglePreviewSelect('card-1')} style={{ cursor: 'pointer' }}>
              <Card selected={selectedPreviewItem === 'card-1'} imageStyle="Icon" layout="Horizontal" action="Button" iconName="MessageCircle" title="Consulting" description="Expert guidance for your business" buttonLabel="Book Now" />
            </div>
            <div onClick={() => togglePreviewSelect('card-2')} style={{ cursor: 'pointer' }}>
              <Card selected={selectedPreviewItem === 'card-2'} imageStyle="Icon" layout="Horizontal" action="Button" iconName="Palette" title="Design" description="Beautiful interfaces that convert" buttonLabel="View Work" />
            </div>
            <div onClick={() => togglePreviewSelect('card-3')} style={{ cursor: 'pointer' }}>
              <Card selected={selectedPreviewItem === 'card-3'} imageStyle="Icon" layout="Horizontal" action="Button" iconName="Code" title="Development" description="Scalable solutions built to last" buttonLabel="Start Project" />
            </div>
            <div onClick={() => togglePreviewSelect('daily-tasks')} style={{ cursor: 'pointer' }}>
              <DailyTaskManager selected={selectedPreviewItem === 'daily-tasks'} />
            </div>
          </section>

          {/* List Section */}
          <section className="themes-view__section">
            <div onClick={() => togglePreviewSelect('updates-heading')} style={{ cursor: 'pointer' }}>
              <Heading selected={selectedPreviewItem === 'updates-heading'} size="Small" heading="Recent Updates" subheading="Stay up to date" />
            </div>
            <div onClick={() => togglePreviewSelect('list')} style={{ cursor: 'pointer' }}>
              <List selected={selectedPreviewItem === 'list'} layout="Basic" imageStyle="Square" size="Compact" action="Icon" actionIconFilled={false} items={[
                { title: 'New feature release v2.5', description: 'Performance improvements and bug fixes' },
                { title: 'Community meetup next week', description: 'Join us for the monthly gathering' },
                { title: 'Partnership announcement', description: 'Exciting collaboration coming soon' },
              ]} />
            </div>
          </section>

          {/* Documents & Forms Row */}
          <section className="themes-view__section">
            <div onClick={() => togglePreviewSelect('resources-heading')} style={{ cursor: 'pointer' }}>
              <Heading selected={selectedPreviewItem === 'resources-heading'} size="Small" heading="Resources" subheading="Forms and documents" />
            </div>
            <div className="themes-view__docs-row">
              <div onClick={() => togglePreviewSelect('form-1')} style={{ cursor: 'pointer' }}>
                <Form selected={selectedPreviewItem === 'form-1'} label="Contact Form" description="Get in touch with us" />
              </div>
              <div onClick={() => togglePreviewSelect('sign-doc')} style={{ cursor: 'pointer' }}>
                <SignDocument selected={selectedPreviewItem === 'sign-doc'} label="Terms of Service" description="Required before proceeding" />
              </div>
              <div onClick={() => togglePreviewSelect('table')} style={{ cursor: 'pointer' }}>
                <Table selected={selectedPreviewItem === 'table'} label="Submissions" description="View all form responses" />
              </div>
              <div onClick={() => togglePreviewSelect('document')} style={{ cursor: 'pointer' }}>
                <Document selected={selectedPreviewItem === 'document'} alignment="Left" size="Normal" fileName="Brand Guidelines.pdf" description="4.2 MB - PDF Document" />
              </div>
            </div>
          </section>

          {/* Open Form */}
          <section className="themes-view__section">
            <div onClick={() => togglePreviewSelect('reg-heading')} style={{ cursor: 'pointer' }}>
              <Heading selected={selectedPreviewItem === 'reg-heading'} size="Small" heading="Registration" subheading="Fill out the form below" />
            </div>
            <div onClick={() => togglePreviewSelect('form-2')} style={{ cursor: 'pointer' }}>
              <Form selected={selectedPreviewItem === 'form-2'} showForm />
            </div>
          </section>

          {/* Testimonial */}
          <section className="themes-view__section">
            <div onClick={() => togglePreviewSelect('testimonial')} style={{ cursor: 'pointer' }}>
              <Testimonial selected={selectedPreviewItem === 'testimonial'} items={[
                { name: 'Sarah Johnson', text: '\u201CThis platform transformed how we collect donations. The interface is intuitive and our donors love it.\u201D', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face' },
                { name: 'Michael Chen', text: '\u201CSetup was incredibly easy. We were up and running in minutes, not days.\u201D', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face' },
                { name: 'Emily Davis', text: '\u201CThe best investment we made for our nonprofit. Highly recommended!\u201D', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face' },
              ]} />
            </div>
          </section>

          {/* Donation */}
          <section className="themes-view__section themes-view__section--center">
            <div onClick={() => togglePreviewSelect('donation')} style={{ cursor: 'pointer' }}>
              <DonationBox
                selected={selectedPreviewItem === 'donation'}
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
            </div>
          </section>

          {/* Footer: Social + Buttons */}
          <section className="themes-view__section themes-view__section--center themes-view__section--footer">
            <div onClick={() => togglePreviewSelect('social')} style={{ cursor: 'pointer' }}>
              <SocialFollow selected={selectedPreviewItem === 'social'} filled />
            </div>
          </section>
        </div>
        </div>
      </main>
    </div>
  );
}
