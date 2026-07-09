import { useEffect, useState } from "react";
import { useNavigationVisibility } from "@/contexts/NavigationVisibilityContext";

interface ChapterMarkerProps {
  chapters: { id: string; label: string }[];
}

const ChapterMarker = ({ chapters }: ChapterMarkerProps) => {
  const [activeChapter, setActiveChapter] = useState(chapters[0]?.id || "");
  const { visible } = useNavigationVisibility();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveChapter(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    chapters.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [chapters]);

  return (
    <nav
      className={`fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-6 transition-opacity duration-300 ${
        visible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {chapters.map(({ id, label }, index) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={(e) => {
            e.preventDefault();
            if (index === 0) {
              window.scrollTo({ top: 0, behavior: "smooth" });
              history.replaceState(null, "", `#${id}`);
              return;
            }
            const el =
              document.getElementById(`${id}-start`) || document.getElementById(id);
            if (!el) return;
            const header = document.querySelector("header");
            const headerHeight = header ? (header as HTMLElement).offsetHeight : 0;
            const top = el.getBoundingClientRect().top + window.scrollY - headerHeight;
            window.scrollTo({ top, behavior: "smooth" });
            history.replaceState(null, "", `#${id}`);
        }}
          className={`chapter-marker transition-all duration-500 ${
            activeChapter === id
              ? "opacity-100 translate-x-0"
              : "opacity-30 -translate-x-2"
          }`}
        >
          {label}
        </a>
      ))}
    </nav>
  );
};

export default ChapterMarker;
