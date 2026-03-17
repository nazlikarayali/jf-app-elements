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
import { ImageGallery } from '../components/ImageGallery';

const DEFAULT_COLOR = '#7D38EF';

const PRESET_COLORS = [
  '#7D38EF', '#DF2125', '#0385C8', '#19A44B', '#F97101', '#DC7801',
  '#E91E63', '#00B5D4', '#8D5DF9', '#64A501',
];

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
  const [palette, setPalette] = useState<PaletteShade[]>(() => generatePalette(DEFAULT_COLOR));

  const handleColorChange = useCallback((newColor: string) => {
    setColor(newColor);
    const newPalette = generatePalette(newColor);
    setPalette(newPalette);
    applyPaletteToDOM(newPalette);
  }, []);

  const handleReset = useCallback(() => {
    setColor(DEFAULT_COLOR);
    const newPalette = generatePalette(DEFAULT_COLOR);
    setPalette(newPalette);
    resetPalette();
  }, []);

  useEffect(() => {
    return () => resetPalette();
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
          <h3 className="themes-view__sidebar-title">Palette</h3>
          <div className="themes-view__palette-list">
            {palette.map((shade) => (
              <div className="themes-view__palette-row" key={shade.key}>
                <div className="themes-view__palette-swatch" style={{ background: shade.hex }} />
                <span className="themes-view__palette-key">{shade.key}</span>
                <span className="themes-view__palette-hex">{shade.hex}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="themes-view__reset" onClick={handleReset}>Reset to Default</button>
      </aside>

      {/* Right: Preview */}
      <main className="themes-view__preview">
        <div className="themes-view__preview-grid">
          <Heading size="Medium" heading="Theme Preview" subheading="Components with your brand color" shrinked />

          <div className="themes-view__btn-group">
            <Button variant="Default" size="Default" label="Primary" leftIcon="none" rightIcon="none" shrinked />
            <Button variant="Default" size="Small" label="Small" leftIcon="none" rightIcon="none" shrinked />
            <Button variant="Secondary" size="Default" label="Secondary" leftIcon="none" rightIcon="none" shrinked />
            <Button variant="Outlined" size="Default" label="Outlined" leftIcon="none" rightIcon="none" shrinked />
            <Button iconOnly iconOnlyIcon="Plus" iconOnlyFilled corner="Rounded" />
            <Button iconOnly iconOnlyIcon="Heart" iconOnlyFilled={false} corner="Rounded" />
          </div>

          <Card imageStyle="Square" layout="Horizontal" action="Icon" title="Card Element" description="Horizontal layout with icon action" shrinked />

          <Card imageStyle="Square" layout="Vertical" action="Button" title="Vertical Card" description="With action button" buttonLabel="Action" shrinked />

          <Document alignment="Left" size="Normal" fileName="report.pdf" description="2.4 MB - PDF" shrinked />

          <SignDocument label="Sign Document" description="NDA Agreement" shrinked />

          <Form label="Contact Form" description="Required fields" shrinked />

          <SocialFollow filled shrinked />

          <List layout="Basic" imageStyle="Square" size="Compact" action="Icon" items={[
            { title: 'List Item 1', description: 'Description' },
            { title: 'List Item 2', description: 'Description' },
          ]} />

          <DonationBox
            title="Support Us"
            description="Help make a difference"
            amounts={['$10', '$25', '$50']}
            showCustomAmount={false}
            buttonLabel="Donate"
            goalProgress={65}
            raisedAmount="$650"
            goalAmount="$1,000"
          />

          <ProductList
            title="Products"
            shrinked
          />

          <ImageGallery layout="2" shrinked />
        </div>
      </main>
    </div>
  );
}
