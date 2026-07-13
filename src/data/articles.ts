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
    title: "The Macallan 1926 Sells for £2.1 Million — Setting the World Record for a Bottle of Whisky",
    excerpt:
      "Sotheby's London hammered down a bottle of The Macallan Adami 1926 for £2.1m, the highest price ever paid for a bottle of whisky and a powerful signal of enduring demand at the top of the market.",
    content: [
      "In November 2023, a single bottle of The Macallan Adami 1926 sold at Sotheby's in London for £2,187,500, setting the world record for the most expensive bottle of whisky ever sold at auction. The result, widely reported by the BBC, Reuters and Sotheby's itself, surpassed the previous record of £1.5m set in 2019 for a Macallan Fine and Rare 1926 at Sotheby's Hong Kong.",
      "Only forty bottles of the 1926 vintage were ever produced from cask 263, with twelve hand-painted by Italian artist Valerio Adami. Distilled in 1926 and bottled in 1986 after 60 years of maturation, these bottles have come to define the very top of the whisky collecting world and are routinely referenced by analysts as a barometer for the rare whisky market.",
      "While the headline price relates to a single bottle rather than a cask, results of this scale reverberate across the wider investment landscape. Auction houses such as Sotheby's, Bonhams and Whisky Auctioneer have all reported sustained interest in mature stock from the most coveted distilleries — The Macallan, Springbank, Bowmore, Ardbeg and Karuizawa among them.",
      "Industry indices have tracked the trend over the longer term. The Knight Frank Luxury Investment Index has repeatedly placed rare whisky among the strongest-performing collectibles of the past decade, even as bottle prices cooled in 2023 and 2024 following the post-pandemic peaks.",
      "For cask investors, sales of this magnitude underline a simple point: at the top of the market, demand for genuinely rare, well-documented Scotch remains robust. Mature casks from the most collected distilleries continue to attract serious buyers, particularly when provenance, age statement and cask type can be clearly evidenced.",
      "At Alto Whisky, we focus on casks with strong distillery pedigree and full documentation. Our Portfolio Advisors can talk you through the distilleries, cask types and maturation profiles best aligned with your goals — and explain how the broader rare whisky market context applies to the casks available today.",
    ],
  },
  {
    slug: "scottish-whisky-tourism-record-visitors-2026",
    image: whiskyTourismImg,
    category: "Industry News",
    date: "May 2026",
    title: "Scotch Whisky Tourism Climbs Back Above Two Million Visitors",
    excerpt:
      "The Scotch Whisky Association's most recent Visitor Attraction Survey shows distillery visits rebounding past two million a year, with new flagship visitor centres driving record engagement.",
    content: [
      "The Scotch Whisky Association's Visitor Attraction Survey has tracked a strong rebound in distillery tourism following the pandemic, with annual visits to Scotland's distilleries climbing back above two million — close to the pre-2020 record of 2.16 million reported for 2019.",
      "Speyside, the Highlands and Islay remain the most-visited regions, though the Lowlands have seen a notable lift on the back of openings such as The Clydeside Distillery in Glasgow, Holyrood in Edinburgh, Lindores Abbey in Fife and the restored Rosebank in Falkirk.",
      "Major investments in visitor experiences have helped drive the recovery. The Macallan Estate visitor experience in Speyside, opened in 2018 at a reported cost of around £140m, set a new benchmark for distillery hospitality. Johnnie Walker Princes Street in Edinburgh, opened by Diageo in 2021 as part of a £185m investment programme, has become one of the most visited paid attractions in Scotland.",
      "The SWA estimates that the whisky industry as a whole contributes more than £7bn in gross value added to the UK economy each year and supports tens of thousands of jobs, with tourism a meaningful and growing component of that contribution.",
      "For cask investors, sustained tourism matters because it broadens the global audience for Scotch. Visitors who tour a distillery, taste its range and learn about maturation often become long-term consumers — and, in some cases, future buyers of bottles and casks from the same producer.",
      "At Alto Whisky we view distillery engagement as a useful indicator of brand health. When selecting casks for clients, we consider the strength of a distillery's consumer-facing presence alongside production capacity, age profile and cask type. Speak to a Portfolio Advisor to discuss how these factors apply to the opportunities currently available.",
    ],
  },
  {
    slug: "new-speyside-distillery-opens-investors-2026",
    image: heroDistilleryImg,
    category: "Distillery News",
    date: "May 2026",
    title: "Rosebank Returns: A Lost Lowland Icon Reopens After 30 Years",
    excerpt:
      "Ian Macleod Distillers has revived Rosebank, the celebrated Falkirk distillery that fell silent in 1993, with new-make spirit flowing again and a visitor centre now open to the public.",
    content: [
      "One of the most compelling stories in modern Scotch whisky is the revival of Rosebank Distillery in Falkirk. Closed in 1993 and long mourned by collectors of triple-distilled Lowland malt, Rosebank was acquired by Ian Macleod Distillers — the family-owned company behind Glengoyne and Tamdhu — and has been painstakingly rebuilt on its original site beside the Forth and Clyde Canal.",
      "Spirit ran from the new stills in 2023 for the first time in three decades, using the distillery's original triple distillation regime, and the rebuilt site has since opened its doors to visitors. Industry coverage in Whisky Magazine, The Spirits Business and the Scotsman has framed the project as a flagship example of a serious investor restoring a closed icon rather than simply launching a new brand.",
      "Rosebank's pre-closure casks are already prized at auction, with bottles of original Rosebank routinely commanding strong four-figure sums. The combination of a famous closed-distillery name, a fully revived production site and decades of cult demand sets the project apart from a typical new-build.",
      "Rosebank is not the only revival of its kind. Brora was reopened by Diageo in 2021 after 38 years closed, with a reported £35m invested in the site. Port Ellen on Islay is being brought back by Diageo as part of the same programme. Together these projects mark one of the most significant phases of distillery investment Scotland has seen in a generation.",
      "For investors, the wider lesson is that distillery economics work over very long time horizons. Spirit laid down today does not become single malt for at least three years, and most premium expressions are aged considerably longer. Patient capital, careful cask selection and credible operators are central to any sensible cask strategy.",
      "Alto Whisky does not claim exclusive access to any single distillery's stock. What we do offer is help selecting casks with clear provenance from established producers, and an honest conversation about realistic timeframes and outcomes. Speak to a Portfolio Advisor to explore the casks currently available.",
    ],
  },
  {
    slug: "scottish-distilleries-green-revolution-2026",
    image: sustainableWhiskyImg,
    category: "Industry News",
    date: "April 2026",
    title: "Scotch Whisky's Net Zero Push: How the Industry Is Decarbonising",
    excerpt:
      "From the Scotch Whisky Association's 2040 Net Zero commitment to Glenmorangie's wetlands project and Glenfiddich's biogas trucks, decarbonisation is reshaping the industry's investment story.",
    content: [
      "The Scotch Whisky Association published its Sustainability Strategy in 2021, committing the industry to reach Net Zero emissions in its own operations by 2040 — a decade ahead of the UK's national target. The strategy also sets out goals on packaging, water stewardship and responsible land use, and is publicly reported on each year.",
      "Individual distilleries are putting concrete projects behind these commitments. Glenmorangie's DEEP (Dornoch Environmental Enhancement Project) has worked with the Marine Conservation Society and Heriot-Watt University to restore native European oyster reefs in the Dornoch Firth, helping filter water around the distillery's effluent outflow.",
      "William Grant & Sons has converted a fleet of Glenfiddich trucks to run on biogas produced from the distillery's own residues, while Bruichladdich on Islay became one of the first whisky distilleries in the world to achieve B Corp certification and has committed to becoming Net Zero by 2025 across its own operations.",
      "Diageo has invested in a series of energy projects across its Scottish sites, including biomass boilers and heat recovery, and is publicly trialling green hydrogen as a future fuel for distillation. Industry bodies such as the SWA report progress against the 2040 goals annually, and independent media including the Financial Times, BBC and The Drinks Business have covered the transition in depth.",
      "For investors, sustainability is increasingly relevant to long-term value. Distilleries that future-proof their operations against carbon pricing, water stress and packaging regulation are more likely to remain commercially strong over the multi-decade horizon relevant to cask maturation.",
      "Alto Whisky takes these factors into account when discussing distillery selection with clients. Speak to a Portfolio Advisor about how a distillery's operational and environmental credentials sit alongside more traditional considerations such as brand strength, age profile and cask type.",
    ],
  },
  {
    slug: "china-slashes-whisky-import-duty-2026",
    image: chinaTradeImg,
    category: "Industry News",
    date: "March 2026",
    title: "India–UK Trade Deal Halves Tariff on Scotch — What It Means for the Industry",
    excerpt:
      "The India–UK Free Trade Agreement signed in 2025 cuts India's 150% tariff on Scotch whisky in half immediately, with further reductions over the coming decade — a structural shift for the world's largest whisky market.",
    content: [
      "In May 2025 the UK and India concluded a Free Trade Agreement that included, for the first time, a substantial reduction in India's import tariff on Scotch whisky. Under the deal, the tariff falls from 150% to 75% on entry into force, and is set to decline progressively to 40% over a ten-year period. The announcement was confirmed by the UK government and welcomed publicly by the Scotch Whisky Association.",
      "India is widely reported as the world's largest whisky market by volume, but Scotch has historically held only a small share due to the tariff regime. The SWA has estimated that the agreement could be worth around £1bn in additional exports over the coming five years, and could support significant new investment in Scottish distilleries.",
      "Producers including Diageo, Pernod Ricard and William Grant & Sons have all publicly welcomed the agreement. For premium single malts in particular, India's rapidly growing middle class and developing on-trade are seen as a major long-term opportunity.",
      "There is recent precedent for tariff changes moving the market. When the United States imposed a 25% tariff on single malt Scotch whisky in October 2019, exports to the US fell sharply; the suspension of that tariff in 2021 was followed by a swift rebound. The SWA reported record total Scotch export values of £6.2bn in 2022 before a more modest 2023.",
      "For cask investors, structural changes in trade access matter because they expand the long-term demand base for mature stock from established distilleries. They do not, however, guarantee short-term price movements, and outcomes for any individual cask depend on many factors including distillery, age and cask type.",
      "Alto Whisky's Portfolio Advisors can talk you through how macro developments such as the India agreement, alongside broader demand trends in the US, China and Western Europe, inform our view on cask selection today.",
    ],
  },
  {
    slug: "whisky-casks-outperform-traditional-assets",
    image: whiskyInvestmentImg,
    category: "Market Insight",
    date: "February 2026",
    title: "Rare Whisky and the Knight Frank Luxury Investment Index: A Long-Term View",
    excerpt:
      "Rare whisky has been one of the standout luxury asset classes of the past decade, even after a recent cooling. We look at what the Knight Frank Luxury Investment Index actually says — and what it does not.",
    content: [
      "The Knight Frank Luxury Investment Index (KFLII) is one of the most widely cited benchmarks for collectible assets, tracking categories including rare whisky, fine wine, classic cars, art, watches, handbags, jewellery, coins and coloured diamonds. It is based on third-party indices such as Rare Whisky 101's Apex 1000 for the whisky component.",
      "Across the 2010s, rare whisky was repeatedly the top-performing category in the KFLII, with ten-year returns reported in the high hundreds of percent at its peak. According to the 2024 edition of the Wealth Report, rare whisky's ten-year return came in at around 280%, still among the strongest in the index even after a noticeable decline during 2023.",
      "Knight Frank's 2024 commentary noted that rare whisky values fell year-on-year in 2023, reflecting a broader cooling at the top end of the secondary market following exceptional gains during 2020 and 2021. The same report flagged a more selective market, with the strongest results concentrated in the most established names and ages.",
      "This nuanced picture matters. Whisky cask investment is not a guaranteed route to short-term gains, and the rare bottle market and the cask market are linked but distinct. Cask returns depend heavily on the distillery, cask type, age at exit, and how the spirit is ultimately sold — at auction, to an independent bottler, or via private bottling.",
      "Tax treatment in the UK remains an important part of the picture. HMRC has historically treated physical whisky casks held in bond as 'wasting assets' for Capital Gains Tax purposes, although individual tax outcomes depend on personal circumstances and should always be reviewed with a qualified tax adviser.",
      "Alto Whisky's role is to help clients build a clear-eyed view of the market. We focus on casks with strong distillery pedigree and full documentation, and we are transparent about both the opportunities and the limitations of cask investment. Speak to a Portfolio Advisor to explore options that fit your time horizon.",
    ],
  },
  {
    slug: "tax-free-investment-whisky-cask-wasting-asset",
    image: taxBenefitsImg,
    category: "Tax & Finance",
    date: "January 2026",
    title: "Whisky Casks and Capital Gains Tax: Understanding the 'Wasting Asset' Position",
    excerpt:
      "HMRC has long treated physical whisky casks as 'wasting assets' for Capital Gains Tax. Here is what that actually means, where the nuance sits, and why specialist tax advice is essential.",
    content: [
      "In the UK, HMRC's general approach is that 'wasting assets' — tangible movable property with a predictable useful life not exceeding 50 years — are exempt from Capital Gains Tax (CGT) under section 45 of the Taxation of Chargeable Gains Act 1992. Physical whisky in cask has historically been treated as falling within this exemption, on the basis that the cask is a depreciating physical container of consumable spirit.",
      "This treatment has made cask ownership attractive compared with assets where gains are subject to CGT at rates of 18% or 24% (for residential property) and up to 24% on other gains for higher-rate taxpayers, following changes announced in the 2024 Autumn Budget.",
      "Important nuances apply. The exemption is generally understood to relate to physical, identifiable casks held in bond, with proper ownership documentation such as a delivery order or warehouse account in the investor's name. Schemes that operate more like collective investments, or where investors do not hold identifiable casks, may be treated very differently for tax purposes.",
      "While whisky is in a UK bonded warehouse, no excise duty or VAT is payable on the spirit itself. Duty and VAT only become payable if the whisky is removed from bond for consumption in the UK, which is one reason most cask exits happen via trade sales or independent bottlers rather than the investor personally bottling for the UK market.",
      "Inheritance tax is a separate question. Cask values form part of an estate for IHT purposes in the normal way, and there is no special exemption analogous to the wasting-asset treatment for CGT.",
      "HMRC and the FCA have both warned in recent years about unregulated whisky cask investment schemes, and the BBC and other outlets have reported on cases where investors were mis-sold or could not evidence ownership of specific casks. Clear documentation and a reputable broker are essential.",
      "Alto Whisky provides full ownership documentation for every cask we broker and works only with established HMRC-bonded warehouses. We are not tax advisers, and we always recommend that clients confirm the tax position relating to their own circumstances with a qualified UK tax professional before investing.",
    ],
  },
  {
    slug: "scotlands-most-sought-after-distilleries",
    image: distilleryStillsImg,
    category: "Distillery News",
    date: "January 2026",
    title: "Inside Scotland's Most Sought-After Single Malt Distilleries",
    excerpt:
      "We explore the Highland, Speyside, Islay and Campbeltown distilleries producing some of the most collectible casks available to private investors today.",
    content: [
      "Scotland is home to more than 140 active malt and grain distilleries, according to the Scotch Whisky Association, each producing whisky with its own distinct character shaped by local water sources, climate, equipment and tradition. For cask investors, however, not all distilleries carry equal weight in the secondary market.",
      "The Highland region — Scotland's largest whisky-producing area by geography — is home to long-established names such as The Dalmore, Glenmorangie, Oban and Highland Park (technically Island under SWA categorisation). Their casks and bottles consistently command strong attention at auction.",
      "Speyside is widely regarded as the heartland of single malt production. The Macallan, Glenfiddich, The Glenlivet, Aberlour and Glenfarclas are among the most recognisable names globally, and Speyside accounts for over half of Scotland's malt distilleries.",
      "Islay's eight working distilleries — including Lagavulin, Ardbeg, Laphroaig, Bowmore, Bruichladdich, Bunnahabhain, Caol Ila and Kilchoman — produce intensely characterful whiskies that have developed dedicated followings worldwide. The reopening of Port Ellen by Diageo has added further attention to the island.",
      "Campbeltown, once home to more than 30 distilleries, now has just three working sites — Springbank, Glen Scotia and Glengyle. Springbank in particular is one of the most collected single malts in the world, with retail allocations regularly oversubscribed.",
      "When selecting a distillery for cask investment, brand reputation, production volume, age profile and cask type (for example first-fill sherry, refill bourbon, or wine finishes) all influence outcomes. Documented provenance is non-negotiable.",
      "Alto Whisky's Portfolio Advisors maintain relationships across Scotland's whisky regions and can help you understand how each distillery's profile fits within a balanced cask portfolio.",
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
      "When you invest in a whisky cask, one of the most common questions is: 'Where will my cask be stored?' The answer is in an HMRC-approved excise warehouse — a highly regulated, secure facility that plays a crucial role in protecting your investment.",
      "Excise warehouses, often referred to as 'bonded warehouses', are approved by HMRC under the Warehousekeepers and Owners of Warehoused Goods Regulations. Spirits stored under bond can mature without excise duty or VAT becoming payable until the goods are removed for UK consumption.",
      "These warehouses are subject to strict government oversight. Operators must hold an Excise Warehousekeeper approval, and detailed records are maintained for every cask — including its origin, contents, date of filling, and ownership history. This documentation provides the chain of provenance that underpins the value of your investment.",
      "Storage conditions matter. Traditional 'dunnage' warehouses — stone-built with earthen floors and casks stacked no more than three high — are widely considered ideal for slow, stable maturation. Modern 'racked' warehouses are more space-efficient and are used across the industry, including by major producers, with good results.",
      "Insurance is essential. Reputable brokers ensure that casks are insured against loss, damage or theft at full market value, and update cover as values change over time. At Alto Whisky, insurance is included as standard in our storage packages.",
      "Annual storage and insurance costs are typically modest — a small percentage of cask value, often a few tens of pounds per cask per year for storage and a separate insurance line. Specific costs depend on the warehouse, the cask type and the insured value.",
      "Alto Whisky works exclusively with established HMRC-approved warehouses across Scotland. Every client receives full documentation, including warehouse details, cask identification numbers and storage agreements, and warehouse visits can be arranged by appointment.",
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
      "Scotland's whisky industry is officially divided into five recognised regions under the Scotch Whisky Regulations 2009: Highland, Speyside, Lowland, Islay and Campbeltown. Each has distinctive characteristics that influence both flavour and the way casks tend to perform in the secondary market.",
      "Speyside, with more than half of Scotland's malt distilleries, produces whiskies generally known for elegance, sweetness and complexity. For investors, Speyside offers the widest range of options, from accessible entry-level casks to ultra-premium offerings from The Macallan, Glenfiddich and The Glenlivet.",
      "The Highlands encompass the largest geographical area and the most diverse range of styles, from coastal distilleries such as Oban to inland producers such as Dalmore and Glenmorangie. This diversity makes Highland casks useful building blocks for portfolio diversification.",
      "Islay, though small in size, produces some of the most distinctive and collectible whiskies in the world. The island's working distilleries — Lagavulin, Ardbeg, Laphroaig, Bowmore, Bruichladdich, Bunnahabhain, Caol Ila and Kilchoman — are widely recognised for their peated, maritime-influenced spirits.",
      "The Lowlands, traditionally associated with lighter, gentler whiskies, have experienced a clear revival. Auchentoshan, Glenkinchie and Bladnoch sit alongside more recent openings such as Clydeside, Holyrood, Lindores Abbey, Daftmill and the restored Rosebank.",
      "Campbeltown, once the whisky capital of Scotland, now has just three working distilleries — Springbank, Glen Scotia and Glengyle. Springbank in particular is among the most collected brands in the entire industry, with allocations regularly oversubscribed.",
      "Many investors choose to diversify across regions to balance their exposure. A portfolio might combine a Speyside cask for steady appreciation potential, an Islay cask for its strong consumer demand, and a Campbeltown cask for rarity value.",
      "Alto Whisky's Portfolio Advisors can talk you through how each region's profile fits with your goals and timeframe.",
    ],
  },
  {
    slug: "beginners-guide-whisky-cask-investment-2026",
    image: whiskyTastingImg,
    category: "Investment Guide",
    date: "November 2025",
    title: "A Beginner's Guide to Whisky Cask Investment in 2026",
    excerpt:
      "Everything you need to know about purchasing, storing, and selling whisky casks — from tax treatment to exit strategies.",
    content: [
      "Whisky cask investment has become one of the more talked-about alternative asset classes of the past decade. If you are new to the world of cask ownership, this guide walks through the essentials.",
      "At its core, whisky cask investment involves purchasing a specific, identifiable cask of maturing Scotch whisky, either directly from a distillery or through a specialist broker, and holding it in an HMRC-approved warehouse while it matures.",
      "Maturation matters because, by law, Scotch whisky must be aged in oak casks in Scotland for a minimum of three years before it can be sold as Scotch. In practice, most single malt sold commercially is significantly older, and casks are often held for a decade or more before exit.",
      "Tax treatment is one of the most-discussed features of cask investment. HMRC has historically treated physical casks held in bond as 'wasting assets' for Capital Gains Tax purposes. Individual tax outcomes depend on personal circumstances, and specialist tax advice should always be taken.",
      "When you purchase a cask through a reputable broker, you should receive clear ownership documentation, including a delivery order and a warehouse account in your name, the cask's unique reference number, and details of insurance cover. This documentation is essential for evidencing ownership and for any future sale.",
      "Costs vary widely depending on distillery, cask type and age. Entry-level new-make casks from less well-known distilleries can start in the low thousands of pounds, while well-aged casks from prestige distilleries can run into six figures or more.",
      "Exit options typically include selling the cask privately or via a broker, selling to an independent bottler, or — for those with experience — bottling under a private label. Each route has its own commercial and regulatory considerations.",
      "The FCA and HMRC have both warned about unregulated whisky cask schemes and there has been significant media coverage of cases where investors lost money. Working with an established broker, insisting on clear documentation, and seeking independent tax and legal advice are all important safeguards.",
      "Alto Whisky's team can talk you through the process end to end. Request our brochure to learn more about how cask ownership might fit alongside your other investments.",
    ],
  },
  {
    slug: "uk-india-fta-scotch-whisky-july-2026",
    image: chinaTradeImg,
    category: "Industry News",
    date: "June 2026",
    title: "UK–India Free Trade Agreement to Enter Into Force, Cutting Scotch Whisky Tariffs",
    excerpt:
      "The UK Government has confirmed the UK–India Free Trade Agreement will enter into force in July 2026, halving India's 150% tariff on Scotch whisky on day one — a moment the Scotch Whisky Association has called strategically significant for the industry.",
    content: [
      "On 17 June 2026 the Scotch Whisky Association welcomed the UK Government's confirmation that the UK–India Free Trade Agreement will enter into force in July 2026. SWA Chief Executive Mark Kent described the announcement as 'welcome news, given the strategic importance' of the Indian market for the Scotch whisky industry.",
      "Under the terms of the deal, the tariff applied to Scotch whisky imports into India — long-standing at 150% — will fall to 75% on day one, and then reduce further over the following decade. India is already Scotch whisky's largest export market by volume, with more than 192 million bottles shipped there in 2024 according to SWA data.",
      "In a briefing published on the SWA website, Kent noted that the Indian middle class continues to expand rapidly and that premiumisation trends are increasingly favouring imported single malts and blends. In November 2025, Kent told reporters that India was 'poised to become the largest global scotch market in value and volume terms' over the next few years.",
      "Producers have already begun to respond. The Herald reported in June 2026 that Glasgow-based independent bottler Hunter Laing — owner of the Ardnahoe Distillery on Islay — sees India as a defining market for the next phase of its growth. Larger producers including Diageo, Pernod Ricard and William Grant & Sons have all publicly welcomed the deal.",
      "For cask investors, sustained international demand is one of the fundamentals that underpin long-term value in mature Scotch stock. Rising consumption in a market the size of India tends to tighten the supply of aged whisky from established distilleries, particularly in the premium and super-premium segments where cask investors are typically positioned.",
      "At Alto Whisky, we watch export data and trade policy closely because they shape the demand side of the cask market. Speak to a Portfolio Advisor to discuss how the shifting international landscape is reflected in the casks currently available.",
    ],
  },
  {
    slug: "karuizawa-casks-425-million-christies-2026",
    image: auctionCaskImg,
    category: "Market Insight",
    date: "May 2026",
    title: "'Last' Karuizawa Casks Sell for £4.25m at Christie's London",
    excerpt:
      "Two of what are believed to be the final casks from Japan's closed Karuizawa distillery sold for £2,125,000 each at Christie's London in March 2026 — setting a new record for the auction house and underlining the enduring pull of the world's rarest whisky.",
    content: [
      "At a live auction on 10 March 2026, Christie's London sold two casks from the closed Japanese distillery Karuizawa for £2,125,000 each — a combined £4.25 million, or roughly US$5.65 million at the time. The result, reported by The Spirits Business, The Whiskey Wash and WhiskeyPulse, is a new record for the auction house for a whisky cask sale.",
      "Karuizawa, located at the foot of Mount Asama, produced single malt Japanese whisky from 1955 until it was mothballed in 2000 and formally closed in 2011. Because no new spirit has been laid down since, the remaining aged stock is finite, and casks in particular have become some of the most coveted assets in the collectible whisky world.",
      "The two casks sold in March — Nos. 6195 and 888 — are believed to be among the last full casks of Karuizawa to reach the open market. Christie's specialists noted that the sale reflected sustained interest at the very top of the market from Asian and European collectors, even as prices for more mainstream collectible bottlings have cooled from their 2022 highs.",
      "Broker Mark Littler, writing in a mid-2026 market outlook, argued that after several years of correction across luxury assets the cask market has entered a 'steadier place', with headline auction results like Karuizawa continuing to draw serious buyers to genuinely rare, well-documented stock.",
      "For cask investors, sales of this magnitude are not directly comparable to typical portfolio purchases, but they matter because they anchor the ceiling of the market and reinforce global collector interest. Distilleries with strong provenance, credible age statements and disciplined release strategies tend to benefit most from these moments.",
      "At Alto Whisky we focus on casks with clear documentation and distillery pedigree rather than speculative one-off assets. Our Portfolio Advisors can explain how top-end auction results feed through into the wider cask market — and how that context applies to the opportunities currently available to clients.",
    ],
  },
  {
    slug: "annandale-low-carbon-whisky-world-first-2026",
    image: sustainableWhiskyImg,
    category: "Sustainability",
    date: "April 2026",
    title: "Annandale Distillery Commissions 'World First' Low-Carbon Heat System",
    excerpt:
      "A £3.6m Net-Zero Thermal Energy Storage Hub at Annandale Distillery in Dumfries and Galloway has begun producing the high-temperature heat needed for distilling using renewable electricity — a project the distillery and the BBC describe as a world first for Scotch whisky.",
    content: [
      "On 14 April 2026 the BBC reported that Annandale Distillery in Dumfries and Galloway had commissioned a new system that it claims is the first of its kind in the world to produce distilling heat in this way. The £3.6 million Net-Zero Thermal Energy Storage Hub uses renewable electricity to generate heat at temperatures of up to 1,200°C, which is then stored and released as steam for the distillery's stills.",
      "The project was delivered in partnership with technology firm Exergy3 and steam specialists Cochran, with funding from the UK Government's Department for Energy Security and Net Zero through its Green Distilleries programme. Annandale describes the installation as 'a massive milestone' for the distillery and for the future of Scotch whisky more broadly.",
      "Steam is central to whisky production because it is used to heat the wash and spirit stills. Traditionally this heat has come from natural gas or heavy fuel oil, making it one of the largest sources of carbon emissions in a modern distillery. Replacing that fuel with stored renewable electricity offers a route to substantially lower-carbon distilling.",
      "Annandale is not alone. The proposed HyClyde project at Auchentoshan is exploring on-site green hydrogen production, InchDairnie in Fife has published a detailed sustainability timeline covering thermal vapour recompression and other efficiency measures, and Beam Suntory-backed 'WhiskHy' trials with Supercritical Solutions have been reported through the UK Government's Green Distilleries competition.",
      "For investors, the direction of travel matters. The Scotch Whisky Association has publicly targeted net-zero emissions from its own operations by 2040, and distilleries that credibly reduce their carbon footprint are increasingly attractive to premium buyers in Europe, North America and Asia — a factor that supports the long-term brand equity underpinning cask values.",
      "At Alto Whisky we view sustainability credentials as part of a distillery's long-term brand story, alongside age profile, cask type and production capacity. Speak to a Portfolio Advisor to understand how these factors feed into the casks we make available to clients.",
    ],
  },
  {
    slug: "old-pulteney-200-year-anniversary-50yo-2026",
    image: distilleryStillsImg,
    category: "Distillery News",
    date: "June 2026",
    title: "Old Pulteney Marks 200 Years with a 50-Year-Old Single Malt",
    excerpt:
      "The Highland distillery has released its oldest-ever bottling — a 50 Year Old single malt — to celebrate its bicentenary. Only 200 decanters will be available worldwide, in a milestone release that highlights the enduring value of well-aged Scotch.",
    content: [
      "On 17 June 2026 The Spirits Business reported that Old Pulteney, the Highland distillery in Wick on Scotland's north-east coast, had unveiled its oldest-ever release: Old Pulteney 50 Year Old. The whisky was launched by owner International Beverage to mark the distillery's 200th anniversary, with just 200 decanters made available globally.",
      "Both anniversary expressions — the 50 Year Old and an accompanying 10 Year Old Distillery Exclusive — were matured entirely at Pulteney Distillery in Wick, a rare provenance claim given how much modern Scotch is transported for warehousing elsewhere in Scotland. The releases were also covered by The Whisky Wire and The Herald, whose reporter visited the distillery in Wick to try the anniversary bottlings on site.",
      "Old Pulteney was founded in 1826 during the height of Wick's herring boom, and its 'Maritime Malt' identity has been closely tied to the town's coastal history ever since. The 200th anniversary programme is one of the more significant distillery milestones of 2026 and follows a period of renewed investment across the Highland region.",
      "Very old age statements from working distilleries — 40, 50 and beyond — are among the rarest categories of Scotch. Because casks lose volume to evaporation each year (the so-called 'angels' share'), what remains of a fifty-year-old cask is typically only a fraction of the original fill, which is a key reason why bottles from these releases command significant premiums.",
      "For cask investors, milestone releases like the Old Pulteney 50 Year Old are a reminder that time in oak is one of the strongest drivers of value in Scotch. Distilleries with credible archives of long-aged stock tend to command stronger secondary-market interest across their broader range.",
      "At Alto Whisky we take a long view when selecting casks for clients, focusing on distilleries with the pedigree and inventory to reward patience. Our Portfolio Advisors can discuss how ageing profiles influence value, and how to think about time horizons for your own portfolio.",
    ],
  },
  {
    slug: "isle-of-arran-james-hutton-anniversary-2026",
    image: whiskyInvestmentImg,
    category: "Distillery News",
    date: "June 2026",
    title: "Isle of Arran Releases James Hutton Anniversary Single Malt",
    excerpt:
      "Isle of Arran Distillers has unveiled a highly limited single malt commemorating the pioneering Scottish geologist James Hutton — a release that adds a new chapter to Arran's growing reputation as a modern independent distillery.",
    content: [
      "On 4 June 2026 Larder Magazine reported that Isle of Arran Distillers had launched a highly limited single malt Scotch whisky in tribute to the 18th-century Scottish geologist James Hutton, often described as the father of modern geology. The release forms part of the distillery's ongoing programme of collectible bottlings tied to Scottish scientific and cultural history.",
      "Isle of Arran Distillers, which operates the Lochranza distillery on Arran and the newer Lagg distillery in the south of the island, has become one of the most closely watched independent producers of the last two decades. Its bottlings have won multiple international awards and its releases regularly attract collector interest at auction.",
      "Highly limited commemorative releases like the James Hutton bottling illustrate a pattern common to a well-run modern distillery: build the core range, then release small parcels of older or specially cask-finished whisky that reinforce the brand's premium positioning. Over time, these limited editions help establish stronger secondary-market pricing for the distillery's broader inventory.",
      "Arran's growth also reflects the wider health of Scotland's independent distillery sector. According to Scotch Whisky Association figures, the number of operating malt distilleries in Scotland has risen substantially over the last decade, driven in part by successful independents such as Kilchoman, Daftmill, Ardnamurchan and Arran itself.",
      "For cask investors, distilleries with a consistent record of well-received limited releases are often attractive because they demonstrate active brand-building. That, in turn, tends to support demand for aged stock as it comes to market.",
      "At Alto Whisky we consider distillery reputation, release strategy and cask availability together when advising clients. Speak to a Portfolio Advisor to discuss how emerging and established independent distilleries fit alongside the more traditional names in a considered cask portfolio.",
    ],
  },
];

export const getArticleBySlug = (slug: string): Article | undefined =>
  articles.find((a) => a.slug === slug);
