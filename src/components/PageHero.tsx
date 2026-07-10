interface PageHeroProps {
  image: string;
  imageAlt: string;
  children: React.ReactNode;
  /** Mobile hero height; desktop is standardized to match the homepage hero. */
  height?: string;
}

const PageHero = ({ image, imageAlt, children, height = "60vh" }: PageHeroProps) => {
  return (
    <>
      {/* Fixed hero that stays in place while content scrolls over it */}
      <section
        className="relative w-full overflow-hidden z-0 fixed inset-x-0 top-0 h-[var(--hero-height)] min-h-[380px] md:min-h-0 md:h-[380px]"
        style={{ "--hero-height": height } as React.CSSProperties}
      >
        <img
          src={image}
          alt={imageAlt}
          width={1920}
          height={1080}
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover object-[center_40%] md:object-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        />
        <div className="absolute inset-0 bg-secondary/50" />
        <div className="relative z-10 flex flex-col items-center justify-start md:justify-center h-full text-center px-6 pt-20 pb-8 md:pt-0 md:pb-0">
          {children}
        </div>
      </section>
      {/* Spacer to push content below the fixed hero */}
      <div
        className="block h-[var(--hero-height)] min-h-[380px] md:min-h-0 md:h-[380px]"
        style={{ "--hero-height": height } as React.CSSProperties}
      />
    </>
  );
};

export default PageHero;
