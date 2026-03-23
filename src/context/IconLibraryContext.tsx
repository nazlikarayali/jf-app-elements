import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { loadLibrary, type IconLibrary } from '../utils/iconRegistry';

interface IconLibraryContextType {
  library: IconLibrary;
  setLibrary: (lib: IconLibrary) => void;
}

const IconLibraryContext = createContext<IconLibraryContextType>({
  library: 'lucide',
  setLibrary: () => {},
});

export function IconLibraryProvider({ children }: { children: ReactNode }) {
  const [library, setLibraryState] = useState<IconLibrary>('lucide');

  const setLibrary = useCallback(async (lib: IconLibrary) => {
    await loadLibrary(lib);
    setLibraryState(lib);
  }, []);

  // Preload lucide on mount (it's synchronous anyway)
  useEffect(() => {
    loadLibrary('lucide');
  }, []);

  return (
    <IconLibraryContext.Provider value={{ library, setLibrary }}>
      {children}
    </IconLibraryContext.Provider>
  );
}

export function useIconLibrary() {
  return useContext(IconLibraryContext);
}

export type { IconLibrary };
