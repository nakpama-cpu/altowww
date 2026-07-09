import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from "react";

interface NavigationVisibilityContextValue {
  visible: boolean;
  show: () => void;
  hover: (active: boolean) => void;
}

const NavigationVisibilityContext = createContext<NavigationVisibilityContextValue | null>(null);

const IDLE_MS = 1000;

export const NavigationVisibilityProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const hoverCountRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  const show = useCallback(() => {
    setVisible(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (hoverCountRef.current === 0) {
      timerRef.current = window.setTimeout(hide, IDLE_MS);
    }
  }, [hide]);

  const hover = useCallback((active: boolean) => {
    hoverCountRef.current = Math.max(0, hoverCountRef.current + (active ? 1 : -1));
    if (hoverCountRef.current > 0) {
      setVisible(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    } else {
      show();
    }
  }, [show]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <NavigationVisibilityContext.Provider value={{ visible, show, hover }}>
      {children}
    </NavigationVisibilityContext.Provider>
  );
};

export const useNavigationVisibility = () => {
  const ctx = useContext(NavigationVisibilityContext);
  const [fallbackVisible, setFallbackVisible] = useState(false);
  const fallbackShow = useCallback(() => setFallbackVisible(true), []);
  const fallbackHover = useCallback((_active: boolean) => {}, []);

  if (ctx) return ctx;
  return {
    visible: fallbackVisible,
    show: fallbackShow,
    hover: fallbackHover,
  };
};
