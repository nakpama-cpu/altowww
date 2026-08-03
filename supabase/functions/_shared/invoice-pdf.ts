import { PDFDocument, StandardFonts, rgb } from "npm:pdf-lib@1.17.1";
import fontkit from "npm:@pdf-lib/fontkit@1.1.1";
import { COMPANY, BANK } from "./invoice-config.ts";
import { SERIF_REGULAR_BYTES, SERIF_SEMIBOLD_BYTES } from "./invoice-fonts.ts";


export type InvoiceLine = {
  distillery?: string | null;
  spirit?: string | null;
  spirit_name?: string | null;
  cask_type?: string | null;
  wood?: string | null;
  abv?: number | null;
  vintage_year?: number | null;
  quantity: number;
  list_price: number;
  unit_price: number;
  line_total: number;
};

export type InvoiceData = {
  invoice_number: string;
  payment_reference: string;
  issued_at: string;
  due_at: string;
  currency: string;
  subtotal: number;
  discount_amount: number;
  total: number;
  discount_code?: string | null;
  status?: "pending" | "paid" | "client_confirmed" | "cancelled" | "expired";
  paid_at?: string;
  bill_to: {
    name?: string;
    email?: string;
    lines?: string[];
  };
  items: InvoiceLine[];
};

const money = (n: number, currency: string) => {
  const symbol = currency?.toUpperCase() === "GBP" ? "GBP " : `${currency?.toUpperCase()} `;
  return `${symbol}${n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const dateStr = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const LOGO_URL =
  "https://altowhisky.com/__l5e/assets-v1/0e654173-6548-4cb5-8108-f18c2625b609/alto-logo-email.png";

async function fetchLogo(): Promise<Uint8Array | null> {
  try {
    const res = await fetch(LOGO_URL);
    if (!res.ok) return null;
    return new Uint8Array(await res.arrayBuffer());
  } catch (_e) {
    return null;
  }
}

type FooterOpts = {
  grey: ReturnType<typeof rgb>;
  line: ReturnType<typeof rgb>;
  copper: ReturnType<typeof rgb>;
  W: number;
  M: number;
};

// Company letterhead footer, anchored to the bottom of the page.
export function drawLetterheadFooter(
  page: any,
  regular: any,
  { grey, line, copper, W, M }: FooterOpts,
) {
  const rows = [
    `${COMPANY.registeredName} · ${COMPANY.addressLines.join(", ")}`,
    [
      COMPANY.website,
      COMPANY.telephone ? `Tel ${COMPANY.telephone}` : null,
      COMPANY.email,
    ].filter(Boolean).join("  ·  "),
    COMPANY.legalLine,
  ].filter(Boolean) as string[];

  const size = 6.8;
  const lineH = 10;
  const bottomBar = 6;
  const blockTop = bottomBar + 12 + rows.length * lineH;

  page.drawLine({
    start: { x: M, y: blockTop },
    end: { x: W - M, y: blockTop },
    thickness: 0.5,
    color: line,
  });

  let fy = blockTop - 12;
  for (const r of rows) {
    const w = regular.widthOfTextAtSize(r, size);
    page.drawText(r, { x: (W - w) / 2, y: fy, size, font: regular, color: grey });
    fy -= lineH;
  }

  page.drawRectangle({ x: 0, y: 0, width: W, height: bottomBar, color: copper });
}



export async function buildInvoicePdf(inv: InvoiceData): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const page = pdf.addPage([595.28, 841.89]); // A4
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  // Display serif (Cormorant Garamond) — matches the portal invoice preview
  let serif = regular;
  let serifBold = bold;
  try {
    serif = await pdf.embedFont(SERIF_REGULAR_BYTES, { subset: false });
    serifBold = await pdf.embedFont(SERIF_SEMIBOLD_BYTES, { subset: false });
  } catch (_e) {
    serif = regular;
    serifBold = bold;
  }


  // Brand palette (matches the website): deep navy, copper accent, warm cream
  const navy = rgb(0.106, 0.145, 0.208);
  const copper = rgb(0.706, 0.353, 0.114);
  const cream = rgb(0.965, 0.957, 0.941);
  const grey = rgb(0.42, 0.42, 0.42);
  const line = rgb(0.85, 0.85, 0.85);

  const M = 28;
  const W = 595.28;
  let y = 841.89;

  // Header band with logo (overshoot page edges so no white hairline shows)
  const bandH = 96;
  page.drawRectangle({ x: -6, y: y - bandH, width: W + 12, height: bandH + 6, color: navy });
  // copper hairline under the band
  page.drawRectangle({ x: -6, y: y - bandH - 3, width: W + 12, height: 3, color: copper });

  const logoBytes = await fetchLogo();
  let logoDrawn = false;
  if (logoBytes) {
    try {
      const img = await pdf.embedPng(logoBytes);
      const logoW = 98;
      const logoH = (img.height / img.width) * logoW;
      page.drawImage(img, {
        x: M,
        y: y - bandH / 2 - logoH / 2,
        width: logoW,
        height: logoH,
      });
      logoDrawn = true;
    } catch (_e) {
      logoDrawn = false;
    }
  }
  if (!logoDrawn) {
    page.drawText("ALTO WHISKY", { x: M, y: y - 58, size: 22, font: bold, color: rgb(1, 1, 1) });
    page.drawText("CASK WHISKY PORTFOLIOS", {
      x: M, y: y - 76, size: 7.5, font: regular, color: rgb(0.78, 0.78, 0.78),
    });
  }

  // Top-right: copper "INVOICE" label over the white invoice number
  const trackedWidth = (t: string, f: any, s: number, tr: number) =>
    f.widthOfTextAtSize(t, s) + tr * Math.max(0, t.length - 1);
  const drawTracked = (t: string, f: any, s: number, tr: number, rightX: number, ty: number, color: any) => {
    let x = rightX - trackedWidth(t, f, s, tr);
    for (const ch of t) {
      page.drawText(ch, { x, y: ty, size: s, font: f, color });
      x += f.widthOfTextAtSize(ch, s) + tr;
    }
  };
  const rightEdge = W - M;
  drawTracked("INVOICE", bold, 11, 3.2, rightEdge, y - 44, copper);
  const numTxt = inv.invoice_number || "";
  drawTracked(numTxt, serif, 23, 0.6, rightEdge, y - 74, cream);
  y -= bandH + 24;


  // Company / invoice meta
  const rightX = W / 2 + 20;
  let ly = y;
  page.drawText(COMPANY.tradingName, { x: M, y: ly, size: 9.5, font: bold, color: navy });
  ly -= 13;
  for (const l of COMPANY.addressLines) {
    page.drawText(l, { x: M, y: ly, size: 8.5, font: regular, color: grey });
    ly -= 11;
  }
  if (COMPANY.companyNumber) {
    page.drawText(`Company no. ${COMPANY.companyNumber}`, { x: M, y: ly, size: 8.5, font: regular, color: grey });
    ly -= 11;
  }
  page.drawText(COMPANY.email, { x: M, y: ly, size: 8.5, font: regular, color: grey });

  let ry = y;
  const meta: [string, string][] = [
    ["Invoice number", inv.invoice_number],
    ["Invoice date", dateStr(inv.issued_at)],
    inv.status === "paid" ? ["Payment status", "PAID"] : ["Payment due", dateStr(inv.due_at)],
    ["Payment reference", inv.payment_reference],
  ];
  for (const [k, v] of meta) {
    page.drawText(k.toUpperCase(), { x: rightX, y: ry, size: 7, font: regular, color: grey });
    page.drawText(v, { x: rightX + 110, y: ry, size: 9, font: bold, color: navy });
    ry -= 15;
  }

  y = Math.min(ly, ry) - 30;

  // Bill to
  page.drawText("INVOICE TO", { x: M, y, size: 7, font: bold, color: copper });
  y -= 14;
  page.drawText(inv.bill_to?.name || "", { x: M, y, size: 10, font: bold, color: navy });
  y -= 12;
  for (const l of (inv.bill_to?.lines ?? []).filter(Boolean)) {
    page.drawText(l, { x: M, y, size: 8.5, font: regular, color: grey });
    y -= 11;
  }
  if (inv.bill_to?.email) {
    page.drawText(inv.bill_to.email, { x: M, y, size: 8.5, font: regular, color: grey });
    y -= 11;
  }

  y -= 18;

  // Items table
  const cols = { desc: M, qty: 316, unit: 372, total: W - M };
  page.drawRectangle({ x: M, y: y - 6, width: W - M * 2, height: 20, color: cream });
  page.drawRectangle({ x: M, y: y - 6, width: 3, height: 20, color: copper });

  page.drawText("DESCRIPTION", { x: cols.desc + 6, y, size: 7, font: bold, color: navy });
  page.drawText("QTY", { x: cols.qty, y, size: 7, font: bold, color: navy });
  page.drawText("UNIT PRICE", { x: cols.unit, y, size: 7, font: bold, color: navy });
  const tHdr = "AMOUNT";
  page.drawText(tHdr, { x: cols.total - bold.widthOfTextAtSize(tHdr, 7) - 6, y, size: 7, font: bold, color: navy });
  y -= 24;

  const descMaxW = cols.qty - (cols.desc + 6) - 12;
  const wrapText = (text: string, font: any, size: number, maxW: number): string[] => {
    const words = text.split(" ");
    const out: string[] = [];
    let cur = "";
    for (const w of words) {
      const next = cur ? `${cur} ${w}` : w;
      if (font.widthOfTextAtSize(next, size) <= maxW || !cur) {
        cur = next;
      } else {
        out.push(cur);
        cur = w;
      }
    }
    if (cur) out.push(cur);
    return out;
  };

  for (const it of inv.items) {
    const title = [it.distillery, it.spirit_name && it.spirit_name !== it.distillery ? it.spirit_name : it.spirit]
      .filter(Boolean)
      .join(" ");
    const specLine = [
      it.vintage_year ? `${it.vintage_year}` : null,
      it.cask_type,
      it.wood,
      it.abv ? `ABV ${it.abv}% Approx` : null,
    ].filter(Boolean).join("  ·  ");
    const distilledLine = it.distillery
      ? `Distilled at ${/distillery/i.test(it.distillery) ? it.distillery : `${it.distillery} Distillery`}`
      : null;
    const specs = [specLine, distilledLine].filter(Boolean).join("\n");


    const discounted = it.unit_price < it.list_price;
    const listTotal = Math.round(it.list_price * it.quantity * 100) / 100;

    const titleLines = wrapText(title || it.spirit || "Cask", serif, 12, descMaxW);
    const specLines = specs
      ? specs.split("\n").flatMap((s) => wrapText(s, regular, 8, descMaxW))
      : [];

    const titleTop = y;
    let ty = y;
    for (const tl of titleLines) {
      page.drawText(tl, { x: cols.desc + 6, y: ty, size: 12, font: serif, color: navy });
      ty -= 14;
    }
    page.drawText(String(it.quantity), { x: cols.qty, y: titleTop, size: 9, font: regular, color: navy });

    // Price column (right side) starts on the title line
    let py = titleTop;
    if (discounted) {
      const listUnitTxt = money(it.list_price, inv.currency);
      page.drawText(listUnitTxt, { x: cols.unit, y: py, size: 8.5, font: regular, color: grey });
      page.drawLine({
        start: { x: cols.unit, y: py + 3 },
        end: { x: cols.unit + regular.widthOfTextAtSize(listUnitTxt, 8.5), y: py + 3 },
        thickness: 0.6, color: grey,
      });
      const listAmtTxt = money(listTotal, inv.currency);
      page.drawText(listAmtTxt, {
        x: cols.total - regular.widthOfTextAtSize(listAmtTxt, 8.5) - 6, y: py, size: 8.5, font: regular, color: grey,
      });
      page.drawLine({
        start: { x: cols.total - regular.widthOfTextAtSize(listAmtTxt, 8.5) - 6, y: py + 3 },
        end: { x: cols.total - 6, y: py + 3 },
        thickness: 0.6, color: grey,
      });
      py -= 14;
      const unitTxt = money(it.unit_price, inv.currency);
      page.drawText(unitTxt, { x: cols.unit, y: py, size: 9.5, font: bold, color: copper });
      const amtTxt = money(it.line_total, inv.currency);
      page.drawText(amtTxt, {
        x: cols.total - bold.widthOfTextAtSize(amtTxt, 9.5) - 6, y: py, size: 9.5, font: bold, color: copper,
      });
      py -= 14;
    } else {
      page.drawText(money(it.unit_price, inv.currency), { x: cols.unit, y: py, size: 9, font: regular, color: navy });
      const amt = money(it.line_total, inv.currency);
      page.drawText(amt, { x: cols.total - regular.widthOfTextAtSize(amt, 9) - 6, y: py, size: 9, font: regular, color: navy });
      py -= 14;
    }

    // Spec lines under the title, in the description column only
    for (const sl of specLines) {
      page.drawText(sl, { x: cols.desc + 6, y: ty, size: 8, font: regular, color: grey });
      ty -= 11;
    }

    if (discounted) {
      const saving = Math.round((listTotal - it.line_total) * 100) / 100;
      page.drawText(
        `${inv.discount_code || "Pallet discount"} applied — you save ${money(saving, inv.currency)}`,
        { x: cols.desc + 6, y: ty, size: 7.5, font: regular, color: copper },
      );
      ty -= 12;
    }

    y = Math.min(ty, py);
    page.drawLine({ start: { x: M, y: y + 2 }, end: { x: W - M, y: y + 2 }, thickness: 0.5, color: line });
    y -= 12;
  }


  // Totals
  y -= 6;
  const totalRow = (label: string, value: string, strong = false) => {
    const f = strong ? serif : regular;
    const s = strong ? 16 : 9.5;
    page.drawText(label, { x: cols.unit - 40, y, size: s, font: f, color: strong ? copper : grey });
    page.drawText(value, {
      x: cols.total - f.widthOfTextAtSize(value, s) - 6,
      y, size: s, font: f, color: strong ? copper : navy,
    });
    y -= strong ? 24 : 16;
  };
  totalRow("Subtotal", money(inv.subtotal, inv.currency));
  if (inv.discount_amount > 0) {
    totalRow(inv.discount_code ? `Discount (${inv.discount_code})` : "Discount", `-${money(inv.discount_amount, inv.currency)}`);
  }
  page.drawLine({ start: { x: cols.unit - 46, y: y + 8 }, end: { x: W - M, y: y + 8 }, thickness: 0.8, color: line });
  y -= 6;
  totalRow(inv.status === "paid" ? "Total paid" : "Total due", money(inv.total, inv.currency), true);

  // Payment block
  y -= 6;
  const boxH = 108;
  page.drawRectangle({ x: M, y: y - boxH, width: W - M * 2, height: boxH, color: cream });
  page.drawRectangle({ x: M, y: y - boxH, width: 3, height: boxH, color: copper });
  let by = y - 20;

  if (inv.status === "paid") {
    page.drawText("PAID IN FULL", { x: M + 16, y: by, size: 11, font: bold, color: copper });
    by -= 16;
    page.drawText(
      `Paid by bank transfer on ${dateStr(inv.paid_at || inv.issued_at)}. No further payment is due.`,
      { x: M + 16, y: by, size: 8, font: regular, color: grey },
    );
    by -= 14;
    page.drawText(
      `Payment reference: ${inv.payment_reference}`,
      { x: M + 16, y: by, size: 8, font: regular, color: grey },
    );
  } else {
    page.drawText("PAYMENT BY BANK TRANSFER", { x: M + 16, y: by, size: 8, font: bold, color: copper });
    by -= 16;
    const bankRows: [string, string][] = [
      ["Account name", BANK.accountName],
      ["Bank", BANK.bankName],
      ["Sort code", BANK.sortCode],
      ["Account number", BANK.accountNumber],
      ["IBAN / BIC", `${BANK.iban}  /  ${BANK.bic}`],
      ["Payment reference", inv.payment_reference],
    ];
    for (const [k, v] of bankRows) {
      page.drawText(k, { x: M + 16, y: by, size: 8, font: regular, color: grey });
      page.drawText(v, { x: M + 130, y: by, size: 8.5, font: bold, color: navy });
      by -= 13;
    }
  }
  y -= boxH + 18;

  if (inv.status !== "paid") {
    page.drawText(
      `Please quote reference ${inv.payment_reference} on your transfer. Casks are reserved until ${dateStr(inv.due_at)}.`,
      { x: M, y, size: 8, font: regular, color: grey },
    );
    y -= 14;
  }

  // Closing line
  page.drawText(
    "Thank you for your purchase, your ownership certificates will follow.",
    { x: M, y, size: 8, font: regular, color: grey },
  );

  // Letterhead footer, fixed to the bottom of the A4 page
  drawLetterheadFooter(page, regular, { grey, line, copper, W, M });


  return await pdf.save();
}
