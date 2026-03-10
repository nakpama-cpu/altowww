import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import BrochureButton, { ContactButton } from "@/components/BrochureButton";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import warehouseImg from "@/assets/warehouse-casks.jpg";

const steps = [
  {
    number: "01",
    title: "Malting",
    description:
      "Whisky is only as good as the barley chosen at the very beginning of the process. This barley is harvested, watered, and then spread across malting floors to allow it to germinate. Care must be taken here to reduce the build-up of heat, ensuring that the barley is regularly turned and aerated. Here, precious enzymes are activated for use later in the process. At the 6- or 7-day mark, the barley will then be dried in a kiln to stop the germination process and add peat, if desired.",
  },
  {
    number: "02",
    title: "Mashing",
    description:
      "Once dry, the malt is ground into a rough flour. This flour is then placed into a mash tun, with pure Scottish water added at three stages – gradually increasing in temperature from 67°C to around 100°C. After mashing and stirring, a sugary liquid is created, known as wort.",
  },
  {
    number: "03",
    title: "Fermentation",
    description:
      "The wort is then cooled, pumped into washbacks and added to yeast, allowing the fermentation process to begin. The yeast and sugars combine to produce alcohol and other compounds which give the whisky its distinctive flavour. This is a volatile process, as the products of this chemical reaction produce a great deal of froth, requiring revolving switchers to regularly remove the head as it bubbles over. Two days later, the reaction begins to slow and we are left with a wash containing between 6-8% alcohol by volume.",
  },
  {
    number: "04",
    title: "Distillation",
    description:
      "This is a traditional separation method, which many producers in Scotland still utilise to separate the alcohol and flavouring compounds from the rest of the liquid in the mix. Heating the still to just below 100°C, the alcohol and other compounds evaporate through the neck of the still and condense on the other end, leaving us with the good stuff. Distillation is a two-stage process designed to harvest the alcoholic solution. The first distillation results in a solution of around 20% ABV, with the second increasing this to around 68% ABV.",
  },
  {
    number: "05",
    title: "Spirit Safe & Casking",
    description:
      "Upon passing through the spirit safe, the Stillman will inspect the spirit without coming into contact with it. This is a challenging task, and one only a master Stillman could complete. If all is in order, the freshly distilled spirit will be reduced to maturing strength (around 63%) and placed into wooden casks to mature and build flavour. These casks will have previously been used to store other whiskies, bourbons, or sherries, helping the new spirit to develop a deep, rich flavour. The new make spirit needs to mature in the cask for a minimum of 3 years and 1 day before it's legally classed as whisky.",
  },
  {
    number: "06",
    title: "Bottling",
    description:
      "Before bottling, whiskies undergo sensory analysis in the on-site lab, checking characteristics against a standard range of aromas and flavours provided by the master distiller. The liquid also goes through tests to check its chemical components, density, turbidity, pH, and other characteristics. Bottling is predictably automated, from rinsing and filling to labelling and capping, though workers are often needed to handle parts of the process for specialized bottles, such as wax dipping.",
  },
];

const HowWhiskyIsMade = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative">
      <Header />
      {/* Hero */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <img
          src={warehouseImg}
          alt="Scottish whisky warehouse with oak casks"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-secondary/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <p className="chapter-marker mb-6 text-secondary-foreground/70 animate-fade-in">
            The Craft
          </p>
          <h1 className="display-heading text-4xl md:text-6xl lg:text-7xl text-secondary-foreground animate-fade-in-up">
            How Whisky is Made
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="section-light py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <h2 className="display-heading text-3xl md:text-4xl mb-8">
            Scotch whisky is as much about the process as it is about the
            product.
          </h2>
          <p className="font-body text-base leading-relaxed text-muted-foreground max-w-xl mb-6">
            The drink is a source of great national pride for the Scottish
            people, and so it must meet a set of strict criteria to earn the
            prestigious title of 'Scotch Whisky'.
          </p>
          <p className="font-body text-base leading-relaxed text-muted-foreground max-w-xl">
            Whilst each distillery may have slight differences in their process,
            the making of malt whisky goes a little like this.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="section-dark py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 md:px-12 mb-16">
          <p className="chapter-marker mb-8 text-secondary-foreground/50">
            The Process
          </p>
          <h2 className="display-heading text-3xl md:text-5xl text-secondary-foreground">
            From barley to barrel — six steps to creating Scotland's liquid
            gold.
          </h2>
        </div>
        <div ref={ref} className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="space-y-20">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className={`transition-all duration-1000 ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${200 + i * 150}ms` }}
              >
                <p className="font-display text-6xl text-primary/20 font-light mb-4">
                  {step.number}
                </p>
                <h3 className="font-display text-xl md:text-2xl text-secondary-foreground font-light mb-4">
                  {step.title}
                </h3>
                <p className="font-body text-sm text-secondary-foreground/60 leading-relaxed max-w-2xl">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-light py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
          <h2 className="display-heading text-3xl md:text-5xl mb-8">
            Ready to own a cask?
          </h2>
          <p className="font-body text-sm text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
            Now you know the craft behind the spirit, discover how you can invest
            in your own whisky cask.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <BrochureButton className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-8 py-3.5 hover:opacity-90 transition-opacity" />
            <ContactButton className="font-body text-xs uppercase tracking-[0.25em] text-foreground border border-border px-8 py-3.5 hover:bg-muted transition-all duration-500">
              Speak to an Advisor
            </ContactButton>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default HowWhiskyIsMade;
