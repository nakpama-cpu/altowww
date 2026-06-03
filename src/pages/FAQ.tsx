import Seo from "@/components/Seo";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import BrochureButton, { ContactButton } from "@/components/BrochureButton";
import PageHero from "@/components/PageHero";
import { useEffect } from "react";
import heroImg from "@/assets/hero-mountain.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is whisky cask investment?",
    answer:
      "Whisky cask investment is the process of purchasing whisky in cask form to provide a long-term return on investment through maturation.",
  },
  {
    question: "Why whisky?",
    answer:
      "Purchasing a tangible, physical asset will always be the most secure option for investors – just look at gold's ever-stable value. Your cask will be held in government-bonded property, insured, and free from tax – what's not to like?",
  },
  {
    question: "How is Scotch whisky made?",
    answer:
      "The production of Scotch whisky is a protected process, one which must be adhered to by producers across Scotland. You can read about the full process on our 'How Whisky is Made' page.",
  },
  {
    question: "What is a cask?",
    answer:
      "A cask is a wooden barrel designed to store alcohol as it matures. Different forms of whisky will use different woods or sizes, but many will utilise previously used barrels, helping the new spirit to develop a deep, rich flavour profile.",
  },
  {
    question: "Why casks and not bottles?",
    answer:
      "Not only is a cask safer to house than a bottle due to the reduced risk of breakages, but all the while the whisky remains in the cask it will continue to mature. The moment the whisky is removed from the cask, it ceases to mature. This means by keeping it in a cask, your investment increases in value and quality with each passing year. Furthermore, whisky in bottles can be taxed at a much higher rate than whisky in casks – so it's a no brainer!",
  },
  {
    question: "How do I buy a cask?",
    answer:
      "Speak with one of our expert Portfolio Advisors, who will be more than happy to guide you through the process. You can get in touch via our Contact page.",
  },
  {
    question: "Is my cask insured?",
    answer:
      "Yes, your cask is fully insured from the moment you complete your purchase. This covers damage, loss, and theft, and will be adjusted each year to match the updated value of your cask.",
  },
  {
    question: "How can I be sure my cask really exists?",
    answer:
      "We want to ensure you feel confident in your investment. As such, you will be provided with a certificate of ownership upon purchasing your cask, and you are able to arrange visits to the warehouse to view your cask if you wish. However, these warehouses are government facilities and therefore will require you to pre-book your appointment. But don't worry, we'll help you with that.",
  },
];

const FAQ = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative">
      <Seo
        title="FAQs | Whisky Cask Investment Questions Answered"
        description="Common questions about whisky cask investment — costs, returns, storage, insurance, tax, and how Alto Whisky supports investors at every stage."
        path="/faqs"
      />
      <Header />
      <PageHero image={heroImg} imageAlt="Mountain landscape" height="50vh">
        <h1 className="display-heading text-4xl md:text-6xl lg:text-7xl text-secondary-foreground animate-fade-in-up">
          Frequently Asked Questions
        </h1>
      </PageHero>

      <div className="relative z-10">
        {/* FAQ */}
        <section className="section-light py-24 md:py-32">
          <div className="max-w-3xl mx-auto px-6 md:px-12">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border-b border-border"
                >
                  <AccordionTrigger className="font-display text-lg md:text-xl font-light text-left py-6 hover:no-underline hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-sm text-muted-foreground leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="section-dark py-24 md:py-32">
          <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
            <h2 className="display-heading text-3xl md:text-5xl text-secondary-foreground mb-8">
              Still have questions?
            </h2>
            <p className="font-body text-sm text-secondary-foreground/60 mb-10 max-w-md mx-auto leading-relaxed">
              Our expert Portfolio Advisors are here to help. Get in touch and
              we'll be happy to answer any questions you have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <BrochureButton className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-8 py-3.5 hover:opacity-90 transition-opacity" />
              <ContactButton className="font-body text-xs uppercase tracking-[0.25em] text-secondary-foreground border border-secondary-foreground/30 px-8 py-3.5 hover:bg-secondary-foreground/10 transition-all duration-500">
                Speak to an Advisor
              </ContactButton>
            </div>
          </div>
        </section>

        <FooterSection hideCta />
      </div>
    </div>
  );
};

export default FAQ;
