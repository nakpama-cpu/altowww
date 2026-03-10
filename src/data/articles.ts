import whiskyTastingImg from "@/assets/whisky-tasting.jpg";
import distilleryStillsImg from "@/assets/distillery-stills.jpg";
import whiskyInvestmentImg from "@/assets/whisky-investment-news.jpg";

export interface Article {
  slug: string;
  image: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  content: string[];
}

export const articles: Article[] = [
  {
    slug: "whisky-casks-outperform-traditional-assets",
    image: whiskyInvestmentImg,
    category: "Market Insight",
    date: "February 2026",
    title: "Whisky Casks Outperform Traditional Assets for Tenth Consecutive Year",
    excerpt:
      "The Knight Frank Luxury Investment Index reveals whisky casks have delivered 582% returns over the past decade, outpacing wine, art, and classic cars.",
    content: [
      "The latest Knight Frank Luxury Investment Index has confirmed what many savvy investors already suspected: whisky casks have once again topped the charts as the best-performing collectible asset class, marking a remarkable tenth consecutive year of dominance.",
      "According to the report, rare whisky has appreciated by an extraordinary 582% over the past decade, significantly outpacing traditional luxury investments such as fine wine (192%), classic cars (160%), and fine art (88%). This sustained performance has drawn increasing attention from both institutional and private investors seeking alternative asset classes.",
      "Several factors continue to drive this exceptional performance. The finite nature of whisky — it can only be produced in specific regions under strict regulations — creates natural scarcity. As casks mature, the liquid inside improves in quality while simultaneously decreasing in volume through the 'angel's share,' the natural evaporation that occurs during ageing.",
      "The tax advantages of whisky cask investment also play a significant role. In the UK, whisky casks are classified as 'wasting assets' by HMRC, meaning they are exempt from Capital Gains Tax. This tax-free status makes cask investment particularly attractive compared to traditional financial instruments.",
      "Industry experts suggest the trend is set to continue. Global demand for premium single malt Scotch whisky is growing at approximately 8% per year, driven largely by emerging markets in Asia and the increasing appreciation for luxury spirits among younger demographics.",
      "For investors considering entering the market, the current climate presents a compelling opportunity. With interest rates remaining uncertain and traditional markets showing volatility, tangible assets like whisky casks offer both stability and growth potential.",
      "Alto Whisky's team of Portfolio Advisors can guide you through every step of the process, from selecting the right distillery and cask type to managing storage and planning your exit strategy. Whether you're looking for a short-term flip or a long-term hold, there's a whisky cask investment strategy to suit your goals.",
    ],
  },
  {
    slug: "scotlands-most-sought-after-distilleries",
    image: distilleryStillsImg,
    category: "Distillery News",
    date: "January 2026",
    title: "Inside Scotland's Most Sought-After Single Malt Distilleries",
    excerpt:
      "We explore the Highland and Speyside distilleries producing some of the most collectible casks available to private investors today.",
    content: [
      "Scotland is home to over 130 active distilleries, each producing whisky with its own distinct character shaped by local water sources, climate, and centuries of tradition. But when it comes to cask investment, not all distilleries are created equal.",
      "The Highland region, Scotland's largest whisky-producing area, is home to some of the most prestigious names in the industry. Distilleries like The Dalmore, known for its rich, sherried style, and Highland Park, which combines heather honey sweetness with gentle peat smoke, consistently command premium prices on the secondary market.",
      "Speyside, nestled in the northeast of Scotland, is often considered the heartland of single malt production. Home to more distilleries than any other region, Speyside produces whiskies characterised by their elegance, complexity, and fruit-forward profiles. The Macallan, Glenfiddich, and The Glenlivet are among the most recognisable names, with their casks regularly achieving exceptional returns for investors.",
      "Islay, the small island off Scotland's west coast, punches well above its weight in the investment world. Distilleries like Lagavulin, Ardbeg, and Laphroaig produce intensely peated whiskies that have developed cult followings worldwide. Limited production volumes and dedicated fan bases mean Islay casks often appreciate significantly faster than their mainland counterparts.",
      "The Campbeltown region, once home to over 30 distilleries but now reduced to just three, offers unique investment opportunities. Springbank, in particular, is considered one of the most collectible distilleries in Scotland, with their limited releases regularly selling out within minutes.",
      "When selecting a distillery for investment, several factors come into play: brand reputation, production volume, age of the distillery, and the specific type of cask used for maturation. First-fill sherry casks from prestigious distilleries tend to command the highest premiums, while ex-bourbon barrels offer a more accessible entry point.",
      "At Alto Whisky, we maintain relationships with distilleries across all of Scotland's whisky regions, giving our clients access to a diverse range of cask investment opportunities. Our Portfolio Advisors can help you build a balanced collection that maximises both diversification and return potential.",
    ],
  },
  {
    slug: "beginners-guide-whisky-cask-investment-2026",
    image: whiskyTastingImg,
    category: "Investment Guide",
    date: "December 2025",
    title: "A Beginner's Guide to Whisky Cask Investment in 2026",
    excerpt:
      "Everything you need to know about purchasing, storing, and selling whisky casks — from tax benefits to exit strategies.",
    content: [
      "Whisky cask investment has emerged as one of the most exciting alternative asset classes of the past decade. If you're new to the world of cask ownership, this comprehensive guide will walk you through everything you need to know to get started.",
      "At its core, whisky cask investment involves purchasing a barrel of maturing whisky directly from a distillery or through a specialist broker. As the whisky ages, it typically increases in value — both because older whisky commands higher prices and because the volume decreases naturally over time, creating scarcity.",
      "One of the most compelling advantages of whisky cask investment is the tax treatment. In the UK, HMRC classifies whisky casks as 'wasting assets' — items with a predictable lifespan of less than 50 years. This classification means that any profit you make when selling your cask is completely exempt from Capital Gains Tax, regardless of the amount.",
      "When you purchase a cask, it's stored in an HMRC-bonded warehouse in Scotland. These government-regulated facilities ensure your whisky is stored under optimal conditions and properly documented. You'll receive official ownership documentation including a Certificate of Title and a storage agreement.",
      "The cost of a whisky cask varies significantly depending on the distillery, the type of cask, and the age of the spirit. Entry-level casks from well-regarded distilleries can start from around £3,000–£5,000, while casks from premium or closed distilleries can command prices well into six figures.",
      "Exit strategies are an important consideration. You have several options when the time comes to realise your investment: sell the cask privately or at auction, sell the whisky to an independent bottler, or even bottle it yourself under a private label. Each option has its own advantages depending on your investment timeline and goals.",
      "Insurance and storage costs are relatively modest — typically around £15–£30 per year per cask — and are usually included in the purchase package offered by reputable brokers. It's essential to work with a trusted partner who can provide transparent pricing, proper documentation, and ongoing portfolio management.",
      "At Alto Whisky, we believe everyone should have access to this extraordinary investment opportunity. Our team of expert Portfolio Advisors will guide you through the entire process, from selecting your first cask to planning your exit strategy. Request our free brochure to learn more about how whisky cask investment could work for you.",
    ],
  },
];

export const getArticleBySlug = (slug: string): Article | undefined =>
  articles.find((a) => a.slug === slug);
