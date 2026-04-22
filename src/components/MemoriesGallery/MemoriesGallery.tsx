import { useMemo, useState, type FC } from 'react';
import './MemoriesGallery.scss';

export type MemoriesColumns = '2' | '3' | '4';

export interface MemoriesGalleryProps {
  columns?: MemoriesColumns;
  selected?: boolean;
  shrinked?: boolean;
}

interface Memory {
  id: string;
  title: string;
  image: string;
  session: string | null;
  description: string | null;
}

const MEMORIES: Memory[] = [
  {
    id: 'family-visiting',
    title: 'Family Visiting Day',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=400&fit=crop',
    session: null,
    description: null,
  },
  {
    id: 'team-sports',
    title: 'Team Sports Day',
    image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&h=400&fit=crop',
    session: null,
    description: null,
  },
  {
    id: 'lake-canoe',
    title: 'Lake Canoe Adventure',
    image: 'https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=600&h=400&fit=crop',
    session: null,
    description: null,
  },
  {
    id: 'campfire',
    title: 'Campfire Sing-Along',
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&h=400&fit=crop',
    session: null,
    description: null,
  },
];

const SESSION_OPTIONS = [
  { value: 'all', label: 'All sessions' },
  { value: 'summer-a', label: 'Summer A' },
  { value: 'summer-b', label: 'Summer B' },
  { value: 'fall', label: 'Fall' },
];

export const MemoriesGallery: FC<MemoriesGalleryProps> = ({
  columns = '3',
  selected = false,
  shrinked = false,
}) => {
  const [query, setQuery] = useState('');
  const [session, setSession] = useState('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MEMORIES.filter((m) => {
      const matchesQuery = !q || m.title.toLowerCase().includes(q);
      const matchesSession = session === 'all' || m.session === session;
      return matchesQuery && matchesSession;
    });
  }, [query, session]);

  const rootClasses = [
    'jf-memories',
    `jf-memories--cols-${columns}`,
    selected && 'jf-memories--selected',
    shrinked && 'jf-memories--shrinked',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClasses}>
      <div className="jf-memories__filters">
        <div className="jf-memories__field">
          <label className="jf-memories__label" htmlFor="memories-search">
            Search memories
          </label>
          <input
            id="memories-search"
            type="text"
            className="jf-memories__input"
            placeholder="Title or camper name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="jf-memories__field">
          <label className="jf-memories__label" htmlFor="memories-session">
            Session or week
          </label>
          <select
            id="memories-session"
            className="jf-memories__select"
            value={session}
            onChange={(e) => setSession(e.target.value)}
          >
            {SESSION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="jf-memories__grid">
        {filtered.map((memory) => (
          <article key={memory.id} className="jf-memories__card">
            <div className="jf-memories__image-wrap">
              <img
                className="jf-memories__image"
                src={memory.image}
                alt={memory.title}
                loading="lazy"
              />
            </div>
            <div className="jf-memories__body">
              <h3 className="jf-memories__title">{memory.title}</h3>
              <span
                className={`jf-memories__badge jf-memories__badge--${
                  memory.session ? 'info' : 'warning'
                }`}
              >
                {memory.session ?? 'Session not specified'}
              </span>
              <p className="jf-memories__desc">
                {memory.description ?? 'No description provided.'}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default MemoriesGallery;
