import { useState } from 'react';
import './CampFeedback.scss';

export interface CampFeedbackProps {
  selected?: boolean;
}

interface FeedbackEntry {
  id: string;
  name: string;
  emoji: string;
  rating: number;
  comment: string;
  time: string;
}

const MOOD_OPTIONS = [
  { emoji: '😍', label: 'Loved it', value: 5 },
  { emoji: '😊', label: 'Great', value: 4 },
  { emoji: '🙂', label: 'Good', value: 3 },
  { emoji: '😐', label: 'Okay', value: 2 },
  { emoji: '😞', label: 'Not great', value: 1 },
];

const INITIAL_FEEDBACK: FeedbackEntry[] = [
  { id: '1', name: 'Emma J.', emoji: '😍', rating: 5, comment: 'The campfire night was amazing! Best day ever!', time: '2h ago' },
  { id: '2', name: 'Liam C.', emoji: '😊', rating: 4, comment: 'Loved the archery session, want to do more.', time: '3h ago' },
  { id: '3', name: 'Sofia M.', emoji: '🙂', rating: 3, comment: 'Swimming was fun but the water was cold.', time: '5h ago' },
  { id: '4', name: 'Noah K.', emoji: '😍', rating: 5, comment: 'Hiking trail was incredible! Saw a deer!', time: 'Yesterday' },
];

export function CampFeedback({ selected = false }: CampFeedbackProps) {
  const [feedbacks, setFeedbacks] = useState(INITIAL_FEEDBACK);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : '0';

  const moodCounts = MOOD_OPTIONS.map(m => ({
    ...m,
    count: feedbacks.filter(f => f.rating === m.value).length,
  }));

  const handleSubmit = () => {
    if (selectedMood === null) return;
    const mood = MOOD_OPTIONS.find(m => m.value === selectedMood);
    if (!mood) return;
    setFeedbacks(prev => [{
      id: Date.now().toString(),
      name: 'You',
      emoji: mood.emoji,
      rating: selectedMood,
      comment: comment || mood.label,
      time: 'Just now',
    }, ...prev]);
    setSelectedMood(null);
    setComment('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  const classes = ['jf-feedback', selected && 'jf-feedback--selected'].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {/* Header */}
      <div className="jf-feedback__header">
        <div className="jf-feedback__icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 10h.01" /><path d="M12 10h.01" /><path d="M16 10h.01" />
          </svg>
        </div>
        <div className="jf-feedback__header-text">
          <h3 className="jf-feedback__title">Camp Feedback</h3>
          <p className="jf-feedback__subtitle">How was your day at camp?</p>
        </div>
        <div className="jf-feedback__avg">
          <span className="jf-feedback__avg-value">{avgRating}</span>
          <span className="jf-feedback__avg-label">avg</span>
        </div>
      </div>

      {/* Mood selector */}
      <div className="jf-feedback__mood-section">
        <span className="jf-feedback__mood-label">Rate your experience</span>
        <div className="jf-feedback__moods">
          {MOOD_OPTIONS.map(m => (
            <button
              key={m.value}
              className={`jf-feedback__mood ${selectedMood === m.value ? 'jf-feedback__mood--active' : ''}`}
              onClick={() => setSelectedMood(m.value)}
            >
              <span className="jf-feedback__mood-emoji">{m.emoji}</span>
              <span className="jf-feedback__mood-text">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Comment + submit */}
      {selectedMood !== null && (
        <div className="jf-feedback__input-row">
          <input
            className="jf-feedback__input"
            type="text"
            placeholder="Add a comment (optional)..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
          />
          <button className="jf-feedback__submit" onClick={handleSubmit}>
            Send
          </button>
        </div>
      )}

      {submitted && (
        <div className="jf-feedback__success">
          ✓ Thanks for your feedback!
        </div>
      )}

      {/* Mood distribution */}
      <div className="jf-feedback__distribution">
        {moodCounts.map(m => (
          <div key={m.value} className="jf-feedback__bar-row">
            <span className="jf-feedback__bar-emoji">{m.emoji}</span>
            <div className="jf-feedback__bar-track">
              <div
                className="jf-feedback__bar-fill"
                style={{ width: feedbacks.length ? `${(m.count / feedbacks.length) * 100}%` : '0%' }}
              />
            </div>
            <span className="jf-feedback__bar-count">{m.count}</span>
          </div>
        ))}
      </div>

      {/* Recent feedback */}
      <div className="jf-feedback__recent">
        <span className="jf-feedback__recent-title">Recent</span>
        {feedbacks.slice(0, 4).map(f => (
          <div key={f.id} className="jf-feedback__entry">
            <span className="jf-feedback__entry-emoji">{f.emoji}</span>
            <div className="jf-feedback__entry-content">
              <div className="jf-feedback__entry-top">
                <span className="jf-feedback__entry-name">{f.name}</span>
                <span className="jf-feedback__entry-time">{f.time}</span>
              </div>
              <p className="jf-feedback__entry-comment">{f.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CampFeedback;
