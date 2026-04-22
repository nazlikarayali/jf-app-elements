import { useState } from 'react';
import './TripPlanner.scss';

export interface TripPlannerProps {
  selected?: boolean;
}

interface Stop {
  id: string;
  name: string;
  emoji: string;
  time: string;
  duration: string;
  category: string;
  done: boolean;
}

const DAYS = [
  {
    label: 'Day 1 – North Coast',
    date: 'Jul 15',
    stops: [
      { id: '1', name: 'Hundred Islands', emoji: '🏝️', time: '6:00 AM', duration: '3h', category: 'Beach', done: true },
      { id: '2', name: 'Lucap Wharf', emoji: '⛵', time: '9:30 AM', duration: '1h', category: 'Port', done: true },
      { id: '3', name: 'Lunch at Maxine by the Sea', emoji: '🍽️', time: '11:00 AM', duration: '1.5h', category: 'Food', done: false },
      { id: '4', name: 'Patar Beach', emoji: '🏖️', time: '1:30 PM', duration: '2h', category: 'Beach', done: false },
      { id: '5', name: 'Cape Bolinao Lighthouse', emoji: '🏛️', time: '4:00 PM', duration: '1h', category: 'Historical', done: false },
    ],
  },
  {
    label: 'Day 2 – Mountains & Culture',
    date: 'Jul 16',
    stops: [
      { id: '6', name: 'Mount Balungao Hot Springs', emoji: '♨️', time: '7:00 AM', duration: '2h', category: 'Nature', done: false },
      { id: '7', name: 'Manaoag Church', emoji: '⛪', time: '10:00 AM', duration: '1.5h', category: 'Church', done: false },
      { id: '8', name: 'Dagupan City Market', emoji: '🛍️', time: '12:00 PM', duration: '2h', category: 'Shopping', done: false },
      { id: '9', name: 'Tondaligan Beach', emoji: '🌅', time: '3:00 PM', duration: '2h', category: 'Beach', done: false },
    ],
  },
  {
    label: 'Day 3 – Waterfalls & Farewell',
    date: 'Jul 17',
    stops: [
      { id: '10', name: 'Bolinao Falls 1', emoji: '💧', time: '7:00 AM', duration: '2h', category: 'Nature', done: false },
      { id: '11', name: 'Bolinao Falls 2', emoji: '💧', time: '9:30 AM', duration: '1.5h', category: 'Nature', done: false },
      { id: '12', name: 'Enchanted Cave', emoji: '🕳️', time: '11:30 AM', duration: '1h', category: 'Nature', done: false },
      { id: '13', name: 'Farewell Lunch', emoji: '🎉', time: '1:00 PM', duration: '2h', category: 'Food', done: false },
    ],
  },
];

export function TripPlanner({ selected = false }: TripPlannerProps) {
  const [days, setDays] = useState(DAYS);
  const [activeDay, setActiveDay] = useState(0);
  const [dragId, setDragId] = useState<string | null>(null);

  const currentDay = days[activeDay];
  const totalStops = currentDay.stops.length;
  const doneStops = currentDay.stops.filter(s => s.done).length;

  const toggleDone = (stopId: string) => {
    setDays(prev => prev.map((day, i) => i === activeDay ? {
      ...day,
      stops: day.stops.map(s => s.id === stopId ? { ...s, done: !s.done } : s),
    } : day));
  };

  const moveStop = (fromIdx: number, toIdx: number) => {
    setDays(prev => prev.map((day, i) => {
      if (i !== activeDay) return day;
      const stops = [...day.stops];
      const [moved] = stops.splice(fromIdx, 1);
      stops.splice(toIdx, 0, moved);
      return { ...day, stops };
    }));
  };

  const classes = ['jf-trip', selected && 'jf-trip--selected'].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {/* Header */}
      <div className="jf-trip__header">
        <div className="jf-trip__icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <path d="M9 9h.01" /><path d="M15 9h.01" />
          </svg>
        </div>
        <div className="jf-trip__header-text">
          <h3 className="jf-trip__title">Trip Planner</h3>
          <p className="jf-trip__subtitle">Pangasinan 3-Day Adventure</p>
        </div>
        <div className="jf-trip__progress-badge">
          {doneStops}/{totalStops}
        </div>
      </div>

      {/* Day Tabs */}
      <div className="jf-trip__days">
        {days.map((day, i) => (
          <button
            key={i}
            className={`jf-trip__day-tab ${activeDay === i ? 'jf-trip__day-tab--active' : ''}`}
            onClick={() => setActiveDay(i)}
          >
            <span className="jf-trip__day-date">{day.date}</span>
            <span className="jf-trip__day-label">{day.label.split(' – ')[1]}</span>
          </button>
        ))}
      </div>

      {/* Day Title */}
      <div className="jf-trip__day-header">
        <h4 className="jf-trip__day-title">{currentDay.label}</h4>
        <span className="jf-trip__day-count">{totalStops} stops · ~{currentDay.stops.reduce((sum, s) => sum + parseFloat(s.duration), 0)}h</span>
      </div>

      {/* Timeline */}
      <div className="jf-trip__timeline">
        {currentDay.stops.map((stop, idx) => (
          <div
            key={stop.id}
            className={`jf-trip__stop ${stop.done ? 'jf-trip__stop--done' : ''} ${dragId === stop.id ? 'jf-trip__stop--dragging' : ''}`}
            draggable
            onDragStart={() => setDragId(stop.id)}
            onDragOver={e => e.preventDefault()}
            onDrop={() => {
              if (dragId) {
                const fromIdx = currentDay.stops.findIndex(s => s.id === dragId);
                moveStop(fromIdx, idx);
                setDragId(null);
              }
            }}
            onDragEnd={() => setDragId(null)}
          >
            <div className="jf-trip__stop-left">
              <span className="jf-trip__stop-time">{stop.time}</span>
              <div className={`jf-trip__stop-dot ${stop.done ? 'jf-trip__stop-dot--done' : ''}`}>
                {stop.done && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </div>
            </div>

            <div className="jf-trip__stop-card" onClick={() => toggleDone(stop.id)}>
              <span className="jf-trip__stop-emoji">{stop.emoji}</span>
              <div className="jf-trip__stop-info">
                <span className={`jf-trip__stop-name ${stop.done ? 'jf-trip__stop-name--done' : ''}`}>{stop.name}</span>
                <div className="jf-trip__stop-meta">
                  <span className="jf-trip__stop-duration">{stop.duration}</span>
                  <span className="jf-trip__stop-cat">{stop.category}</span>
                </div>
              </div>
              <div className="jf-trip__stop-drag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="9" cy="6" r="1" /><circle cx="15" cy="6" r="1" />
                  <circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" />
                  <circle cx="9" cy="18" r="1" /><circle cx="15" cy="18" r="1" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TripPlanner;
