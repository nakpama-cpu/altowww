import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const BUTTON_SIZE = 48;
const BUTTON_RADIUS = BUTTON_SIZE / 2;
const SCROLL_OFFSET = 80;

const getAbsoluteOffsetTop = (el: HTMLElement | null): number => {
  let top = 0;
  let node: HTMLElement | null = el;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
};

const ScrollNavigation = () => {
  const [top, setTop] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getCurrentIndex = useCallback(() => {
    if (!sectionsRef.current.length) return 0;
    const y = window.scrollY;
    let idx = 0;
    sectionsRef.current.forEach((section, i) => {
      if ((section as HTMLElement).offsetTop <= y + SCROLL_OFFSET) {
        idx = i;
      }
    });
    return idx;
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const refresh = () => {
      const hero = document.getElementById("heritage");
      const heroHeight = hero?.offsetHeight;
      setTop(heroHeight ?? null);
      sectionsRef.current = Array.from(document.querySelectorAll("section")) as HTMLElement[];
      setCurrentIndex(getCurrentIndex());
    };

    refresh();
    setMounted(true);

    const onResize = () => refresh();
    const onScroll = () => setCurrentIndex(getCurrentIndex());

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [getCurrentIndex]);

  const scrollTo = useCallback(
    (direction: "up" | "down") => {
      const idx = getCurrentIndex();
      const target =
        direction === "up"
          ? sectionsRef.current[idx - 1]
          : sectionsRef.current[idx + 1];
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [getCurrentIndex]
  );

  if (!mounted || top === null || sectionsRef.current.length < 2) return null;

  const canGoUp = currentIndex > 0;
  const canGoDown = currentIndex < sectionsRef.current.length - 1;

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-[60] pointer-events-none bottom-4 md:bottom-auto md:top-[var(--scroll-btn-top)] transition-opacity duration-300"
      style={
        {
          "--scroll-btn-top": `${top - BUTTON_RADIUS}px`,
        } as React.CSSProperties
      }
    >
      <div
        className="w-12 h-12 rounded-full backdrop-blur-md bg-secondary/30 border border-secondary-foreground/20 shadow-lg flex flex-col items-center justify-center overflow-hidden pointer-events-auto transition-colors hover:bg-secondary/40"
      >
        <button
          type="button"
          aria-label="Previous section"
          disabled={!canGoUp}
          onClick={() => scrollTo("up")}
          className="flex-1 w-full flex items-end justify-center pb-0.5 disabled:opacity-30 transition-opacity hover:opacity-100"
        >
          <ChevronUp
            size={18}
            strokeWidth={1.5}
            className="text-secondary-foreground/70"
          />
        </button>
        <button
          type="button"
          aria-label="Next section"
          disabled={!canGoDown}
          onClick={() => scrollTo("down")}
          className="flex-1 w-full flex items-start justify-center pt-0.5 disabled:opacity-30 transition-opacity hover:opacity-100"
        >
          <ChevronDown
            size={18}
            strokeWidth={1.5}
            className="text-secondary-foreground/70"
          />
        </button>
      </div>
    </div>
  );
};

export default ScrollNavigation;
