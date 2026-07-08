import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const BUTTON_SIZE = 48;
const BUTTON_RADIUS = BUTTON_SIZE / 2;
const EDGE_MARGIN = 12;
const ACTIVE_OFFSET = 80;

const ScrollNavigation = () => {
  const [mounted, setMounted] = useState(false);
  const [viewportTop, setViewportTop] = useState<number | null>(null);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const collectSections = useCallback(() => {
    const list = Array.from(document.querySelectorAll("section")) as HTMLElement[];
    // Exclude sr-only toast region and any zero-height sections
    sectionsRef.current = list.filter(
      (s) => s.offsetHeight > 0 && !s.hasAttribute("aria-live")
    );
  }, []);

  const compute = useCallback(() => {
    const sections = sectionsRef.current;
    if (!sections.length) return;

    // Determine current section: the last whose top is above scrollY+ACTIVE_OFFSET
    const scrollY = window.scrollY;
    let idx = 0;
    sections.forEach((s, i) => {
      const absTop = s.getBoundingClientRect().top + scrollY;
      if (absTop <= scrollY + ACTIVE_OFFSET) idx = i;
    });
    setCurrentIndex(idx);

    // Position the button at the boundary between current & next section
    const nextSection = sections[idx + 1];
    const vh = window.innerHeight;
    let desired: number;

    if (nextSection) {
      const rect = nextSection.getBoundingClientRect();
      desired = rect.top - BUTTON_RADIUS;
    } else {
      // No next section: pin near the bottom
      desired = vh - BUTTON_SIZE - EDGE_MARGIN;
    }

    // Clamp to viewport
    const min = EDGE_MARGIN;
    const max = vh - BUTTON_SIZE - EDGE_MARGIN;
    desired = Math.max(min, Math.min(max, desired));
    setViewportTop(desired);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    collectSections();
    compute();
    setMounted(true);

    const onResize = () => {
      collectSections();
      compute();
    };
    const onScroll = () => compute();

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    // Recompute after images/fonts load and layout settles
    const t1 = window.setTimeout(() => {
      collectSections();
      compute();
    }, 400);
    const t2 = window.setTimeout(() => {
      collectSections();
      compute();
    }, 1200);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [collectSections, compute]);

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
  }, []);

  if (!mounted || viewportTop === null || sectionsRef.current.length < 2)
    return null;

  const canGoUp = currentIndex > 0;
  const canGoDown = currentIndex < sectionsRef.current.length - 1;

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-[60] pointer-events-none"
      style={{ top: `${viewportTop}px` }}
    >
      <div className="w-12 h-12 rounded-full backdrop-blur-md bg-secondary/40 border border-secondary-foreground/20 shadow-lg flex flex-col items-center justify-center overflow-hidden pointer-events-auto transition-colors hover:bg-secondary/60">
        <button
          type="button"
          aria-label="Previous section"
          disabled={!canGoUp}
          onClick={() => scrollTo("up")}
          className="flex-1 w-full flex items-end justify-center pb-0.5 disabled:opacity-30 transition-opacity"
        >
          <ChevronUp size={18} strokeWidth={1.5} className="text-secondary-foreground/80" />
        </button>
        <button
          type="button"
          aria-label="Next section"
          disabled={!canGoDown}
          onClick={() => scrollTo("down")}
          className="flex-1 w-full flex items-start justify-center pt-0.5 disabled:opacity-30 transition-opacity"
        >
          <ChevronDown size={18} strokeWidth={1.5} className="text-secondary-foreground/80" />
        </button>
      </div>
    </div>
  );
};

export default ScrollNavigation;
