import { useState } from 'react';
import { Button } from '../Button/Button';
import './RegistrationProgress.scss';

export interface RegistrationProgressProps {
  selected?: boolean;
}

interface FormItem {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'not-started';
}

interface CamperForms {
  name: string;
  forms: FormItem[];
}

const CAMPERS: CamperForms[] = [
  {
    name: 'Emma Johnson',
    forms: [
      { id: '1', name: 'Camp Registration', status: 'completed' },
      { id: '2', name: 'Health Record', status: 'completed' },
      { id: '3', name: 'Immunization Record', status: 'completed' },
      { id: '4', name: 'Photo Release / Consent', status: 'in-progress' },
      { id: '5', name: 'Transportation Details', status: 'not-started' },
      { id: '6', name: 'Emergency Contacts', status: 'not-started' },
    ],
  },
  {
    name: 'Liam Carter',
    forms: [
      { id: '1', name: 'Camp Registration', status: 'completed' },
      { id: '2', name: 'Health Record', status: 'completed' },
      { id: '3', name: 'Immunization Record', status: 'completed' },
      { id: '4', name: 'Photo Release / Consent', status: 'completed' },
      { id: '5', name: 'Transportation Details', status: 'completed' },
      { id: '6', name: 'Emergency Contacts', status: 'completed' },
    ],
  },
  {
    name: 'Sofia Martinez',
    forms: [
      { id: '1', name: 'Camp Registration', status: 'completed' },
      { id: '2', name: 'Health Record', status: 'not-started' },
      { id: '3', name: 'Immunization Record', status: 'not-started' },
      { id: '4', name: 'Photo Release / Consent', status: 'not-started' },
      { id: '5', name: 'Transportation Details', status: 'not-started' },
      { id: '6', name: 'Emergency Contacts', status: 'not-started' },
    ],
  },
];

const STATUS_LABEL: Record<string, string> = {
  'completed': 'Completed',
  'in-progress': 'In Progress',
  'not-started': 'Not Started',
};

export function RegistrationProgress({ selected = false }: RegistrationProgressProps) {
  const [selectedCamper, setSelectedCamper] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const camper = CAMPERS[selectedCamper];
  const completed = camper.forms.filter(f => f.status === 'completed').length;
  const total = camper.forms.length;
  const pct = Math.round((completed / total) * 100);
  const nextForm = camper.forms.find(f => f.status !== 'completed');

  const classes = ['jf-regprog', selected && 'jf-regprog--selected'].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {/* Header */}
      <div className="jf-regprog__header">
        <div className="jf-regprog__icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
            <path d="m9 14 2 2 4-4" />
          </svg>
        </div>
        <div className="jf-regprog__header-text">
          <h3 className="jf-regprog__title">Registration Progress</h3>
          <p className="jf-regprog__subtitle">Track required form submissions</p>
        </div>
      </div>

      {/* Camper selector */}
      <div className="jf-regprog__selector">
        <span className="jf-regprog__selector-label">Camper</span>
        <div className="jf-regprog__dropdown-wrapper">
          <button className="jf-regprog__dropdown-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <span>{camper.name}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>
              <path d="M4 6L8 10L12 6" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="jf-regprog__dropdown-panel">
              {CAMPERS.map((c, i) => (
                <button key={i} className={`jf-regprog__dropdown-option ${selectedCamper === i ? 'jf-regprog__dropdown-option--selected' : ''}`} onClick={() => { setSelectedCamper(i); setDropdownOpen(false); }}>
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overall progress */}
      <div className="jf-regprog__progress">
        <div className="jf-regprog__progress-header">
          <span className="jf-regprog__progress-label">Overall completion</span>
          <span className="jf-regprog__progress-count">{completed} of {total} forms</span>
        </div>
        <div className="jf-regprog__progress-track">
          <div className="jf-regprog__progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="jf-regprog__progress-pct">{pct}% complete</span>
      </div>

      {/* Next step */}
      {nextForm && (
        <div className="jf-regprog__callout">
          <span className="jf-regprog__callout-text">Next step: complete <strong>{nextForm.name}</strong></span>
          <Button variant="Default" size="Small" label="Open Form" leftIcon="none" rightIcon="none" shrinked />
        </div>
      )}

      {/* Form cards */}
      <div className="jf-regprog__forms">
        <span className="jf-regprog__forms-title">Required forms</span>
        {camper.forms.map(form => (
          <div key={form.id} className="jf-regprog__form-card">
            <div className="jf-regprog__form-card-top">
              <span className="jf-regprog__form-name">{form.name}</span>
              <span className={`jf-regprog__status-badge jf-regprog__status-badge--${form.status}`}>
                {STATUS_LABEL[form.status]}
              </span>
            </div>
            {form.status !== 'completed' && (
              <div className="jf-regprog__form-card-bottom">
                <Button variant="Outlined" size="Small" label="Open Form" leftIcon="none" rightIcon="none" shrinked />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RegistrationProgress;
