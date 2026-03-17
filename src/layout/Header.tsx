import { useTheme } from '../hooks/useTheme';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="app-header__logo">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="6" fill="#FF6100" />
          <path
            d="M8 7h12v2H8V7zm0 4h12v2H8v-2zm0 4h8v2H8v-2zm0 4h10v2H8v-2z"
            fill="white"
          />
        </svg>
        <span>JotForm Apps</span>
        <span className="app-header__divider">|</span>
        <span className="app-header__subtitle">Component Library</span>
      </div>
      <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
        {theme === 'light' ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>
    </header>
  );
}
