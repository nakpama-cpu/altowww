import { useEffect, useState } from "react";
import BrochureButton from "@/components/BrochureButton";

const StickyMobileCTA = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past the hero
      setShow(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-500 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-secondary/95 backdrop-blur-md border-t border-secondary-foreground/10 px-4 py-3 flex gap-3">
        <BrochureButton className="flex-1 font-body text-xs uppercase tracking-[0.2em] bg-primary text-primary-foreground py-3 hover:opacity-90 transition-opacity text-center" />
      </div>
    </div>
  );
};

export default StickyMobileCTA;
