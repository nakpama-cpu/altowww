import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const BUTTON_SIZE = 48;
const EDGE_MARGIN = 12;
const ACTIVE_OFFSET = 80;
const IDLE_HIDE_MS = 1000;

const ScrollNavigation = () => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const idleTimerRef = useRef<number | null>(null);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const collectSections = useCallback(() => {
    const list = Array.from(document.querySelectorAll("section")) as HTMLElement[];
    sectionsRef.current = list.filter(
      (s) => s.offsetHeight > 0 && !s.hasAttribute("aria-live")
    );
  }, []);

  const computeCurrent = useCallback(() => {
    const sections = sectionsRef.current;
    if (!sections.length) return 0;

    const scrollY = window.scrollY;
    let idx = 0;
    sections.forEach((s, i) => {
      const absTop = s.getBoundingClientRect().top + scrollY;
      if (absTop <= scrollY + ACTIVE_OFFSET) idx = i;
    });
    setCurrentIndex(idx);
    return idx;
  }, []);

  const resetIdleTimer = useCallback(() => {
    setVisible(true);
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      setVisible(false);
    }, IDLE_HIDE_MS);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    collectSections();
    computeCurrent();
    setMounted(true);

    const onResize = () => {
      collectSections();
    };
    const onScroll = () => {
      computeCurrent();
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", resetIdleTimer, { passive: true });

    // Show briefly on mount so the user notices it, then hide on idle
    resetIdleTimer();

    const t1 = window.setTimeout(() => {
      collectSections();
    }, 400);
    const t2 = window.setTimeout(() => {
      collectSections();
    }, 1200);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", resetIdleTimer);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [collectSections, computeCurrent, resetIdleTimer]);

  const scrollTo = useCallback((direction: "up" | "down") => {
    const sections = sectionsRef.current;
    if (!sections.length) return;
    const scrollY = window.scrollY;
    let idx = 0;
    sections.forEach((s, i) => {
      const absTop = s.getBoundingClientRect().top + scrollY;
      if (absTop <= scrollY + ACTIVE_OFFSET) idx = i;
    });
    const target =
      direction === "up" ? sections[idx - 1] : sections[idx + 1];
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    resetIdleTimer();
  }, [resetIdleTimer]);

  if (!mounted || sectionsRef.current.length < 2) return null;

  const canGoUp = currentIndex > 0;
  const canGoDown = currentIndex < sectionsRef.current.length - 1;

  return (
    <div
      className={`fixed bottom-3 left-1/2 -translate-x-1/2 z-[60] pointer-events-none transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="group w-12 h-12 rounded-full backdrop-blur-md bg-secondary/25 border border-secondary-foreground/15 shadow-lg flex flex-col items-center justify-center overflow-hidden pointer-events-auto transition-all duration-300 hover:bg-secondary/70 hover:border-secondary-foreground/30">
        <button
          type="button"
          aria-label="Previous section"
          disabled={!canGoUp}
          onClick={() => scrollTo("up")}
          className="flex-1 w-full flex items-end justify-center pb-0.5 disabled:opacity-30 transition-opacity group-hover:opacity-100"
        >
          <ChevronUp size={18} strokeWidth={1.5} className="text-secondary-foreground/80" />
        </button>
        <button
          type="button"
          aria-label="Next section"
          disabled={!canGoDown}
          onClick={() => scrollTo("down")}
          className="flex-1 w-full flex items-start justify-center pt-0.5 disabled:opacity-30 transition-opacity group-hover:opacity-100"
        >
          <ChevronDown size={18} strokeWidth={1.5} className="text-secondary-foreground/80" />
        </button>
      </div>
    </div>
  );
};

export default ScrollNavigation;
