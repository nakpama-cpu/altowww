import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import BrochureButton, { ContactButton } from "@/components/BrochureButton";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import scotlandImg from "@/assets/scotland-landscape.jpg";

const regions = [
  {
    name: "Highland",
    description:
      "The largest producing region in Scotland, Highland whisky offers a vast array of flavour and characteristics, owing to the expansive, world-famous territory of the Scottish Highlands. With a diverse landscape such as this to call home, Highland whisky can come in many forms, from sweet serves in the north to smoky, spicy counterparts in the south.",
  },
  {
    name: "Lowland",
    description:
      "Lowland whiskies are often the drink of choice for social gatherings and pre-dinner tipples, owing to their soft, smooth profile. So smooth in fact, the Lowland distilleries have earned the title of 'The Lowland Ladies'. As the southernmost whisky region in Scotland, the Lowlands offer a unique experience for those who enjoy floral notes and a flavoursome palate of honeysuckle, ginger, and cinnamon.",
  },
  {
    name: "Speyside",
    description:
      "Speyside is the world's most densely populated whisky region. With lush glens, fertile lands, and the iconic River Spey, it's easy to see why. The whiskies produced in Speyside are rich with peat and fruity flavours, with common palates featuring vanilla, pear, and apple. Speyside also utilises a unique twist on the maturation process, using Sherry casks to build an even deeper body of flavour.",
  },
  {
    name: "Campbeltown",
    description:
      "A much smaller producer in current day, Campbeltown was once a region filled with more than 30 expert distilleries. Today, just three remain. However, when you taste a Campbeltown whisky, you taste a flavour so rich you would assume the region is stacked with producers. You can expect full-bodied whiskies boasting notes of salt, smoke, fruit, and toffee.",
  },
  {
    name: "Islay",
    description:
      "One of Scotland's most easily identifiable whisky regions when it comes to flavour profile, Islay is a small Hebridean island almost solely dedicated to whisky production. The passion and care put into the whisky by the people of this region produces a fiery, heavily peated drink, not for the faint of heart.",
  },
];

const AboutWhisky = () => {
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
          src={scotlandImg}
          alt="Scottish Highland landscape with rolling green hills"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-secondary/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <p className="chapter-marker mb-6 text-secondary-foreground/70 animate-fade-in">
            About Whisky
          </p>
          <h1 className="display-heading text-4xl md:text-6xl lg:text-7xl text-secondary-foreground animate-fade-in-up">
            Whisky Regions & Distilleries
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="section-light py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <h2 className="display-heading text-3xl md:text-4xl mb-8">
            When you step into the world of whisky, you're opening the door to
            much more than just a drink.
          </h2>
          <p className="font-body text-base leading-relaxed text-muted-foreground max-w-xl mb-6">
            With hundreds of years spent distilling and producing this
            much-loved spirit, there are nuances to the art of whisky.
          </p>
          <p className="font-body text-base leading-relaxed text-muted-foreground max-w-xl mb-6">
            Spelled without an 'e', the name 'whisky' refers to scotch distilled
            in Scotland and Ireland, whilst American producers prefer the
            spelling 'whiskey'. Taken literally, the term 'whisky' is derived
            from Gaelic to mean 'water of life', depicting the high esteem this
            product has been held in, and for just how long.
          </p>
          <p className="font-body text-base leading-relaxed text-muted-foreground max-w-xl">
            Official records show whisky production dating back to the late
            1400s in the Scottish Exchequer Rolls. However, many believe whisky
            has an even deeper heritage, dating back as far as the 8th century.
            It is believed that Christian missionary monks brought the knowledge
            of distillery back to Celtic lands from their pilgrimages to
            Mediterranean and Middle Eastern regions.
          </p>
        </div>
      </section>

      {/* Regions */}
      <section className="section-dark py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 md:px-12 mb-16">
          <p className="chapter-marker mb-8 text-secondary-foreground/50">
            The Five Regions
          </p>
          <h2 className="display-heading text-3xl md:text-5xl text-secondary-foreground">
            There are five key Scottish whisky regions, each of which provides a
            unique flavour, heritage, and experience.
          </h2>
        </div>
        <div ref={ref} className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="space-y-20">
            {regions.map((region, i) => (
              <div
                key={region.name}
                className={`transition-all duration-1000 ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${200 + i * 150}ms` }}
              >
                <div className="w-12 h-px bg-primary mb-6" />
                <h3 className="font-display text-2xl md:text-3xl text-secondary-foreground font-light italic mb-4">
                  {region.name}
                </h3>
                <p className="font-body text-sm text-secondary-foreground/60 leading-relaxed max-w-2xl">
                  {region.description}
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
            Ready to explore?
          </h2>
          <p className="font-body text-sm text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
            Download our free brochure to discover which distilleries and
            regions could form part of your whisky cask portfolio.
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

export default AboutWhisky;
