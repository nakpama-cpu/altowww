import whiskyTastingImg from "@/assets/whisky-tasting.jpg";
import distilleryStillsImg from "@/assets/distillery-stills.jpg";
import whiskyInvestmentImg from "@/assets/whisky-investment-news.jpg";
import taxBenefitsImg from "@/assets/tax-benefits.jpg";
import bondedWarehouseImg from "@/assets/bonded-warehouse.jpg";
import whiskyRegionsImg from "@/assets/whisky-regions.jpg";
import chinaTradeImg from "@/assets/china-trade.jpg";

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
    slug: "china-slashes-whisky-import-duty-2026",
    image: chinaTradeImg,
    category: "Industry News",
    date: "March 2026",
    title: "China Slashes Whisky Import Duty — What It Means for Cask Investors",
    excerpt:
      "China's decision to reduce import tariffs on Scotch whisky is set to unlock the world's largest untapped spirits market, with major implications for cask values.",
    content: [
      "In a landmark move for the global spirits industry, China has announced a significant reduction in import duties on Scotch whisky, dropping tariffs from 25% to just 5% as part of a broader UK-China trade agreement signed in early 2026.",
      "The announcement sent ripples through the whisky investment community. China represents the world's largest untapped market for premium Scotch whisky, with a rapidly growing middle class increasingly drawn to luxury Western spirits. Industry analysts estimate the tariff reduction could boost Scotch exports to China by 300-400% over the next five years.",
      "For cask investors, the implications are profound. Increased demand from the Chinese market will put upward pressure on whisky prices across the board, but particularly for the prestige single malts that Chinese consumers favour — brands like The Macallan, The Dalmore, and Glenfiddich.",
      "The Scotch Whisky Association (SWA) has welcomed the move, describing it as 'a generational opportunity for the industry.' Chief executive Mark Kent noted that Scotland's distilleries were already operating at near-full capacity, suggesting that increased Chinese demand would accelerate the appreciation of existing stock and maturing casks.",
      "This isn't the first time tariff changes have impacted the whisky market. When the US imposed 25% tariffs on single malt Scotch in 2019, exports dropped by 35%. The subsequent removal of those tariffs in 2021 triggered a sharp recovery, with cask values appreciating by an average of 18% in the following twelve months.",
      "India is also moving in a similar direction, with ongoing negotiations to reduce its current 150% import duty on Scotch whisky. If successful, the combined effect of Chinese and Indian market liberalisation could be transformative for the industry — and for those holding whisky casks as investment assets.",
      "At Alto Whisky, we're already seeing increased interest from investors looking to position themselves ahead of this demand surge. Our Portfolio Advisors can help you identify the distilleries and cask types most likely to benefit from the opening of the Chinese market. Contact us today to discuss your options.",
    ],
  },
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
    slug: "tax-free-investment-whisky-cask-wasting-asset",
    image: taxBenefitsImg,
    category: "Tax & Finance",
    date: "January 2026",
    title: "Why Whisky Casks Are One of the Last Truly Tax-Free Investments in the UK",
    excerpt:
      "Understanding the 'wasting asset' classification and how whisky cask investors can enjoy returns completely free from Capital Gains Tax.",
    content: [
      "In an era of increasing taxation on investment returns, whisky casks occupy a uniquely privileged position in the UK tax landscape. Classified by HMRC as 'wasting assets,' whisky casks are completely exempt from Capital Gains Tax — making them one of the last genuinely tax-free investment opportunities available.",
      "A 'wasting asset' is defined as an asset with a predictable useful life of 50 years or less. Since whisky casks are made of oak and will eventually deteriorate, they qualify for this classification regardless of the value of the whisky inside. This means that whether you make £5,000 or £500,000 in profit, you won't owe a penny in Capital Gains Tax.",
      "To put this in perspective, consider a typical stock market investment. If you made a £100,000 profit on shares, you'd currently pay Capital Gains Tax at 20% (or 24% for higher rate taxpayers following the 2024 Autumn Budget changes), leaving you with £76,000–£80,000. With a whisky cask, that entire £100,000 profit is yours to keep.",
      "The tax advantages don't stop there. Whisky stored in HMRC-bonded warehouses is also exempt from VAT and excise duty for the duration of its storage. These costs only become payable if the whisky is removed from bond — which typically only happens if you choose to bottle and sell the whisky directly to consumers.",
      "For inheritance tax planning, whisky casks can also play a role. While they form part of your estate for IHT purposes, the combination of strong appreciation and tax-free gains means they can be an effective vehicle for building wealth that can be passed to the next generation.",
      "It's worth noting that HMRC has confirmed this classification multiple times, and it applies to all types of whisky casks — from entry-level bourbon barrels to premium sherry butts. The key requirement is that you must be the legal owner of the cask, with proper documentation including a Certificate of Title.",
      "As the government continues to tighten the tax net around other investment vehicles, the wasting asset exemption enjoyed by whisky casks becomes increasingly valuable. At Alto Whisky, we ensure every client receives comprehensive ownership documentation and guidance on the tax treatment of their investment.",
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
    slug: "how-whisky-casks-are-stored-bonded-warehouses",
    image: bondedWarehouseImg,
    category: "Cask Storage",
    date: "December 2025",
    title: "How Your Whisky Cask Is Stored: A Guide to Bonded Warehouses",
    excerpt:
      "Everything you need to know about HMRC-bonded warehouses, from optimal storage conditions to insurance and documentation.",
    content: [
      "When you invest in a whisky cask, one of the most common questions is: 'Where will my cask be stored?' The answer is in an HMRC-bonded warehouse — a highly regulated, secure facility that plays a crucial role in protecting your investment.",
      "HMRC-bonded warehouses, also known as 'excise warehouses,' are government-approved facilities where goods subject to excise duty (such as spirits) can be stored without the owner having to pay duty or VAT. For whisky cask investors, this means your whisky can mature for as long as you like without incurring any tax until it's removed from bond.",
      "These warehouses are subject to strict government oversight. Regular inspections ensure compliance with storage regulations, and detailed records are maintained for every cask — including its origin, contents, date of filling, and ownership. This documentation provides an unbroken chain of provenance that's essential for maintaining the value of your investment.",
      "The physical conditions inside a bonded warehouse are carefully controlled. Temperature fluctuations are kept to a minimum, and humidity levels are maintained to ensure optimal maturation conditions. Traditional 'dunnage' warehouses — stone-built with earthen floors — are considered the gold standard, as they provide the stable, cool, and slightly humid environment that produces the best whisky.",
      "Modern 'racked' warehouses offer a more space-efficient alternative, with casks stored on metal racks several tiers high. While purists debate the relative merits of each approach, both types of warehouse produce excellent whisky and are fully approved by HMRC.",
      "Insurance is another important consideration. Reputable cask brokers ensure that all casks are fully insured against loss, damage, or theft. At Alto Whisky, insurance is included as standard in our storage packages, giving you complete peace of mind.",
      "Storage costs are typically very modest — around £15–£30 per cask per year depending on the warehouse and cask type. Given the potential returns on your investment, these costs represent excellent value and are often included in the initial purchase price for the first few years.",
      "At Alto Whisky, we work exclusively with established, HMRC-bonded warehouses across Scotland. Every client receives full documentation including warehouse details, cask identification numbers, and storage agreements. Your Portfolio Advisor can arrange warehouse visits by appointment if you'd like to see your cask in person.",
    ],
  },
  {
    slug: "five-whisky-regions-scotland-investor-guide",
    image: whiskyRegionsImg,
    category: "Whisky Regions",
    date: "November 2025",
    title: "The Five Whisky Regions of Scotland: An Investor's Guide",
    excerpt:
      "From the peaty shores of Islay to the elegant malts of Speyside — understanding how Scotland's regions shape cask investment value.",
    content: [
      "Scotland's whisky industry is divided into five officially recognised regions, each producing spirits with distinctive characteristics that influence both flavour and investment potential. Understanding these regions is essential for building a well-diversified cask portfolio.",
      "Speyside is the undisputed heavyweight of Scotch whisky production, home to over half of Scotland's distilleries. The region's gentle climate and access to pristine water sources produce whiskies known for their elegance, sweetness, and complexity. For investors, Speyside offers the widest range of options, from accessible entry-level casks to ultra-premium offerings from The Macallan and Glenfiddich.",
      "The Highlands encompass the largest geographical area and produce the most diverse range of styles. Coastal Highland whiskies like Oban offer maritime characteristics, while inland distilleries like Dalmore produce richer, sherried styles. This diversity makes Highland casks excellent for portfolio diversification.",
      "Islay, though small in size, produces some of the most distinctive and collectible whiskies in the world. The island's eight distilleries — including Lagavulin, Ardbeg, and Laphroaig — are renowned for their intensely peated, maritime-influenced spirits. Islay casks typically command premium prices and have shown some of the strongest appreciation rates in the market.",
      "The Lowlands, traditionally associated with lighter, more delicate whiskies, has experienced a renaissance in recent years. New distilleries are breathing fresh life into the region, while established names continue to produce excellent spirits. Lowland casks can offer good value for investors willing to look beyond the more fashionable regions.",
      "Campbeltown, once the whisky capital of Scotland with over 30 distilleries, is now home to just three — Springbank, Glen Scotia, and Glengyle. This scarcity, combined with Campbeltown's legendary reputation, makes casks from this region highly sought after. Springbank in particular is considered one of the most collectible brands in the entire industry.",
      "When building a cask portfolio, many investors choose to diversify across regions to balance risk and capture different market dynamics. A portfolio might include a premium Speyside cask for steady appreciation, an Islay cask for its cult following and strong demand, and a Campbeltown cask for its rarity value.",
      "At Alto Whisky, our Portfolio Advisors have deep knowledge of every whisky region and can help you select casks that align with your investment goals and risk appetite. Whether you're drawn to the smoky shores of Islay or the elegant valleys of Speyside, we can find the right cask for you.",
    ],
  },
  {
    slug: "beginners-guide-whisky-cask-investment-2026",
    image: whiskyTastingImg,
    category: "Investment Guide",
    date: "November 2025",
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
