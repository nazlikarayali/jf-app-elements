import { useEffect, useState } from 'react';

// ============================================
// Types
// ============================================
interface TypeToken {
  name: string;
  variable: string;
  size: string;
  lineHeight: string;
  lineHeightVar: string;
}

interface WeightToken {
  name: string;
  variable: string;
  value: string;
}

// ============================================
// Token Definitions
// ============================================
const headingTokens: TypeToken[] = [
  { name: 'Heading XXL', variable: '--font-size-heading-xxl', size: '40px', lineHeight: '48px', lineHeightVar: '--line-height-heading-xxl' },
  { name: 'Heading XL', variable: '--font-size-heading-xl', size: '36px', lineHeight: '44px', lineHeightVar: '--line-height-heading-xl' },
  { name: 'Heading LG', variable: '--font-size-heading-lg', size: '32px', lineHeight: '40px', lineHeightVar: '--line-height-heading-lg' },
  { name: 'Heading MD', variable: '--font-size-heading-md', size: '28px', lineHeight: '36px', lineHeightVar: '--line-height-heading-md' },
  { name: 'Heading SM', variable: '--font-size-heading-sm', size: '24px', lineHeight: '32px', lineHeightVar: '--line-height-heading-sm' },
  { name: 'Heading XS', variable: '--font-size-heading-xs', size: '20px', lineHeight: '28px', lineHeightVar: '--line-height-heading-xs' },
];

const paragraphTokens: TypeToken[] = [
  { name: 'Paragraph LG', variable: '--font-size-paragraph-lg', size: '18px', lineHeight: '28px', lineHeightVar: '--line-height-paragraph-lg' },
  { name: 'Paragraph MD', variable: '--font-size-paragraph-md', size: '16px', lineHeight: '24px', lineHeightVar: '--line-height-paragraph-md' },
  { name: 'Paragraph SM', variable: '--font-size-paragraph-sm', size: '14px', lineHeight: '20px', lineHeightVar: '--line-height-paragraph-sm' },
  { name: 'Paragraph XS', variable: '--font-size-paragraph-xs', size: '12px', lineHeight: '20px', lineHeightVar: '--line-height-paragraph-xs' },
];

const labelTokens: TypeToken[] = [
  { name: 'Label LG', variable: '--font-size-label-lg', size: '16px', lineHeight: '24px', lineHeightVar: '--line-height-label-lg' },
  { name: 'Label MD', variable: '--font-size-label-md', size: '14px', lineHeight: '20px', lineHeightVar: '--line-height-label-md' },
  { name: 'Label SM', variable: '--font-size-label-sm', size: '12px', lineHeight: '16px', lineHeightVar: '--line-height-label-sm' },
  { name: 'Label XS', variable: '--font-size-label-xs', size: '10px', lineHeight: '14px', lineHeightVar: '--line-height-label-xs' },
];

const weightTokens: WeightToken[] = [
  { name: 'Regular', variable: '--font-weight-regular', value: '400' },
  { name: 'Medium', variable: '--font-weight-medium', value: '500' },
  { name: 'Bold (Semi Bold)', variable: '--font-weight-bold', value: '600' },
];

// ============================================
// Sub-components
// ============================================
function TypeRow({ token, weight }: { token: TypeToken; weight: number }) {
  return (
    <div className="foundation-typography__row">
      <div className="foundation-typography__meta">
        <span className="foundation-typography__token-name">{token.name}</span>
        <div className="foundation-typography__token-details">
          <code>{token.variable}</code>
          <span className="foundation-typography__dot" />
          <span>{token.size} / {token.lineHeight}</span>
        </div>
      </div>
      <div
        className="foundation-typography__preview"
        style={{
          fontSize: `var(${token.variable})`,
          lineHeight: `var(${token.lineHeightVar})`,
          fontWeight: weight,
        }}
      >
        The quick brown fox jumps over the lazy dog
      </div>
    </div>
  );
}

function TypeSection({
  title,
  description,
  tokens,
  weight = 400,
}: {
  title: string;
  description: string;
  tokens: TypeToken[];
  weight?: number;
}) {
  return (
    <section className="foundation-typography__section">
      <div className="foundation-typography__section-header">
        <h3 className="foundation-typography__section-title">{title}</h3>
        <p className="foundation-typography__section-desc">{description}</p>
      </div>
      <div className="foundation-typography__rows">
        {tokens.map((t) => (
          <TypeRow key={t.variable} token={t} weight={weight} />
        ))}
      </div>
    </section>
  );
}

function WeightSection() {
  return (
    <section className="foundation-typography__section">
      <div className="foundation-typography__section-header">
        <h3 className="foundation-typography__section-title">Font Weights</h3>
        <p className="foundation-typography__section-desc">
          Three weight levels for visual hierarchy. Use Regular for body text, Medium for labels and UI controls, Bold for headings and emphasis.
        </p>
      </div>
      <div className="foundation-typography__weight-grid">
        {weightTokens.map((w) => (
          <div key={w.variable} className="foundation-typography__weight-card">
            <div
              className="foundation-typography__weight-preview"
              style={{ fontWeight: Number(w.value) }}
            >
              Aa
            </div>
            <div className="foundation-typography__weight-info">
              <span className="foundation-typography__weight-name">{w.name}</span>
              <code>{w.variable}: {w.value}</code>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FontFamilySection() {
  return (
    <section className="foundation-typography__section">
      <div className="foundation-typography__section-header">
        <h3 className="foundation-typography__section-title">Font Family</h3>
        <p className="foundation-typography__section-desc">
          Inter is used across all UI elements. The system font stack provides fallbacks for environments where Inter is unavailable.
        </p>
      </div>
      <div className="foundation-typography__family-card">
        <div className="foundation-typography__family-preview">
          ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
          abcdefghijklmnopqrstuvwxyz<br />
          0123456789 !@#$%^&*()
        </div>
        <div className="foundation-typography__family-info">
          <code>--font-family</code>
          <span>'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif</span>
        </div>
      </div>
    </section>
  );
}

function ScaleRulesSection() {
  return (
    <section className="foundation-typography__section">
      <div className="foundation-typography__section-header">
        <h3 className="foundation-typography__section-title">Usage Rules</h3>
      </div>
      <div className="foundation-typography__rules">
        <div className="foundation-typography__rule">
          <div className="foundation-typography__rule-icon">H</div>
          <div className="foundation-typography__rule-content">
            <strong>Headings</strong>
            <p>Use <code>--font-weight-bold</code> (600). Scale from XXL (40px) for hero sections down to XS (20px) for card titles. Always pair with matching line-height variable.</p>
          </div>
        </div>
        <div className="foundation-typography__rule">
          <div className="foundation-typography__rule-icon">P</div>
          <div className="foundation-typography__rule-content">
            <strong>Paragraphs</strong>
            <p>Use <code>--font-weight-regular</code> (400). LG (18px) for featured content, MD (16px) for body text, SM (14px) for descriptions, XS (12px) for captions.</p>
          </div>
        </div>
        <div className="foundation-typography__rule">
          <div className="foundation-typography__rule-icon">L</div>
          <div className="foundation-typography__rule-content">
            <strong>Labels</strong>
            <p>Use <code>--font-weight-medium</code> (500). For form labels, buttons, tags, and UI controls. LG (16px) for input values, SM (12px) for small tags and helper text.</p>
          </div>
        </div>
        <div className="foundation-typography__rule">
          <div className="foundation-typography__rule-icon">&darr;</div>
          <div className="foundation-typography__rule-content">
            <strong>Line Height</strong>
            <p>Every font-size token has a matching line-height token. Always use them together: <code>font-size: var(--font-size-heading-md)</code> + <code>line-height: var(--line-height-heading-md)</code>.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Main Component
// ============================================
export function FoundationTypography() {
  return (
    <main className="main-content">
      <div className="component-view">
        <div className="foundation-typography">
          <div className="foundation-typography__header">
            <h2 className="foundation-typography__title">Typography</h2>
            <p className="foundation-typography__subtitle">
              Font variables, sizes, weights, and usage guidelines for consistent text rendering across all components.
            </p>
          </div>

          <FontFamilySection />
          <WeightSection />
          <ScaleRulesSection />

          <TypeSection
            title="Headings"
            description="Used for titles and section headers. Paired with font-weight-bold (600) for strong visual hierarchy."
            tokens={headingTokens}
            weight={600}
          />

          <TypeSection
            title="Paragraphs"
            description="Used for body text, descriptions, and longer content. Paired with font-weight-regular (400) for comfortable reading."
            tokens={paragraphTokens}
            weight={400}
          />

          <TypeSection
            title="Labels"
            description="Used for form labels, buttons, tags, and compact UI controls. Paired with font-weight-medium (500) for clarity at small sizes."
            tokens={labelTokens}
            weight={500}
          />
        </div>
      </div>
    </main>
  );
}
