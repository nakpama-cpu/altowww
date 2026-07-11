interface MobileMenuButtonProps {
  open: boolean;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

export default function MobileMenuButton({
  open,
  onClick,
  className = "",
  ariaLabel = "Toggle menu",
}: MobileMenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 w-10 h-10 -mr-2 transition-colors hover:text-primary ${className}`}
      aria-label={ariaLabel}
      aria-expanded={open}
    >
      <span
        className={`block w-6 h-px bg-current transition-all duration-300 ${
          open ? "rotate-45 translate-y-[3.5px]" : ""
        }`}
      />
      <span
        className={`block w-6 h-px bg-current transition-all duration-300 ${
          open ? "opacity-0" : ""
        }`}
      />
      <span
        className={`block w-6 h-px bg-current transition-all duration-300 ${
          open ? "-rotate-45 -translate-y-[3.5px]" : ""
        }`}
      />
    </button>
  );
}
