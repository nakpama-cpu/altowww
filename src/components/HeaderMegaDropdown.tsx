import { useEffect, useRef, useState } from "react";
import NewsPanel from "@/components/NewsMegaDropdown";
import AboutPanel from "@/components/AboutMegaDropdown";

export type MegaMenuKey = "news" | "about" | null;

interface Props {
  active: MegaMenuKey;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const HeaderMegaDropdown = ({ active, onMouseEnter, onMouseLeave }: Props) => {
  const open = active !== null;
  // Track the previous active key so the outgoing panel slides down out,
  // and the incoming panel slides down from above.
  const [prev, setPrev] = useState<MegaMenuKey>(null);
  const prevRef = useRef<MegaMenuKey>(null);

  useEffect(() => {
    // Update prev after render so transitions can play from the old position.
    const id = window.requestAnimationFrame(() => {
      prevRef.current = active;
      setPrev(active);
    });
    return () => window.cancelAnimationFrame(id);
  }, [active]);

  const panelClass = (key: "news" | "about") => {
    const isActive = active === key;
    const wasActive = prev === key;
    if (isActive) return "translate-y-0 opacity-100";
    // Outgoing (was active, now not) slides down out.
    if (wasActive) return "translate-y-full opacity-0";
    // Idle (waiting above) so it can slide down in when activated.
    return "-translate-y-full opacity-0";
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute left-0 right-0 top-full mt-0 bg-secondary/95 backdrop-blur-md transition-[opacity,transform] duration-300 overflow-hidden h-[218px] ${
        open
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <div
        className={`absolute inset-0 transition-[transform,opacity] duration-500 ease-out ${panelClass("news")}`}
      >
        <NewsPanel active={active === "news"} />
      </div>
      <div
        className={`absolute inset-0 transition-[transform,opacity] duration-500 ease-out ${panelClass("about")}`}
      >
        <AboutPanel />
      </div>
    </div>
  );
};

export default HeaderMegaDropdown;
