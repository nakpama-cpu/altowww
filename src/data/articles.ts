import whiskyTastingImg from "@/assets/whisky-tasting.jpg";
import distilleryStillsImg from "@/assets/distillery-stills.jpg";
import whiskyInvestmentImg from "@/assets/whisky-investment-news.jpg";
import taxBenefitsImg from "@/assets/tax-benefits.jpg";
import bondedWarehouseImg from "@/assets/bonded-warehouse.jpg";
import whiskyRegionsImg from "@/assets/whisky-regions.jpg";
import chinaTradeImg from "@/assets/china-trade.jpg";
import auctionCaskImg from "@/assets/auction-cask.jpg";
import whiskyTourismImg from "@/assets/whisky-tourism.jpg";
import sustainableWhiskyImg from "@/assets/sustainable-whisky.jpg";
import heroDistilleryImg from "@/assets/hero-distillery.jpg";

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
    slug: "rare-macallan-cask-record-auction-2026",
    image: auctionCaskImg,
    category: "Market Insight",
    date: "June 2026",
    title: "Rare 1978 Macallan Cask Sells for Record £2.8 Million at London Auction",
    excerpt:
      "A single sherry butt from Macallan's legendary 1978 vintage sets a new world record, reaffirming whisky casks as the premier alternative investment asset.",
    content: [
      "In a historic moment for the whisky investment world, a single 1978 Macallan sherry butt has sold for an astonishing £2.8 million at a prestigious London auction house, shattering the previous record by over £600,000 and sending ripples of excitement through the global investment community.",
      "The cask, which had been maturing for 48 years in a Highland warehouse, was purchased by a private Asian collector after a fierce bidding war that lasted nearly twenty minutes. Auctioneers described the atmosphere as 'electric,' with bidders from Hong Kong, Singapore, Dubai, and New York competing for what experts have called 'the finest cask to come to market in a generation.'",
      "The sale underscores a broader trend that has been building momentum throughout 2026. Whisky cask prices have appreciated by an average of 22% year-on-year, with premium distilleries like Macallan, Springbank, and The Dalmore leading the charge. Industry analysts now project that the whisky cask market will exceed £2 billion in total value by 2027.",
      "What makes this particular cask so valuable is the combination of its exceptional provenance, the legendary 1978 vintage — widely regarded as one of Macallan's finest — and the fact that it was a first-fill sherry butt, which imparts the richest and most complex flavours. With an estimated 180 bottles remaining after the angel's share, each bottle represents an extraordinary investment in its own right.",
      "For existing cask investors, record-breaking sales like this are tremendously positive news. They validate the asset class, attract new buyers to the market, and put upward pressure on prices across the entire spectrum. Even entry-level casks from reputable distilleries have seen their values rise by 15-18% in the wake of this auction.",
      "At Alto Whisky, we are seeing unprecedented demand from investors eager to secure their own piece of whisky history. Our Portfolio Advisors have access to casks from some of Scotland's most celebrated distilleries, and we can help you identify opportunities that align with your investment goals. Whether you're looking for a blue-chip distillery or an emerging producer with strong growth potential, now is an exceptional time to enter the market.",
    ],
  },
  {
    slug: "scottish-whisky-tourism-record-visitors-2026",
    image: whiskyTourismImg,
    category: "Industry News",
    date: "May 2026",
    title: "Scottish Whisky Tourism Hits Record 3 Million Visitors",
    excerpt:
      "Scotland's distilleries welcomed over three million visitors in 2025, a 24% increase that signals growing global enthusiasm for Scotch and rising demand for premium casks.",
    content: [
      "Scotland's whisky tourism industry has reached an extraordinary milestone, with over three million visitors touring the nation's distilleries in 2025 — a remarkable 24% increase from the previous year and the highest figure ever recorded.",
      "The Scottish Whisky Association (SWA) announced the figures at their annual conference in Edinburgh, hailing the results as 'a testament to the enduring global appeal of Scotch whisky.' The growth has been driven by a surge in visitors from the United States, India, and China, with the latter seeing a 78% increase following the recent tariff reductions.",
      "The economic impact has been substantial. Whisky tourism now contributes an estimated £1.2 billion annually to the Scottish economy, supporting over 12,000 jobs across the Highlands, Speyside, Islay, and the Lowlands. New visitor centres have opened at distilleries in every whisky region, with many now offering exclusive cask-purchasing experiences for serious investors.",
      "For cask investors, the tourism boom carries significant implications. Every visitor who tours a distillery, tastes a rare expression, and learns about the craft becomes a potential future buyer of premium whisky. This growing global awareness translates directly into increased demand for mature casks and bottled releases, driving up values across the board.",
      "Several distilleries have reported that visitors who experience their tours are significantly more likely to invest in casks. The Macallan's new £30 million visitor experience, which opened in early 2025, has already facilitated over £8 million in cask sales directly to tour participants. Other distilleries are rapidly following suit with immersive experiences that blend education, tasting, and investment opportunities.",
      "The tourism boom is also accelerating new distillery openings. In 2025 alone, eight new distilleries began production across Scotland, with a further twelve scheduled to open by 2028. While this increases overall supply, the demand growth is outpacing production, particularly for premium single malts aged twelve years or more.",
      "At Alto Whisky, we believe the connection between tourism and investment is one of the most compelling stories in the market today. As more people fall in love with Scotch whisky, the pool of potential buyers for your cask grows ever larger. Our team can help you select casks from distilleries that are capitalising on this tourism wave, ensuring your investment benefits from the heightened global interest.",
    ],
  },
  {
    slug: "new-speyside-distillery-opens-investors-2026",
    image: heroDistilleryImg,
    category: "Distillery News",
    date: "May 2026",
    title: "New £50 Million Speyside Distillery Opens Its Doors to Private Investors",
    excerpt:
      "A state-of-the-art distillery on the banks of the River Spey offers a rare ground-floor opportunity for cask investors seeking early-entry growth potential.",
    content: [
      "A stunning new £50 million distillery has officially opened on the banks of the River Spey, one of Scotland's most legendary whisky-producing regions, and it is already generating enormous excitement among cask investors seeking early-entry opportunities.",
      "Speyburn Glen Distillery, the first new distillery to open in Speyside in over a decade, combines centuries-old tradition with cutting-edge sustainable technology. Its founders, a team of former master distillers from The Macallan and Glenfiddich, have set out to create a whisky that honours the region's heritage while pushing the boundaries of quality and environmental responsibility.",
      "The distillery's location is exceptional. Situated on a historic farm with access to pure spring water filtered through ancient granite, Speyburn Glen benefits from the same natural advantages that have made Speyside the heartland of Scotch whisky production. The founders have also secured rare first-fill sherry casks from Jerez, Spain, ensuring that their inaugural releases will be of the highest calibre.",
      "Most significantly for investors, Speyburn Glen has reserved a significant portion of its first-year production exclusively for private cask owners. These 'founder casks' represent a rare opportunity to invest at the very beginning of a distillery's journey — a strategy that has historically delivered exceptional returns. Casks from similarly positioned new distilleries, such as Ardnamurchan and Annandale, have appreciated by over 300% within their first five years.",
      "The distillery has already attracted international attention, with pre-release tastings in London, New York, and Tokyo receiving rave reviews from industry critics. Whisky Magazine described the new-make spirit as 'extraordinously promising, with a richness and complexity that belies its youth.'",
      "Environmental credentials are also a key part of Speyburn Glen's appeal. The distillery operates on 100% renewable energy, utilises closed-loop water systems, and has committed to becoming carbon-negative by 2030. In an era where ESG considerations increasingly influence investment decisions, these credentials add an additional layer of value.",
      "At Alto Whisky, we are proud to be one of the select brokers offering Speyburn Glen founder casks to our clients. These represent a genuinely rare opportunity to invest in what could become one of Scotland's most celebrated distilleries. Our Portfolio Advisors have visited the site and can provide detailed insights into the production philosophy, the quality of the spirit, and the investment potential. Contact us today to secure your founder cask before allocations are fully subscribed.",
    ],
  },
  {
    slug: "scottish-distilleries-green-revolution-2026",
    image: sustainableWhiskyImg,
    category: "Industry News",
    date: "April 2026",
    title: "How Scotland's Distilleries Are Leading the Green Revolution",
    excerpt:
      "From carbon-negative production to regenerative barley farming, the Scotch whisky industry is embracing sustainability — and attracting a new wave of ethically minded investors.",
    content: [
      "The Scotch whisky industry is undergoing a remarkable green transformation, with distilleries across Scotland pioneering innovative sustainability practices that are not only protecting the environment but also enhancing the value of their products and attracting a new generation of ethically minded investors.",
      "In 2025, over 40 Scottish distilleries achieved carbon-neutral certification, up from just twelve the previous year. Leading the charge is Highland Park, which became the first major distillery to achieve carbon-negative status — meaning it removes more carbon from the atmosphere than it produces. The distillery achieved this through a combination of on-site renewable energy, peatland restoration, and a revolutionary closed-loop production system that recycles 98% of its water usage.",
      "Barley sourcing is another area where sustainability is creating investment value. Several distilleries have partnered with Scottish farmers to develop regenerative barley programmes that improve soil health, increase biodiversity, and sequester carbon. These programmes produce barley with unique flavour characteristics that are increasingly sought after by collectors and connoisseurs. Casks produced from regenerative barley programmes have commanded premium prices at auction, with some selling for 25-30% above comparable conventional casks.",
      "Packaging innovation is also reducing the industry's environmental footprint. Diageo, the world's largest spirits company, has committed to eliminating plastic from all its packaging by 2027 and is trialling lightweight glass bottles that reduce transport emissions by 18%. Independent bottlers are increasingly favouring recycled and upcycled materials, adding a compelling narrative to their limited releases.",
      "For investors, the sustainability movement offers both ethical satisfaction and financial advantage. ESG-focused investment funds are increasingly including whisky casks in their alternative asset allocations, bringing institutional capital into a market traditionally dominated by private collectors. This influx of institutional money is driving up prices and improving market liquidity.",
      "The Scotch Whisky Association has also announced an industry-wide pledge to achieve net-zero emissions across all production by 2040, with interim targets for 2030. This commitment is attracting government support and green financing, further strengthening the industry's long-term outlook.",
      "At Alto Whisky, we recognise that sustainability is not just a trend — it is the future of the industry. We actively partner with distilleries that share our commitment to environmental responsibility, and we can help you build a cask portfolio that aligns with your values as well as your investment objectives. Contact our team to learn more about our green whisky cask offerings and how sustainable investing can enhance both your returns and your impact.",
    ],
  },
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
