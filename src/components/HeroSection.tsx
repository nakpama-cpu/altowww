import heroImg from "@/assets/hero-mountain.jpg";

const HeroSection = () => {
  return (
    <section id="mountain" className="relative h-screen w-full overflow-hidden">
      <img
        src={heroImg}
        alt="Andes mountains at dawn with dramatic clouds over snow-capped peaks"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-secondary/40" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <p className="chapter-marker mb-6 text-secondary-foreground/70 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          Born at altitude
        </p>
        <h1 className="display-heading text-5xl md:text-7xl lg:text-8xl text-secondary-foreground animate-fade-in-up">
          Alto Whisky
        </h1>
        <p className="mt-6 font-body text-sm md:text-base text-secondary-foreground/80 max-w-md tracking-wide animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          A single malt forged in the heart of the Andes.
          <br />
          Where altitude meets craft.
        </p>
        <div className="absolute bottom-12 animate-fade-in" style={{ animationDelay: '1.2s' }}>
          <div className="w-px h-16 bg-secondary-foreground/30 mx-auto mb-2" />
          <p className="chapter-marker text-secondary-foreground/50">Scroll</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
