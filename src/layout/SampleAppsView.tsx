import { useState } from 'react';
import { CamperCard } from '../components/CamperCard/CamperCard';

type AppPage = 'home' | 'family-portal' | 'sessions' | 'campers' | 'registration';

const NAV_ITEMS: { id: AppPage; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'family-portal', label: 'Family Portal' },
  { id: 'sessions', label: 'Sessions' },
  { id: 'campers', label: 'Campers' },
  { id: 'registration', label: 'Registration' },
];

const SESSIONS = [
  { name: 'Campfire Week', date: 'July 15 - July 19', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200&h=200&fit=crop', emoji: '🔥' },
  { name: 'Archery Bullseye', date: 'July 8 - July 12', image: 'https://images.unsplash.com/photo-1510925758641-869d353cecc7?w=200&h=200&fit=crop', emoji: '🏹' },
  { name: 'Adventure Canoe Races', date: 'June 10 - June 14', image: 'https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=200&h=200&fit=crop', emoji: '🛶' },
  { name: 'Nature Explorer', date: 'June 10 - June 14', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop', emoji: '🌿' },
];

export function SampleAppsView() {
  const [selectedApp] = useState('campfire-trails');
  const [currentPage, setCurrentPage] = useState<AppPage>('home');

  return (
    <div className="sample-apps">
      {/* Sidebar */}
      <aside className="sample-apps__sidebar">
        <div className="sample-apps__sidebar-header">
          <h3 className="sample-apps__sidebar-title">Sample Apps</h3>
          <p className="sample-apps__sidebar-desc">Preview apps built with the component library</p>
        </div>
        <div className="sample-apps__list">
          <button className={`sample-apps__item ${selectedApp === 'campfire-trails' ? 'sample-apps__item--active' : ''}`}>
            <span className="sample-apps__item-icon">🏕️</span>
            <div className="sample-apps__item-text">
              <span className="sample-apps__item-name">Campfire Trails</span>
              <span className="sample-apps__item-desc">Summer camp management</span>
            </div>
          </button>
        </div>
      </aside>

      {/* App Preview */}
      <main className="sample-apps__preview">
        <div className="sample-apps__app">
          {/* Nav Bar */}
          <nav className="sample-apps__topnav">
            <div className="sample-apps__topnav-links">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  className={`sample-apps__topnav-link ${currentPage === item.id ? 'sample-apps__topnav-link--active' : ''}`}
                  onClick={() => setCurrentPage(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="sample-apps__topnav-avatar">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
            </div>
          </nav>

          {/* Hero Banner */}
          <div className="sample-apps__hero">
            <div className="sample-apps__hero-icon">⛺</div>
            <h1 className="sample-apps__hero-title">Campfire Trails</h1>
          </div>

          {/* Page Content */}
          <div className="sample-apps__body">
            <div className="sample-apps__container">

              {/* HOME */}
              {currentPage === 'home' && (
                <div className="sample-apps__card">
                  <div className="sample-apps__heading">
                    <h2>Welcome to Summer Camp Hub</h2>
                    <p>Register for unforgettable camp sessions and relive the best moments in our shared memories gallery.</p>
                  </div>

                  <div className="sample-apps__link-card" onClick={() => setCurrentPage('registration')}>
                    <div className="sample-apps__link-icon-box">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                      </svg>
                    </div>
                    <div className="sample-apps__link-text">
                      <h3>Register for Camp</h3>
                      <p>Sign up campers for upcoming sessions with a simple online form.</p>
                    </div>
                    <div className="sample-apps__link-arrow-box">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </div>
                  </div>

                  <div className="sample-apps__link-card" onClick={() => setCurrentPage('family-portal')}>
                    <div className="sample-apps__link-icon-box">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <div className="sample-apps__link-text">
                      <h3>Family Portal</h3>
                      <p>Upload your favorite camp photos and stories to the gallery.</p>
                    </div>
                    <div className="sample-apps__link-arrow-box">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </div>
                  </div>

                  <div className="sample-apps__link-card" onClick={() => setCurrentPage('sessions')}>
                    <div className="sample-apps__link-icon-box">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      </svg>
                    </div>
                    <div className="sample-apps__link-text">
                      <h3>Share Camp Memories</h3>
                      <p>Upload your favorite camp photos and stories to the gallery.</p>
                    </div>
                    <div className="sample-apps__link-arrow-box">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </div>
                  </div>
                </div>
              )}

              {/* FAMILY PORTAL */}
              {currentPage === 'family-portal' && (
                <div className="sample-apps__card">
                  <div className="sample-apps__heading">
                    <h2>Family Portal</h2>
                    <p>Submit and manage information and photos for your camper.</p>
                  </div>

                  <div className="sample-apps__form-link">
                    <div className="sample-apps__form-link-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                        <path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
                      </svg>
                    </div>
                    <span>Camper Immunization Record</span>
                  </div>

                  <div className="sample-apps__form-link">
                    <div className="sample-apps__form-link-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                        <path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
                      </svg>
                    </div>
                    <span>Camper Healthcare Information</span>
                  </div>

                  <div className="sample-apps__form-link">
                    <div className="sample-apps__form-link-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                        <path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
                      </svg>
                    </div>
                    <span>Camper Transportation Planning</span>
                  </div>
                </div>
              )}

              {/* SUMMER CAMP SESSIONS */}
              {currentPage === 'sessions' && (
                <div className="sample-apps__card">
                  <div className="sample-apps__heading">
                    <h2>Summer Camp Sessions</h2>
                    <p>Browse our upcoming sessions, themes, and age groups.</p>
                  </div>

                  <div className="sample-apps__sessions-list">
                    {SESSIONS.map((s, i) => (
                      <div key={i} className="sample-apps__session-item">
                        <img className="sample-apps__session-thumb" src={s.image} alt={s.name} />
                        <div className="sample-apps__session-info">
                          <span className="sample-apps__session-name">{s.name}</span>
                          <span className="sample-apps__session-date">{s.date}</span>
                        </div>
                        <svg className="sample-apps__session-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CAMPERS */}
              {currentPage === 'campers' && (
                <div className="sample-apps__card sample-apps__camper-page">
                  <div className="sample-apps__heading">
                    <h2>Campers</h2>
                    <p>Register for unforgettable camp sessions and relive the best moments in our shared memories gallery.</p>
                  </div>
                  <CamperCard />
                </div>
              )}

              {/* REGISTRATION */}
              {currentPage === 'registration' && (
                <div className="sample-apps__card">
                  <div className="sample-apps__heading">
                    <h2>Camper Registration</h2>
                    <p>Complete this form to register your camper for summer camp.</p>
                  </div>

                  <div className="sample-apps__form-link">
                    <div className="sample-apps__form-link-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                        <path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
                      </svg>
                    </div>
                    <span>Summer Camp Registration</span>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
