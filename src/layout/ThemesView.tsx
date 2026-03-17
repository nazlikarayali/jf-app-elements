import { useState, useEffect, useCallback } from 'react';
import { generatePalette, getClosestShadeKey } from '../utils/colorPalette';
import type { PaletteShade } from '../utils/colorPalette';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Heading } from '../components/Heading';
import { DonationBox } from '../components/DonationBox';

const DEFAULT_COLOR = '#7D38EF';

// Map palette shades to CSS custom properties
function applyPaletteToDOM(palette: PaletteShade[]) {
  const root = document.documentElement;
  const map: Record<string, string> = {};
  for (const shade of palette) {
    map[shade.key] = shade.hex;
  }

  // Primary palette
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

  // Semantic mappings that depend on primary
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

function contrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#091141' : '#FFFFFF';
}

export function ThemesView() {
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [palette, setPalette] = useState<PaletteShade[]>(() => generatePalette(DEFAULT_COLOR));
  const [closestShade, setClosestShade] = useState(() => getClosestShadeKey(DEFAULT_COLOR));

  const handleColorChange = useCallback((newColor: string) => {
    setColor(newColor);
    const newPalette = generatePalette(newColor);
    setPalette(newPalette);
    setClosestShade(getClosestShadeKey(newColor));
    applyPaletteToDOM(newPalette);
  }, []);

  const handleReset = useCallback(() => {
    setColor(DEFAULT_COLOR);
    const newPalette = generatePalette(DEFAULT_COLOR);
    setPalette(newPalette);
    setClosestShade(getClosestShadeKey(DEFAULT_COLOR));
    resetPalette();
  }, []);

  useEffect(() => {
    return () => resetPalette();
  }, []);

  return (
    <div className="themes-view">
      {/* Color Picker Section */}
      <div className="themes-view__picker">
        <div className="themes-view__picker-header">
          <h2>Theme Generator</h2>
          <p>Pick a color to generate a full palette and preview it on components.</p>
        </div>
        <div className="themes-view__picker-controls">
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
          <button className="themes-view__reset" onClick={handleReset}>Reset to Default</button>
        </div>
      </div>

      {/* Palette Display */}
      <div className="themes-view__palette">
        <h3 className="themes-view__section-title">Generated Palette</h3>
        <div className="themes-view__shades">
          {palette.map((shade) => (
            <div
              key={shade.key}
              className={`themes-view__shade${shade.key === closestShade ? ' themes-view__shade--active' : ''}`}
              style={{ background: shade.hex }}
            >
              <span className="themes-view__shade-key" style={{ color: contrastColor(shade.hex) }}>
                {shade.key}
              </span>
              <span className="themes-view__shade-hex" style={{ color: contrastColor(shade.hex) }}>
                {shade.hex}
              </span>
            </div>
          ))}
        </div>
        <p className="themes-view__palette-hint">
          Your color maps closest to shade <strong>{closestShade}</strong>
        </p>
      </div>

      {/* Token Mapping */}
      <div className="themes-view__mapping">
        <h3 className="themes-view__section-title">Token Mapping</h3>
        <div className="themes-view__token-grid">
          {[
            { label: 'bg-fill-brand', shade: '600', desc: 'Buttons, actions' },
            { label: 'bg-fill-brand-hover', shade: '700', desc: 'Hover states' },
            { label: 'bg-fill-brand-disabled', shade: '200', desc: 'Disabled states' },
            { label: 'bg-surface-brand', shade: '100', desc: 'Card image, icon bg' },
            { label: 'bg-surface-brand-hover', shade: '200', desc: 'Hover surface' },
            { label: 'fg-brand', shade: '600', desc: 'Brand text, icons' },
            { label: 'fg-brand-hover', shade: '700', desc: 'Hover text' },
            { label: 'border-brand', shade: '200', desc: 'Brand borders' },
          ].map((token) => {
            const shade = palette.find(s => s.key === token.shade);
            return (
              <div className="themes-view__token" key={token.label}>
                <div className="themes-view__token-swatch" style={{ background: shade?.hex }} />
                <div className="themes-view__token-info">
                  <span className="themes-view__token-name">{token.label}</span>
                  <span className="themes-view__token-desc">{token.desc} → {token.shade}</span>
                </div>
                <span className="themes-view__token-hex">{shade?.hex}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Preview */}
      <div className="themes-view__preview">
        <h3 className="themes-view__section-title">Live Preview</h3>
        <div className="themes-view__preview-grid">
          <div className="themes-view__preview-card">
            <Heading size="Small" heading="Preview Components" subheading="See how your palette looks" />
          </div>

          <div className="themes-view__preview-card">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button variant="Default" size="Default" label="Primary" leftIcon="none" rightIcon="none" shrinked />
              <Button variant="Default" size="Small" label="Small" leftIcon="none" rightIcon="none" shrinked />
              <Button variant="Secondary" size="Default" label="Secondary" leftIcon="none" rightIcon="none" shrinked />
              <Button variant="Outlined" size="Default" label="Outlined" leftIcon="none" rightIcon="none" shrinked />
              <Button iconOnly iconOnlyIcon="Plus" iconOnlyFilled corner="Rounded" />
              <Button iconOnly iconOnlyIcon="Heart" iconOnlyFilled={false} corner="Rounded" />
            </div>
          </div>

          <div className="themes-view__preview-card">
            <Card imageStyle="Square" layout="Horizontal" action="Icon" title="Card Element" description="With brand colors applied" />
          </div>

          <div className="themes-view__preview-card">
            <Card imageStyle="Square" layout="Vertical" action="Button" title="Vertical Card" description="Button uses brand fill" buttonLabel="Action" />
          </div>

          <div className="themes-view__preview-card">
            <DonationBox
              title="Donate"
              description="See the progress bar and button"
              amounts={['$10', '$25', '$50']}
              showCustomAmount={false}
              buttonLabel="Donate Now"
              goalProgress={65}
              raisedAmount="$650"
              goalAmount="$1,000"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
