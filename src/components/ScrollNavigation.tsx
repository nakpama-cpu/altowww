import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useNavigationVisibility } from "@/contexts/NavigationVisibilityContext";



const ScrollNavigation = () => {
  const { visible, show, hover } = useNavigationVisibility();
  const [mounted, setMounted] = useState(false);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isAnimatingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  const collectSections = useCallback(() => {
    const list = Array.from(document.querySelectorAll("section")) as HTMLElement[];
    sectionsRef.current = list.filter(
      (s) => s.offsetHeight > 0 && !s.hasAttribute("aria-live")
    );
  }, []);

  const ACTIVE_OFFSET = 80;

  const getHeaderHeight = useCallback(() => {
    const header = document.querySelector("header") as HTMLElement | null;
    if (!header) return 80;
    if (window.innerWidth < 768) return header.offsetHeight;
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    // Header uses `md:py-6` when expanded (at top) and shrinks to `md:py-3` after scroll.
    // Since we're scrolling AWAY from the top, use the shrunk header height as the offset.
    const expanded =
      header.classList.contains("md:py-6") || header.classList.contains("py-6");
    return header.offsetHeight - (expanded ? rootFontSize * 1.5 : 0);
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

  const cancelSmoothScroll = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    isAnimatingRef.current = false;
  }, []);

  const smoothScrollTo = useCallback((targetY: number, duration = 900) => {
    cancelSmoothScroll();
    const startY = window.scrollY;
    const delta = targetY - startY;
    if (Math.abs(delta) < 2) {
      computeCurrent();
      return;
    }
    const startTime = performance.now();
    isAnimatingRef.current = true;
    show();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeInOutCubic
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      window.scrollTo(0, Math.round(startY + delta * ease));
      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(step);
      } else {
        isAnimatingRef.current = false;
        rafIdRef.current = null;
        computeCurrent();
      }
    };
    rafIdRef.current = requestAnimationFrame(step);
  }, [cancelSmoothScroll, computeCurrent, show]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    collectSections();
    computeCurrent();
    setMounted(true);

    const onResize = () => {
      cancelSmoothScroll();
      collectSections();
      computeCurrent();
    };
    const onScroll = () => {
      // Skip state updates during a programmatic scroll to avoid jitter.
      if (!isAnimatingRef.current) {
        computeCurrent();
      }
      show();
    };

    const onWheel = () => cancelSmoothScroll();
    const onTouchStart = () => cancelSmoothScroll();

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", show, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });

    const t1 = window.setTimeout(() => {
      collectSections();
    }, 400);
    const t2 = window.setTimeout(() => {
      collectSections();
    }, 1200);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", show);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      cancelSmoothScroll();
    };
  }, [collectSections, computeCurrent, show, cancelSmoothScroll]);

  const scrollTo = useCallback((direction: "up" | "down") => {
    const sections = sectionsRef.current;
    if (!sections.length) return;
    const scrollY = window.scrollY;
    let idx = 0;
    sections.forEach((s, i) => {
      const absTop = s.getBoundingClientRect().top + scrollY;
      if (absTop <= scrollY + ACTIVE_OFFSET) idx = i;
    });

    if (direction === "up") {
      // If we're already on the first section but not at the very top, snap to 0
      if (idx === 0 && scrollY > 0) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        show();
        return;
      }
      const target = sections[idx - 1];
      if (!target) return;
      const targetIdx = idx - 1;
      let targetTop: number;
      if (targetIdx === 0) {
        targetTop = 0;
      } else {
        const headerHeight = getHeaderHeight();
        const scrollTarget = document.getElementById(`${target.id}-start`) || target;
        targetTop =
          window.getComputedStyle(scrollTarget).position === "fixed"
            ? 0
            : scrollTarget.getBoundingClientRect().top + window.scrollY - headerHeight;
      }
      window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
      show();
      return;
    }

    const target = sections[idx + 1];
    if (!target) return;
    const headerHeight = getHeaderHeight();
    const scrollTarget = document.getElementById(`${target.id}-start`) || target;
    const targetTop =
      window.getComputedStyle(scrollTarget).position === "fixed"
        ? 0
        : scrollTarget.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
    show();
  }, [getHeaderHeight, show]);

  if (!mounted || sectionsRef.current.length < 2) return null;

  const canGoUp = currentIndex > 0 || (typeof window !== "undefined" && window.scrollY > 0);
  const canGoDown = currentIndex < sectionsRef.current.length - 1;

  return (
    <div
      className={`fixed bottom-3 left-1/2 -translate-x-1/2 z-[60] pointer-events-none transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="group w-12 h-12 rounded-full backdrop-blur-md bg-secondary/25 border border-secondary-foreground/15 shadow-lg flex flex-col items-center justify-center overflow-hidden pointer-events-auto transition-all duration-300 hover:bg-secondary/70 hover:border-secondary-foreground/30"
        onMouseEnter={() => hover(true)}
        onMouseLeave={() => hover(false)}
      >
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
