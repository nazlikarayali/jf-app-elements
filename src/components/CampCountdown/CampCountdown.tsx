import { useState, useEffect } from 'react';
import './CampCountdown.scss';

export interface CampCountdownProps {
  selected?: boolean;
}

const CAMP_START = new Date('2026-07-15T09:00:00');
const SESSION_NAME = 'Summer Session 2026';

const MILESTONES = [
  { label: 'Registration deadline', date: 'Jun 15', done: true },
  { label: 'Health forms due', date: 'Jun 30', done: true },
  { label: 'Cabin assignments', date: 'Jul 1', done: false },
  { label: 'Packing list sent', date: 'Jul 8', done: false },
  { label: 'Camp begins! 🏕️', date: 'Jul 15', done: false },
];

function getTimeLeft(target: Date) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    passed: false,
  };
}

export function CampCountdown({ selected = false }: CampCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(CAMP_START));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(CAMP_START)), 1000);
    return () => clearInterval(timer);
  }, []);

  const classes = ['jf-countdown', selected && 'jf-countdown--selected'].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {/* Header */}
      <div className="jf-countdown__header">
        <div className="jf-countdown__icon">⛺</div>
        <div className="jf-countdown__header-text">
          <h3 className="jf-countdown__title">{SESSION_NAME}</h3>
          <p className="jf-countdown__subtitle">Jul 15 – Aug 9, 2026</p>
        </div>
      </div>

      {/* Countdown */}
      <div className="jf-countdown__timer">
        <div className="jf-countdown__unit">
          <span className="jf-countdown__number">{timeLeft.days}</span>
          <span className="jf-countdown__label">days</span>
        </div>
        <span className="jf-countdown__separator">:</span>
        <div className="jf-countdown__unit">
          <span className="jf-countdown__number">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="jf-countdown__label">hours</span>
        </div>
        <span className="jf-countdown__separator">:</span>
        <div className="jf-countdown__unit">
          <span className="jf-countdown__number">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="jf-countdown__label">min</span>
        </div>
        <span className="jf-countdown__separator">:</span>
        <div className="jf-countdown__unit">
          <span className="jf-countdown__number">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="jf-countdown__label">sec</span>
        </div>
      </div>

      {/* Milestones */}
      <div className="jf-countdown__milestones">
        <span className="jf-countdown__milestones-title">Milestones</span>
        {MILESTONES.map((m, i) => (
          <div key={i} className={`jf-countdown__milestone ${m.done ? 'jf-countdown__milestone--done' : ''}`}>
            <span className="jf-countdown__milestone-dot">
              {m.done ? '✓' : ''}
            </span>
            <span className="jf-countdown__milestone-label">{m.label}</span>
            <span className="jf-countdown__milestone-date">{m.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CampCountdown;
