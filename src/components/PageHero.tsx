interface PageHeroProps {
  image: string;
  imageAlt: string;
  children: React.ReactNode;
  /** @deprecated Height is now standardized to match the homepage hero. */
  height?: string;
}

const PageHero = ({ image, imageAlt, children }: PageHeroProps) => {
  return (
    <>
      {/* Fixed on desktop; natural flow on mobile to match homepage hero */}
      <section className="relative w-full overflow-hidden z-0 h-auto md:fixed md:inset-x-0 md:top-0 md:h-[380px]">
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
      {/* Spacer to push content below the fixed hero (desktop only) */}
      <div className="hidden md:block h-[380px]" />
    </>
  );
};

export default PageHero;
