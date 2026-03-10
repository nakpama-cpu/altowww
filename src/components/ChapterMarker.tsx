import { useEffect, useState } from "react";

interface ChapterMarkerProps {
  chapters: { id: string; label: string }[];
}

const ChapterMarker = ({ chapters }: ChapterMarkerProps) => {
  const [activeChapter, setActiveChapter] = useState(chapters[0]?.id || "");

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
    <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-6">
      {chapters.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
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
