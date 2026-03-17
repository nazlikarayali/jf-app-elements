import { useState, useEffect, useCallback } from 'react';
import { generatePalette } from '../utils/colorPalette';
import type { PaletteShade } from '../utils/colorPalette';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Heading } from '../components/Heading';
import { DonationBox } from '../components/DonationBox';
import { Document } from '../components/Document';
import { SignDocument } from '../components/SignDocument';
import { Form } from '../components/Form';
import { SocialFollow } from '../components/SocialFollow';
import { List } from '../components/List';
import { ProductList } from '../components/ProductList';

const DEFAULT_COLOR = '#7D38EF';
const DEFAULT_FONT = 'Inter';

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

function applyPaletteToDOM(palette: PaletteShade[]) {
  const root = document.documentElement;
  const map: Record<string, string> = {};
  for (const shade of palette) {
    map[shade.key] = shade.hex;
  }

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

  root.style.setProperty('--bg-surface-brand', map['100']);
  root.style.setProperty('--bg-surface-brand-hover', map['200']);
  root.style.setProperty('--bg-fill-brand', map['600']);
  root.style.setProperty('--bg-fill-brand-hover', map['700']);
  root.style.setProperty('--bg-fill-brand-active', map['700']);
  root.style.setProperty('--bg-fill-brand-disabled', map['200']);
  root.style.setProperty('--fg-brand', map['600']);
  root.style.setProperty('--fg-brand-hover', map['700']);
  root.style.setProperty('--border-brand', map['200']);
  root.style.setProperty('--color-primary', map['600']);
  root.style.setProperty('--color-primary-hover', map['700']);
  root.style.setProperty('--color-primary-light', map['50']);
}

function resetPalette() {
  const root = document.documentElement;
  const props = [
    '--primary-50', '--primary-100', '--primary-200', '--primary-300', '--primary-400',
    '--primary-500', '--primary-600', '--primary-700', '--primary-800', '--primary-900', '--primary-950',
    '--bg-surface-brand', '--bg-surface-brand-hover',
    '--bg-fill-brand', '--bg-fill-brand-hover', '--bg-fill-brand-active', '--bg-fill-brand-disabled',
    '--fg-brand', '--fg-brand-hover', '--border-brand',
    '--color-primary', '--color-primary-hover', '--color-primary-light',
  ];
  props.forEach(p => root.style.removeProperty(p));
}

export function ThemesView() {
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [font, setFont] = useState(DEFAULT_FONT);
  const [, setPalette] = useState<PaletteShade[]>(() => generatePalette(DEFAULT_COLOR));

  const handleColorChange = useCallback((newColor: string) => {
    setColor(newColor);
    const newPalette = generatePalette(newColor);
    setPalette(newPalette);
    applyPaletteToDOM(newPalette);
  }, []);

  const handleFontChange = useCallback((newFont: string) => {
    setFont(newFont);
    loadGoogleFont(newFont);
    document.documentElement.style.setProperty('--font-family', `'${newFont}', -apple-system, BlinkMacSystemFont, sans-serif`);
  }, []);

  const handleReset = useCallback(() => {
    setColor(DEFAULT_COLOR);
    setFont(DEFAULT_FONT);
    const newPalette = generatePalette(DEFAULT_COLOR);
    setPalette(newPalette);
    resetPalette();
    document.documentElement.style.removeProperty('--font-family');
  }, []);

  useEffect(() => {
    return () => {
      resetPalette();
      document.documentElement.style.removeProperty('--font-family');
    };
  }, []);

  return (
    <div className="themes-view">
      {/* Left: Settings Panel */}
      <aside className="themes-view__sidebar">
        <div className="themes-view__sidebar-section">
          <h3 className="themes-view__sidebar-title">Brand Color</h3>
          <div className="themes-view__color-input">
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="themes-view__color-swatch"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => {
                if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
                  handleColorChange(e.target.value);
                }
                setColor(e.target.value);
              }}
              className="themes-view__hex-input"
              placeholder="#7D38EF"
            />
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
          <select
            className="themes-view__font-select"
            value={font}
            onChange={(e) => handleFontChange(e.target.value)}
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <button className="themes-view__reset" onClick={handleReset}>Reset to Default</button>
      </aside>

      {/* Right: Preview as App Page */}
      <main className="themes-view__preview">
        <div className="themes-view__canvas">
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
            <Card imageStyle="Icon" layout="Horizontal" action="Button" title="Consulting" description="Expert guidance for your business" buttonLabel="Book Now" />
            <Card imageStyle="Icon" layout="Horizontal" action="Button" title="Design" description="Beautiful interfaces that convert" buttonLabel="View Work" />
            <Card imageStyle="Icon" layout="Horizontal" action="Button" title="Development" description="Scalable solutions built to last" buttonLabel="Start Project" />
          </section>

          {/* List Section */}
          <section className="themes-view__section">
            <Heading size="Small" heading="Recent Updates" subheading="Stay up to date" />
            <List layout="Basic" imageStyle="Square" size="Regular" action="Icon" actionIconFilled={false} items={[
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
            </div>
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
