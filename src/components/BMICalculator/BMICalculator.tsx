import { useState } from 'react';
import './BMICalculator.scss';

export interface BMICalculatorProps {
  selected?: boolean;
}

type Unit = 'metric' | 'imperial';

interface BMIResult {
  value: number;
  category: string;
  color: string;
}

function calcBMI(weight: number, height: number, unit: Unit): BMIResult | null {
  if (!weight || !height) return null;

  let bmi: number;
  if (unit === 'metric') {
    const heightM = height / 100;
    bmi = weight / (heightM * heightM);
  } else {
    bmi = (703 * weight) / (height * height);
  }

  bmi = Math.round(bmi * 10) / 10;

  let category: string;
  let color: string;

  if (bmi < 18.5) {
    category = 'Underweight';
    color = '#3B82F6';
  } else if (bmi < 25) {
    category = 'Normal weight';
    color = '#22C55E';
  } else if (bmi < 30) {
    category = 'Overweight';
    color = '#F59E0B';
  } else {
    category = 'Obese';
    color = '#EF4444';
  }

  return { value: bmi, category, color };
}

const SCALE = [
  { label: 'Underweight', max: 18.5, color: '#3B82F6' },
  { label: 'Normal', max: 25, color: '#22C55E' },
  { label: 'Overweight', max: 30, color: '#F59E0B' },
  { label: 'Obese', max: 40, color: '#EF4444' },
];

function getScalePosition(bmi: number): number {
  const min = 10;
  const max = 40;
  return Math.min(Math.max(((bmi - min) / (max - min)) * 100, 0), 100);
}

export function BMICalculator({ selected = false }: BMICalculatorProps) {
  const [unit, setUnit] = useState<Unit>('metric');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const result = calcBMI(parseFloat(weight), parseFloat(height), unit);

  const classes = [
    'jf-bmi',
    selected && 'jf-bmi--selected',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {/* Header */}
      <div className="jf-bmi__header">
        <div className="jf-bmi__icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
          </svg>
        </div>
        <div className="jf-bmi__header-text">
          <h3 className="jf-bmi__title">BMI Calculator</h3>
          <p className="jf-bmi__subtitle">Body Mass Index</p>
        </div>

        {/* Unit toggle */}
        <div className="jf-bmi__toggle">
          <button
            className={`jf-bmi__toggle-btn${unit === 'metric' ? ' active' : ''}`}
            onClick={() => { setUnit('metric'); setWeight(''); setHeight(''); }}
          >
            Metric
          </button>
          <button
            className={`jf-bmi__toggle-btn${unit === 'imperial' ? ' active' : ''}`}
            onClick={() => { setUnit('imperial'); setWeight(''); setHeight(''); }}
          >
            Imperial
          </button>
        </div>
      </div>

      {/* Inputs */}
      <div className="jf-bmi__inputs">
        <div className="jf-bmi__field">
          <label className="jf-bmi__label">
            Weight <span className="jf-bmi__unit">{unit === 'metric' ? 'kg' : 'lbs'}</span>
          </label>
          <input
            className="jf-bmi__input"
            type="number"
            min="0"
            placeholder={unit === 'metric' ? '70' : '154'}
            value={weight}
            onChange={e => setWeight(e.target.value)}
          />
          <p className="jf-bmi__field-desc">
            {unit === 'metric' ? 'Enter your weight in kilograms.' : 'Enter your weight in pounds.'}
          </p>
        </div>
        <div className="jf-bmi__field">
          <label className="jf-bmi__label">
            Height <span className="jf-bmi__unit">{unit === 'metric' ? 'cm' : 'in'}</span>
          </label>
          <input
            className="jf-bmi__input"
            type="number"
            min="0"
            placeholder={unit === 'metric' ? '175' : '69'}
            value={height}
            onChange={e => setHeight(e.target.value)}
          />
          <p className="jf-bmi__field-desc">
            {unit === 'metric' ? 'Enter your height in centimeters.' : 'Enter your height in inches.'}
          </p>
        </div>
      </div>

      {/* Result */}
      {result ? (
        <div className="jf-bmi__result">
          <div className="jf-bmi__result-value" style={{ color: result.color }}>
            {result.value}
          </div>
          <div className="jf-bmi__result-badge" style={{ background: result.color + '1A', color: result.color }}>
            {result.category}
          </div>

          {/* Scale bar */}
          <div className="jf-bmi__scale">
            {SCALE.map(s => (
              <div key={s.label} className="jf-bmi__scale-segment" style={{ background: s.color }} />
            ))}
            <div
              className="jf-bmi__scale-marker"
              style={{ left: `${getScalePosition(result.value)}%` }}
            />
          </div>
          <div className="jf-bmi__scale-labels">
            <span>10</span>
            <span>18.5</span>
            <span>25</span>
            <span>30</span>
            <span>40+</span>
          </div>
        </div>
      ) : (
        <div className="jf-bmi__empty">
          <p>Enter your weight and height to calculate your BMI.</p>
        </div>
      )}

      {/* Info */}
      <div className="jf-bmi__info">
        {SCALE.map(s => (
          <div key={s.label} className="jf-bmi__info-row">
            <span className="jf-bmi__info-dot" style={{ background: s.color }} />
            <span className="jf-bmi__info-label">{s.label}</span>
            <span className="jf-bmi__info-range">
              {s.label === 'Underweight' && '< 18.5'}
              {s.label === 'Normal' && '18.5 – 24.9'}
              {s.label === 'Overweight' && '25 – 29.9'}
              {s.label === 'Obese' && '≥ 30'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BMICalculator;
