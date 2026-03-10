import heroImg from "@/assets/hero-mountain.jpg";
import BrochureButton, { ContactButton } from "@/components/BrochureButton";

const HeroSection = () => {
  return (
    <>
      {/* Fixed hero that stays in place while content scrolls over it */}
      <section
        id="heritage"
        className="fixed inset-0 h-screen w-full overflow-hidden z-0"
      >
        <img
          src={heroImg}
          alt="Dramatic mountain landscape at dawn with misty peaks"
          className="absolute inset-0 w-full h-full object-cover scale-[1.15] animate-cloud-drift will-change-transform"
        />
        <div className="absolute inset-0 bg-secondary/50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <p
            className="chapter-marker mb-6 text-secondary-foreground/70 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            Whisky Cask Investment
          </p>
          <h1 className="display-heading text-5xl md:text-7xl lg:text-8xl text-secondary-foreground animate-fade-in-up">
            Alto Whisky
          </h1>
          <p
            className="mt-6 font-body text-sm md:text-base text-secondary-foreground/80 max-w-lg tracking-wide leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            Secure your future with the best performing
            <br />
            collectible of the decade.
          </p>
          <div
            className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in"
            style={{ animationDelay: "0.8s" }}
          >
            <BrochureButton className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-8 py-3.5 hover:opacity-90 transition-opacity" />
            <ContactButton className="font-body text-xs uppercase tracking-[0.25em] text-secondary-foreground border border-secondary-foreground/30 px-8 py-3.5 hover:bg-secondary-foreground/10 transition-all duration-500">
              Speak to an Advisor
            </ContactButton>
          </div>
          <div
            className="absolute bottom-12 animate-fade-in"
            style={{ animationDelay: "1.2s" }}
          >
            <div className="w-px h-16 bg-secondary-foreground/30 mx-auto mb-2" />
            <p className="chapter-marker text-secondary-foreground/50">Scroll</p>
          </div>
        </div>
      </section>
      {/* Spacer to push content below the fixed hero */}
      <div className="h-screen" />
    </>
  );
};

export default HeroSection;
