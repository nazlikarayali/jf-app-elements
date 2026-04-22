import { useState, useMemo } from 'react';
import './DestinationExplorer.scss';

export interface Destination {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  distance: string;
  description: string;
  tags: string[];
  color: string;
  favorited: boolean;
}

export interface DestinationExplorerProps {
  selected?: boolean;
}

const CATEGORIES = ['All', 'Beaches', 'Churches', 'Resorts', 'Mountains', 'Historical Sites'];

const SORT_OPTIONS = [
  { label: 'Popularity', value: 'popularity' },
  { label: 'Rating', value: 'rating' },
  { label: 'Distance', value: 'distance' },
  { label: 'Name A–Z', value: 'name' },
];

const DEFAULT_DESTINATIONS: Destination[] = [
  {
    id: '1', name: 'Hundredth Island', category: 'Beaches',
    rating: 4.8, reviews: 1240, distance: '2.3 km',
    description: 'Stunning archipelago with crystal-clear waters and white sand beaches.',
    tags: ['Snorkeling', 'Boat Tour', 'Family'],
    color: '#0EA5E9', favorited: true,
  },
  {
    id: '2', name: 'Manaoag Church', category: 'Churches',
    rating: 4.9, reviews: 3200, distance: '15 km',
    description: 'Famous pilgrimage site dedicated to Our Lady of Manaoag.',
    tags: ['Pilgrimage', 'Heritage', 'Spiritual'],
    color: '#8B5CF6', favorited: false,
  },
  {
    id: '3', name: 'Poro Point Resort', category: 'Resorts',
    rating: 4.5, reviews: 870, distance: '8 km',
    description: 'Modern beachfront resort with panoramic views of Lingayen Gulf.',
    tags: ['Pool', 'Spa', 'Dining'],
    color: '#10B981', favorited: false,
  },
  {
    id: '4', name: 'Mt. Balungao', category: 'Mountains',
    rating: 4.7, reviews: 560, distance: '42 km',
    description: 'A popular trekking destination with lush forests and scenic peaks.',
    tags: ['Trekking', 'Camping', 'Nature'],
    color: '#F59E0B', favorited: true,
  },
  {
    id: '5', name: 'Lingayen Capitol', category: 'Historical Sites',
    rating: 4.6, reviews: 980, distance: '5 km',
    description: 'Historic landmark and seat of provincial government with beautiful gardens.',
    tags: ['History', 'Architecture', 'Gardens'],
    color: '#EF4444', favorited: false,
  },
  {
    id: '6', name: 'Bolinao Falls', category: 'Beaches',
    rating: 4.7, reviews: 720, distance: '30 km',
    description: 'Breathtaking waterfalls surrounded by lush tropical forest.',
    tags: ['Waterfall', 'Swimming', 'Nature'],
    color: '#06B6D4', favorited: false,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="jf-dest__stars">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export function DestinationExplorer({ selected = false }: DestinationExplorerProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [destinations, setDestinations] = useState<Destination[]>(DEFAULT_DESTINATIONS);
  const [page, setPage] = useState(1);
  const PER_PAGE = 4;

  const toggleFavorite = (id: string) => {
    setDestinations(prev => prev.map(d => d.id === id ? { ...d, favorited: !d.favorited } : d));
  };

  const filtered = useMemo(() => {
    let result = destinations.filter(d => {
      const matchCat = activeCategory === 'All' || d.category === activeCategory;
      const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });

    if (sortBy === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'distance') result = [...result].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    return result;
  }, [destinations, activeCategory, search, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const classes = ['jf-dest', selected && 'jf-dest--selected'].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {/* Header */}
      <div className="jf-dest__header">
        <div>
          <h2 className="jf-dest__title">Destinations in Pangasinan</h2>
          <p className="jf-dest__subtitle">Browse beaches, churches, resorts, mountains, and historical sites.</p>
        </div>
        <div className="jf-dest__count-badge">{filtered.length} places</div>
      </div>

      {/* Toolbar: Search + Sort + View Toggle */}
      <div className="jf-dest__toolbar">
        {/* Search */}
        <div className="jf-dest__search">
          <svg className="jf-dest__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="jf-dest__search-input"
            type="text"
            placeholder="Search destinations..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          {search && (
            <button className="jf-dest__search-clear" onClick={() => setSearch('')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="jf-dest__sort">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18M7 12h10M11 18h2" />
          </svg>
          <select
            className="jf-dest__select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* View toggle */}
        <div className="jf-dest__view-toggle">
          <button
            className={`jf-dest__view-btn${viewMode === 'grid' ? ' active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
          </button>
          <button
            className={`jf-dest__view-btn${viewMode === 'list' ? ' active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Category filter tags */}
      <div className="jf-dest__tags">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`jf-dest__tag${activeCategory === cat ? ' active' : ''}`}
            onClick={() => { setActiveCategory(cat); setPage(1); }}
          >
            {cat}
            {cat !== 'All' && (
              <span className="jf-dest__tag-count">
                {destinations.filter(d => d.category === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Results */}
      {paginated.length === 0 ? (
        <div className="jf-dest__empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <p>No destinations found{search ? ` for "${search}"` : ''}.</p>
          <button className="jf-dest__empty-btn" onClick={() => { setSearch(''); setActiveCategory('All'); }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className={`jf-dest__results jf-dest__results--${viewMode}`}>
          {paginated.map(dest => (
            <div key={dest.id} className={`jf-dest__card jf-dest__card--${viewMode}`}>
              {/* Image placeholder */}
              <div className="jf-dest__card-img" style={{ background: `linear-gradient(135deg, ${dest.color}33, ${dest.color}66)` }}>
                <div className="jf-dest__card-img-icon" style={{ color: dest.color }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                {/* Favorite button */}
                <button
                  className={`jf-dest__favorite${dest.favorited ? ' active' : ''}`}
                  onClick={() => toggleFavorite(dest.id)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={dest.favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
                {/* Distance badge */}
                <div className="jf-dest__distance">{dest.distance}</div>
              </div>

              {/* Card body */}
              <div className="jf-dest__card-body">
                <div className="jf-dest__card-top">
                  <span className="jf-dest__category-tag" style={{ background: dest.color + '1A', color: dest.color }}>
                    {dest.category}
                  </span>
                  <div className="jf-dest__rating">
                    <StarRating rating={dest.rating} />
                    <span className="jf-dest__rating-value">{dest.rating}</span>
                    <span className="jf-dest__reviews">({dest.reviews.toLocaleString()})</span>
                  </div>
                </div>
                <h3 className="jf-dest__card-name">{dest.name}</h3>
                {viewMode === 'list' && (
                  <p className="jf-dest__card-desc">{dest.description}</p>
                )}
                <div className="jf-dest__card-tags">
                  {dest.tags.map(tag => (
                    <span key={tag} className="jf-dest__pill">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="jf-dest__pagination">
          <button
            className="jf-dest__page-btn"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`jf-dest__page-btn${page === p ? ' active' : ''}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="jf-dest__page-btn"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default DestinationExplorer;
