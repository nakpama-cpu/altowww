# My Casks refinement — draft capability check and plan

## Capability answer
- **Can I create a native Lovable Draft from this session? Yes.** This session has a `drafts--create` tool (plus `drafts--list`, `drafts--refresh`, `drafts--accept`). Nothing has been created yet.
- **Can I switch my own execution into it? No.** A draft gets its own chat thread. Once it exists, only that thread can give it instructions. I can include the full brief as the draft's first instruction when I create it. The draft's agent then makes the code changes there and reports back to this thread. Main stays untouched until someone accepts the draft. I will not accept it.
- **How to verify which draft it is:** creation returns a draft id (`var_...`) and a thread id. `drafts--list` lists the draft by label (e.g. "My Casks refinement") with that id. You can confirm it in the drafts panel: Main should show no changes, and the draft should show its own preview.
- **Caveat:** a draft starts from Main's last saved version. The draft's chat history starts empty, so the instruction must state the whole brief.
- **Database:** drafts may run on an isolated backend. Either way, the brief will forbid any migrations, policy changes or data writes.

## Refinement (frontend only, `src/pages/portal/MyCasks.tsx`)
1. **Compact holdings list:** replace the tall stacked swipe/flip cards with compact rows, grouped by distillery and expandable. Each collapsed row shows cask number, distillery, cask type, age, purchase price and a certificate action.
2. **Expandable details:** expanding a row reveals the specifications already shown today (spirit, ABV, RLA, fill date, warehouse etc.), using the existing SpecBox style.
3. **Toolbar:** labelled Search, Distillery, Cask type, Certificate status (Available / Pending) and Sort controls on `.field-surface`. Includes a "Showing X of Y casks" count and a Clear button. Choices are kept in sessionStorage. Existing sort options are retained.
4. **Formatting:** UK dates via `toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })`. A single GBP formatter (`Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" })`) for every price.
5. **Remove** the hardcoded 12-year maturation bar (`targetYears = 12`).
6. **Preserve:** the existing `holdings` query and columns, RLS, `cask-certificates` signed-URL view/download (300s), the table view, the glass-card portal styling and the fonts and colours.

## Out of scope
No database, policy, edge function, integration or config changes. No other portal pages. No publish, no draft acceptance.

## On approval
Create one draft labelled "My Casks refinement" with the brief above as its first instruction. Then report its id/thread id here and leave it unaccepted and unpublished.
