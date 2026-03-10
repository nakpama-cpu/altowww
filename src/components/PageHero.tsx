interface PageHeroProps {
  image: string;
  imageAlt: string;
  children: React.ReactNode;
  height?: string; // e.g. "70vh", "50vh"
}

const PageHero = ({ image, imageAlt, children, height = "70vh" }: PageHeroProps) => {
  return (
    <>
      {/* Fixed hero that stays in place while content scrolls over it */}
      <section
        className="fixed inset-0 w-full overflow-hidden z-0"
        style={{ height }}
      >
        <img
          src={image}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-secondary/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          {children}
        </div>
      </section>
      {/* Spacer to push content below the fixed hero */}
      <div style={{ height }} />
    </>
  );
};

export default PageHero;
