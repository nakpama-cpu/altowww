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
      {/* Fixed hero that stays in place while content scrolls over it — matches homepage sizing */}
      <section className="fixed inset-x-0 top-0 w-full overflow-hidden z-0 h-screen md:h-[380px]">
        <img
          src={image}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-fill"
          style={{
            transform: 'scale(1.25) translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        />
        <div className="absolute inset-0 bg-secondary/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          {children}
        </div>
      </section>
      {/* Spacer to push content below the fixed hero */}
      <div className="h-screen md:h-[380px]" />
    </>
  );
};

export default PageHero;
