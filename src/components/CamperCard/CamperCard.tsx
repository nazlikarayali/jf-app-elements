import { useState } from 'react';
import './CamperCard.scss';

export interface CamperCardProps {
  selected?: boolean;
}

interface CamperData {
  name: string;
  age: number;
  cabin: string;
  avatar: string;
  allergies: string[];
  immunization: boolean;
  transportation: 'bus' | 'parent' | 'none';
  emergencyContact: string;
  emergencyPhone: string;
  forms: { name: string; completed: boolean }[];
}

const CAMPERS: CamperData[] = [
  {
    name: 'Emma Johnson',
    age: 10,
    cabin: 'Cabin Firefly',
    avatar: '👧',
    allergies: ['Peanuts', 'Bee stings'],
    immunization: true,
    transportation: 'bus',
    emergencyContact: 'Sarah Johnson',
    emergencyPhone: '(555) 234-5678',
    forms: [
      { name: 'Registration form', completed: true },
      { name: 'Health record', completed: true },
      { name: 'Immunization record', completed: true },
      { name: 'Photo release/consent', completed: false },
      { name: 'Transportation details', completed: true },
    ],
  },
  {
    name: 'Liam Carter',
    age: 12,
    cabin: 'Cabin Bear',
    avatar: '👦',
    allergies: ['Dairy'],
    immunization: true,
    transportation: 'parent',
    emergencyContact: 'Mike Carter',
    emergencyPhone: '(555) 876-5432',
    forms: [
      { name: 'Registration form', completed: true },
      { name: 'Health record', completed: true },
      { name: 'Immunization record', completed: true },
      { name: 'Photo release/consent', completed: true },
      { name: 'Transportation details', completed: true },
    ],
  },
  {
    name: 'Sofia Martinez',
    age: 9,
    cabin: 'Cabin Owl',
    avatar: '👧',
    allergies: [],
    immunization: false,
    transportation: 'bus',
    emergencyContact: 'Maria Martinez',
    emergencyPhone: '(555) 345-6789',
    forms: [
      { name: 'Registration form', completed: true },
      { name: 'Health record', completed: false },
      { name: 'Immunization record', completed: false },
      { name: 'Photo release/consent', completed: false },
      { name: 'Transportation details', completed: false },
    ],
  },
];

export function CamperCard({ selected = false }: CamperCardProps) {
  const [selectedCamperIndex, setSelectedCamperIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const camper = CAMPERS[selectedCamperIndex];
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'forms'>('overview');

  const filteredCampers = searchQuery
    ? CAMPERS.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : CAMPERS;

  const completedForms = camper.forms.filter(f => f.completed).length;
  const totalForms = camper.forms.length;
  const progress = Math.round((completedForms / totalForms) * 100);

  const classes = ['jf-camper', selected && 'jf-camper--selected'].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {/* Camper Selector */}
      <div className="jf-camper__selector">
        <span className="jf-camper__selector-label">Select camper</span>
        <input
          className="jf-camper__selector-search"
          type="text"
          placeholder="Search camper name"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <div className="jf-camper__selector-chips">
          {filteredCampers.map((c) => {
            const realIndex = CAMPERS.indexOf(c);
            return (
              <button
                key={realIndex}
                className={`jf-camper__selector-chip ${selectedCamperIndex === realIndex ? 'jf-camper__selector-chip--active' : ''}`}
                onClick={() => { setSelectedCamperIndex(realIndex); setSearchQuery(''); setActiveTab('overview'); }}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Header */}
      <div className="jf-camper__header">
        <div className="jf-camper__avatar">{camper.avatar}</div>
        <div className="jf-camper__header-text">
          <h3 className="jf-camper__name">{camper.name}</h3>
          <p className="jf-camper__meta">Age {camper.age} · {camper.cabin}</p>
        </div>
        <div className={`jf-camper__status ${progress === 100 ? 'jf-camper__status--complete' : ''}`}>
          {progress === 100 ? 'Ready' : `${progress}%`}
        </div>
      </div>

      {/* Progress */}
      <div className="jf-camper__progress">
        <div className="jf-camper__progress-header">
          <span className="jf-camper__progress-label">Registration Progress</span>
          <span className="jf-camper__progress-value">{completedForms}/{totalForms} forms</span>
        </div>
        <div className="jf-camper__progress-track">
          <div className="jf-camper__progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Tabs */}
      <div className="jf-camper__tabs">
        {(['overview', 'health', 'forms'] as const).map(tab => (
          <button
            key={tab}
            className={`jf-camper__tab ${activeTab === tab ? 'jf-camper__tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="jf-camper__content">
        {activeTab === 'overview' && (
          <div className="jf-camper__overview">
            <div className="jf-camper__info-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="jf-camper__info-label">{camper.cabin}</span>
            </div>
            <div className="jf-camper__info-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {camper.transportation === 'bus' ? (
                  <>
                    <path d="M8 6v6" /><path d="M15 6v6" /><path d="M2 12h19.6" />
                    <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
                    <circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" />
                  </>
                ) : (
                  <><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.2 1 13v3c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></>
                )}
              </svg>
              <span className="jf-camper__info-label">
                {camper.transportation === 'bus' ? 'Camp bus' : camper.transportation === 'parent' ? 'Parent drop-off' : 'Not set'}
              </span>
            </div>
            <div className="jf-camper__info-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <div className="jf-camper__info-contact">
                <span className="jf-camper__info-label">{camper.emergencyContact}</span>
                <span className="jf-camper__info-sub">{camper.emergencyPhone}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="jf-camper__health">
            <div className="jf-camper__health-item">
              <span className={`jf-camper__badge ${camper.immunization ? 'jf-camper__badge--success' : 'jf-camper__badge--warning'}`}>
                {camper.immunization ? '✓ Up to date' : '⚠ Incomplete'}
              </span>
              <span className="jf-camper__health-label">Immunization</span>
            </div>
            <div className="jf-camper__health-item">
              <span className="jf-camper__health-label">Allergies</span>
              <div className="jf-camper__tags">
                {camper.allergies.map(a => (
                  <span key={a} className="jf-camper__tag">{a}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'forms' && (
          <div className="jf-camper__forms">
            {camper.forms.map(form => (
              <div key={form.name} className="jf-camper__form-row">
                <span className={`jf-camper__form-check ${form.completed ? 'jf-camper__form-check--done' : ''}`}>
                  {form.completed ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : null}
                </span>
                <span className={`jf-camper__form-name ${form.completed ? 'jf-camper__form-name--done' : ''}`}>{form.name}</span>
                <span className={`jf-camper__form-status ${form.completed ? 'jf-camper__form-status--done' : ''}`}>
                  {form.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CamperCard;
