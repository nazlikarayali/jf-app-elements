import { useEffect, type FC, type ReactNode } from 'react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  noOverlay?: boolean;
  dark?: boolean;
}

export const BottomSheet: FC<BottomSheetProps> = ({ open, onClose, title, children, noOverlay, dark }) => {
  useEffect(() => {
    if (open && !noOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open, noOverlay]);

  if (!open) return null;

  if (noOverlay) {
    return (
      <div className="bottom-sheet bottom-sheet--no-overlay" data-theme={dark ? 'dark' : undefined} onClick={(e) => e.stopPropagation()}>
        <div className="bottom-sheet__header">
          <div className="bottom-sheet__handle" />
          <span className="bottom-sheet__title">{title}</span>
          <button className="bottom-sheet__close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="bottom-sheet__body">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="bottom-sheet__overlay" onClick={onClose}>
      <div className="bottom-sheet" data-theme={dark ? 'dark' : undefined} onClick={(e) => e.stopPropagation()}>
        <div className="bottom-sheet__header">
          <div className="bottom-sheet__handle" />
          <span className="bottom-sheet__title">{title}</span>
          <button className="bottom-sheet__close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="bottom-sheet__body">
          {children}
        </div>
      </div>
    </div>
  );
};
