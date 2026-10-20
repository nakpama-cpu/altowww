import Seo from "@/components/Seo";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import PageHero from "@/components/PageHero";
import heroImg from "@/assets/hero-mountain.jpg";

const EMAIL = "admin@altowhisky.com";
const Mail = () => <a href={`mailto:${EMAIL}`} className="text-primary underline underline-offset-2">{EMAIL}</a>;

type Block = string | { label: string; text: string } | JSX.Element;
const sections: { title: string; body: Block[] }[] = [
  { title: "1. Who we are", body: [
    "Alto Whisky is a trading name of Alto Asset Management Ltd, registered in England and Wales under company number 14340237. We are the controller of the personal information described in this policy.",
    "Registered office: 71–75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom.",
    <>Privacy contact email: <Mail />.</>,
    "You can also write to our registered office, marked for the attention of the Privacy Contact.",
  ]},
  { title: "2. Information we collect", body: [
    { label: "Contact and enquiry details", text: "your name, email address, telephone number, correspondence and appointment information." },
    { label: "Investment interests", text: "the amount you are considering investing, your intended timing and information you choose to share about your plans." },
    { label: "Client information", text: "address, identity and verification documents, contracts, invoices, payment records, cask ownership, storage arrangements and account activity, where relevant to your purchase or our checks." },
    { label: "Communications", text: "emails, text messages, call records, notes and, where recorded, call audio. We tell you when a call is being recorded." },
    { label: "Technical and engagement information", text: "IP address, device and browser details, website activity, advert or form source and interactions with our emails or guide, subject to the permissions described below." },
    { label: "Preferences", text: "your consent records, marketing choices, objections and requests to stop contact." },
  ]},
  { title: "3. Where information comes from", body: [
    "We collect information directly from you through our websites, Facebook and Instagram lead forms, bookings, calls, messages and client services. Meta sends us the details and answers you submit through its lead forms, together with relevant form and advert information. We may also receive information from a referral or marketing partner, verification provider or public source. Where information comes from another source, we explain that source and our use of it when required.",
  ]},
  { title: "4. Why we use information and our lawful bases", body: [
    "We use personal information only where we have an applicable lawful basis under UK data protection law. The basis depends on the purpose:",
    { label: "Requested guides and enquiries", text: "to send the information you ask for, respond to questions and arrange requested appointments. We rely on our legitimate interests in handling enquiries and providing requested information, or on steps you ask us to take before entering into a contract where applicable." },
    { label: "Client services", text: "to arrange and administer purchases, ownership records, storage, insurance, payments and portal access. We rely on performance of our contract or requested steps before a contract." },
    { label: "Checks and record keeping", text: "to meet applicable legal, tax and accounting duties, relying on legal obligation where a specific duty applies. Proportionate fraud prevention and verification may also rely on our legitimate interests in protecting clients and our business." },
    { label: "Service improvement and security", text: "to manage access, investigate problems, maintain reliable systems and resolve complaints or legal claims. We rely on our legitimate interests in operating and protecting our business, subject to your rights." },
    { label: "Marketing", text: "to send relevant information about Alto Whisky where permitted. We rely on consent where required; otherwise, an applicable permission under marketing law and a valid data protection basis, usually legitimate interests." },
    { label: "Optional tracking and advertising", text: "to measure engagement and campaign performance or personalise advertising, relying on consent where required." },
    "Where we rely on legitimate interests, we consider whether our use is necessary and proportionate and balance it against your interests, rights and reasonable expectations.",
  ]},
  { title: "5. Guide requests and marketing choices", body: [
    "If you request our guide, we use your details to send it and respond to that request. Requesting a guide does not by itself subscribe you to every type of ongoing marketing.",
    "We send promotional emails and texts to individuals only with the necessary consent or where the existing-customer “soft opt-in” applies and all its conditions are met. Where we rely on consent, we explain the channels and purpose when asking for it. Marketing calls are subject to your preferences and applicable telephone marketing rules.",
    "You can object to direct marketing at any time. Use the unsubscribe option in an email, reply STOP to a marketing text where available, tell the team member contacting you, or email our Privacy Contact. We will stop the relevant marketing and keep only the information necessary to respect your choice. Essential communications about an existing purchase may still be needed.",
  ]},
  { title: "6. Who receives your information", body: [
    "We share information only as needed for the purposes in this policy. Authorised Alto Whisky team members have access according to their responsibilities. Our service providers include:",
    "Google services, including Sheets and email, for lead handling, communications and business administration.",
    "GoHighLevel and LeadConnector, together with Alto Connect, for contact management, lead routing, appointments and permitted follow-up.",
    "Aircall and associated communications providers for calls, messages and relevant records.",
    "Website, portal, hosting and database providers for operating and securing our online services.",
    "Verification providers, payment providers, accountants, legal advisers and, where relevant to your purchase, warehouses, insurers and cask transfer providers.",
    "Meta handles information under its own privacy policy when you use Facebook or Instagram. Where enabled and permitted by your choices, our websites also share website or conversion events with Meta for advertising measurement. Other providers may act as independent controllers for their own legally defined purposes.",
    "We may disclose information to regulators, authorities or advisers where required by law or necessary to establish, exercise or defend legal claims. If our business is transferred, relevant information may be shared with an acquiring party under appropriate protections. We do not sell your contact details to other businesses for their own marketing.",
  ]},
  { title: "7. International transfers", body: [
    "Some providers may process information outside the UK. For a restricted transfer, we use a permitted transfer mechanism, such as applicable UK adequacy regulations or approved contractual safeguards, supported by any required assessment and additional measures. You can ask our Privacy Contact for information about the safeguards relevant to your data and how to obtain a copy.",
  ]},
  { title: "8. Cookies and tracking", body: [
    "We use essential technologies to operate and secure our websites and portal. Our websites also use Meta Pixel and related advertising technologies, and GoHighLevel tools, to understand visits, guide engagement, bookings and campaign results. Emails may include engagement measurement, such as link tracking and opening pixels, where permitted.",
    "Rejecting optional tracking does not prevent you from requesting the guide.",
    <>If you have questions about the technologies we use, or wish to object to optional tracking, please contact our Privacy Contact at <Mail />.</>,
  ]},
  { title: "9. How long we keep information", body: [
    "We keep information only for as long as needed for the purpose for which it was collected. For enquiries, we consider whether your enquiry remains active, when we last had meaningful contact, your preferences and whether there is a reasonable need for further follow-up. Inactive enquiry records are reviewed and deleted or anonymised when no longer needed.",
    "For clients, we consider the length of the ownership and service relationship, transfer or sale arrangements, applicable tax and accounting requirements and the need to resolve disputes or legal claims. Call recordings and technical logs are retained only for the period justified by their purpose. Consent and suppression records may be kept for longer where necessary to demonstrate permission or prevent unwanted contact. A legal hold may require relevant records to be retained while a dispute is resolved.",
  ]},
  { title: "10. Security", body: [
    "We use appropriate technical and organisational measures to protect information, including access restrictions, account security and controls over service providers. We limit access to people who need it for their work. No online system is completely secure; please do not send unnecessary identity documents or sensitive information through ordinary enquiry forms.",
  ]},
  { title: "11. Automation and your choices", body: [
    "Our systems may automatically send requested information, route leads, schedule permitted follow-ups and use your answers or engagement to help our team prioritise enquiries. This does not mean that an automated system decides whether you can purchase a cask.",
    "You are not legally required to request a guide or provide marketing information. If you do not provide a working email address, we may be unable to send the requested guide. Some information is necessary to administer a purchase or complete applicable checks; we explain this when requesting it.",
  ]},
  { title: "12. Your rights and complaints", body: [
    "Depending on the circumstances, you can ask to access, correct or erase your information, restrict its use, receive or transfer certain information, or object to processing based on legitimate interests. You have an unconditional right to object to direct marketing. Where we rely on consent, you can withdraw it at any time without affecting the lawfulness of earlier processing.",
    "Contact our Privacy Contact to exercise a right or raise a concern. We may need to verify your identity. We normally respond to rights requests within one calendar month, subject to any lawful extension or adjustment. If a right does not apply, we explain why.",
    <>You can also raise a concern with the Information Commissioner’s Office at{" "}
      <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">ico.org.uk/make-a-complaint</a>{" "}
      or on <a href="tel:03031231113" className="text-primary underline underline-offset-2">0303 123 1113</a>. We welcome the opportunity to resolve your concern; the ICO explains its complaint process on its website.</>,
  ]},
  { title: "13. Changes to this policy", body: [
    "We review this policy when our services or use of information changes. We publish the updated version here and explain significant changes where required.",
  ]},
];

const PrivacyPolicy = () => (
  <div className="relative">
    <Seo
      title="Privacy Policy | Alto Whisky"
      description="How Alto Whisky collects, uses, shares and protects personal information across our websites, client portal, guide requests and client services."
      path="/privacy-policy"
    />
    <Header />
    <PageHero image={heroImg} imageAlt="Scottish mountain landscape">
      <h1 className="display-heading text-4xl md:text-6xl text-secondary-foreground animate-fade-in-up">Privacy Policy</h1>
      <p className="font-body text-xs uppercase tracking-[0.25em] text-secondary-foreground mt-4">Last updated: 20 October 2026</p>
    </PageHero>
    <div className="relative z-10">
      <section className="section-light py-16 md:py-24">
        <article className="max-w-3xl mx-auto px-6 md:px-12 font-body text-sm md:text-base text-muted-foreground leading-relaxed">
          <p className="mb-10">
            This policy explains how we collect, use, share and protect personal information when you visit our websites or client portal, request our investment guide, respond to our adverts, contact us or become a client.
          </p>
          {sections.map((s) => (
            <section key={s.title} className="mb-10">
              <h2 className="display-heading text-2xl md:text-3xl text-foreground mb-4">{s.title}</h2>
              <div className="space-y-4">
                {s.body.map((b, i) =>
                  typeof b === "string" ? <p key={i}>{b}</p>
                  : "label" in (b as object) && !("type" in (b as object))
                    ? <p key={i}><strong className="text-foreground font-medium">{(b as { label: string }).label}:</strong> {(b as { text: string }).text}</p>
                    : <p key={i}>{b as JSX.Element}</p>
                )}
              </div>
            </section>
          ))}
        </article>
      </section>
      <FooterSection hideCta />
    </div>
  </div>
);

export default PrivacyPolicy;
