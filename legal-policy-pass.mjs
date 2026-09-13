import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');
const pageFile = rel => path.join(root, rel, 'index.html');
const read = rel => fs.readFileSync(pageFile(rel), 'utf8');
const write = (rel, html) => fs.writeFileSync(pageFile(rel), html);

const legalPages = [
  'policies',
  'deposit-agreement',
  'bill-of-sale',
  'health-guarantee',
  'financing-addendum',
  'lifetime-return',
  'transportation-policy',
  'buyer-care-agreement',
  'small-puppy-policy',
  'breeding-rights-policy',
  'terms',
  'privacy'
];

for (const rel of legalPages) {
  if (!fs.existsSync(pageFile(rel))) {
    throw new Error(`Missing legal page: ${rel}`);
  }
}

const standardsBody = `
<section class="page-header legal-page-header">
  <div>
    <span class="page-eyebrow">POLICIES &amp; STANDARDS</span>
    <h1>Application, placement, health, and contract standards.</h1>
    <p>These published standards explain how East Tennessee Chihuahuas evaluates homes, reserves puppies, determines readiness, transfers records, and documents each placement. Puppy-specific signed agreements control the individual transaction.</p>
  </div>
</section>

<article class="document-sheet policy-contract section-space">
  <div class="document-actions"><button class="button ghost" type="button" onclick="window.print()">PRINT / SAVE PDF</button></div>
  <div class="document-title">
    <span>EAST TENNESSEE CHIHUAHUAS</span>
    <h2>Policies &amp; Standards</h2>
    <p>Johnson City, Tennessee · Last updated September 2026</p>
  </div>

  <section>
    <h3>1. Application &amp; Placement Policy</h3>
    <p>We prioritize structural compatibility and developmental readiness over transaction speed. Our intentional five-step placement process filters for committed companion households and supports a well-prepared transition for each puppy.</p>
  </section>

  <section>
    <h3>1.1 Structural Intake Application</h3>
    <p>Every placement begins with our comprehensive intake questionnaire. This step captures the household environment, daily lifestyle, other animals, children, work and travel patterns, prior dog experience, puppy preferences, and care plan so we can evaluate compatibility with a toy-breed companion.</p>
  </section>

  <section>
    <h3>1.2 Core Review &amp; Consultation</h3>
    <p>After an application is received, we review the information for fit and readiness. Qualified applicants may be contacted for a direct conversation about household expectations, care routines, veterinary planning, transportation, puppy size, and any breed-specific considerations that should be addressed before a match is approved.</p>
  </section>

  <section>
    <h3>1.3 Compatibility Matching</h3>
    <p>We do not place puppies on an automatic first-click, first-served basis. Puppy allocation considers developmental observations, health stability, temperament, care needs, household structure, and the preferences stated in the approved application. An approved application does not guarantee a particular puppy.</p>
  </section>

  <section>
    <h3>1.4 Secure Reservation Placement</h3>
    <p>Once a specific puppy and approved household are matched, the reservation is documented in writing. Our standard reservation deposit is <strong>50% of the agreed puppy purchase price</strong>. The deposit is credited toward the final purchase price and, after the reservation is confirmed and the puppy is removed from public availability, is generally non-refundable if the buyer elects not to complete the purchase. If East Tennessee Chihuahuas cancels the placement or determines that the puppy cannot be transferred because of a health, developmental, or welfare concern, the written agreement governs the refund or transfer of reservation funds.</p>
  </section>

  <section>
    <h3>1.5 Developmental Placement Integration</h3>
    <p>Eight weeks is our minimum placement age, not an automatic release date. A puppy leaves only when we believe the puppy is developmentally ready for the planned transition. Size, appetite, weight stability, energy, health, travel demands, and individual care needs may require additional time. At transfer, the family receives the puppy-specific vaccination, deworming, and available veterinary and care records that apply to that puppy, together with the signed placement documents.</p>
  </section>

  <section>
    <h3>2. Health &amp; Care Standards</h3>
    <p>Our care program is built around age-appropriate preventive care, close observation, safe housing, appropriate nutrition, sanitation, social development, and veterinary involvement when a puppy or adult dog requires medical evaluation or treatment.</p>
  </section>

  <section>
    <h3>2.1 Puppy-Specific Records</h3>
    <p>Families receive the records that apply to their puppy, including documented vaccination and deworming information and available veterinary records. We do not represent testing, diagnoses, certifications, or veterinary procedures as completed unless they are actually documented for that dog.</p>
  </section>

  <section>
    <h3>2.2 Post-Placement Veterinary Examination</h3>
    <p>The buyer is expected to establish care with a licensed veterinarian and complete the examination required by the written Health Guarantee, currently within 72 hours after go-home. This provides an independent post-placement medical baseline and gives the family an immediate veterinary relationship.</p>
  </section>

  <section>
    <h3>2.3 Small-Puppy Readiness</h3>
    <p>Very small puppies may require more frequent meals, closer temperature management, overnight observation, restricted exposure, and additional time before transfer. Small size never overrides readiness. When an individual puppy needs extra time or a more intensive care plan, those needs are discussed before placement.</p>
  </section>

  <section>
    <h3>3. Financial Transparency</h3>
    <p>The puppy's price, reservation deposit, remaining balance, due dates, transportation charges, and any separately approved payment-plan terms are documented before transfer. A reservation deposit applies toward the purchase price. Any payment arrangement outside the standard sale terms must be approved and stated in writing.</p>
  </section>

  <section>
    <h3>4. Registration &amp; Breeding Rights</h3>
    <p>Companion placement is the default unless puppy-specific written documents expressly grant breeding rights. Registry eligibility, registration type, and any restrictions are stated in the final sale documents. Breeding authorization is never implied by possession of a puppy or registration papers.</p>
  </section>

  <section>
    <h3>5. Lifetime Responsibility</h3>
    <p>If a family can no longer keep a dog we placed, East Tennessee Chihuahuas must be contacted before the dog is sold, surrendered, gifted, transferred, or independently rehomed. The dog's safety and continuity of care come first.</p>
  </section>

  <section>
    <h3>6. Contract &amp; Policy Directory</h3>
    <ul class="legal-link-list">
      <li><a href="/deposit-agreement/">Deposit &amp; Reservation Agreement</a></li>
      <li><a href="/bill-of-sale/">Puppy Sales Agreement &amp; Bill of Sale</a></li>
      <li><a href="/health-guarantee/">1-Year Health Guarantee</a></li>
      <li><a href="/buyer-care-agreement/">Buyer Care Agreement</a></li>
      <li><a href="/small-puppy-policy/">Small Puppy Safety Policy</a></li>
      <li><a href="/lifetime-return/">Lifetime Return &amp; Rehoming Policy</a></li>
      <li><a href="/transportation-policy/">Transportation Policy</a></li>
      <li><a href="/financing-addendum/">Payment Plan Addendum</a></li>
      <li><a href="/breeding-rights-policy/">Breeding Rights Policy</a></li>
      <li><a href="/terms/">Terms</a></li>
      <li><a href="/privacy/">Privacy Policy</a></li>
    </ul>
  </section>

  <section>
    <h3>7. Controlling Documents</h3>
    <p>Website policy pages are advance-review copies of our general standards. The signed puppy-specific Bill of Sale, Deposit Agreement, Health Guarantee, approved addenda, and any written special conditions control the individual placement if a term differs from a general website summary.</p>
  </section>
</article>`;

function replaceMain(html, body) {
  return html.replace(/<main class="main-content(?:\s+[^\"]*)?">[\s\S]*?<\/main>/i, `<main class="main-content legal-document">${body}</main>`);
}

function addLegalClass(html) {
  return html.replace(/<main class="main-content(?![^\"]*legal-document)([^\"]*)">/i, '<main class="main-content legal-document$1">');
}

function removeMarketingCtas(html) {
  return html
    .replace(/<section class="split-banner[^\"]*">[\s\S]*?<\/section>/gi, '')
    .replace(/<a class="button primary"[^>]*>[\s\S]*?<\/a>/gi, match => {
      return /document-actions/i.test(match) ? '' : match;
    });
}

function normalizeDocumentActions(html) {
  return html.replace(/<div class="document-actions">([\s\S]*?)<\/div>/gi, (_, inner) => {
    const printButton = inner.match(/<button[^>]*onclick="window\.print\(\)"[^>]*>[\s\S]*?<\/button>/i);
    return printButton ? `<div class="document-actions">${printButton[0]}</div>` : '';
  });
}

let policies = read('policies');
policies = replaceMain(policies, standardsBody);
policies = policies.replace(/<title>[\s\S]*?<\/title>/i, '<title>Policies &amp; Standards | East Tennessee Chihuahuas</title>');
policies = policies.replace(/<meta[^>]+name="description"[^>]*>/i, '<meta content="Review East Tennessee Chihuahuas application, placement, health, reservation, registration, care, transportation, and contract standards before reserving a puppy." name="description"/>');
write('policies', policies);

for (const rel of legalPages.filter(rel => rel !== 'policies')) {
  let html = read(rel);
  html = addLegalClass(html);
  html = removeMarketingCtas(html);
  html = normalizeDocumentActions(html);
  write(rel, html);
}

const allHtml = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) allHtml.push(full);
  }
}
walk(root);

for (const full of allHtml) {
  let html = fs.readFileSync(full, 'utf8');
  html = html
    .replace(/<a class="nav-link" href="\/policies\/">\s*<span>Policies &amp; Contracts<\/span>\s*<\/a>/gi, '<a class="nav-link" href="/policies/"><span>Policies &amp; Standards</span></a>')
    .replace(/POLICIES &amp; CONTRACTS/g, 'POLICIES &amp; STANDARDS')
    .replace(/Policies &amp; Contracts/g, 'Policies &amp; Standards');
  fs.writeFileSync(full, html);
}

const css = `
/* Unified legal-document system */
.legal-document{max-width:1180px;margin:0 auto;padding-bottom:72px}
.legal-document .page-header{max-width:920px;margin:0 auto 28px;padding:18px 0 24px;border-bottom:2px solid #0b2946}
.legal-document .page-header .page-eyebrow{display:block;margin-bottom:10px;font-size:.72rem;font-weight:900;letter-spacing:.14em;color:#0b6f9f}
.legal-document .page-header h1{max-width:900px;margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:clamp(2.15rem,4vw,3.8rem);line-height:1.06;letter-spacing:-.025em;color:#0b2946}
.legal-document .page-header p{max-width:820px;margin:0;color:#566d80;line-height:1.7}
.legal-document .document-sheet,.legal-document .legal-paper,.legal-document .policy-contract{max-width:920px;margin:0 auto;background:#fff;border:1px solid #cbd6de;border-radius:2px;padding:58px 66px;box-shadow:0 12px 30px rgba(9,38,65,.045)}
.legal-document .document-title{margin:0 0 34px;padding:0 0 26px;text-align:center;border-bottom:2px solid #0b2946}
.legal-document .document-title span{font-size:.72rem;font-weight:900;letter-spacing:.15em;color:#0b6f9f}
.legal-document .document-title h2{margin:.45rem 0 .35rem;font-family:Georgia,'Times New Roman',serif;font-size:2rem;color:#0b2946}
.legal-document .document-title p{margin:0;color:#6b7d8b}
.legal-document .document-actions{display:flex;justify-content:flex-end;margin:0 0 24px}
.legal-document .document-sheet>section,.legal-document .legal-paper>section,.legal-document .policy-contract>section{margin:0;padding:22px 0;border:0;border-bottom:1px solid #dbe3e9}
.legal-document .document-sheet>section:first-of-type,.legal-document .legal-paper>section:first-of-type,.legal-document .policy-contract>section:first-of-type{border-top:1px solid #dbe3e9}
.legal-document .document-sheet h3,.legal-document .legal-paper h3,.legal-document .policy-contract h3{margin:0 0 9px;font-size:1.05rem;line-height:1.4;color:#102f4c}
.legal-document .document-sheet p,.legal-document .legal-paper p,.legal-document .policy-contract p,.legal-document .document-sheet li,.legal-document .legal-paper li,.legal-document .policy-contract li{color:#3f5669;line-height:1.72}
.legal-document .policy-lead,.legal-document .panel{max-width:920px;margin:0 auto;background:transparent;border:0;border-top:1px solid #d7e0e6;border-radius:0;box-shadow:none;padding:24px 0}
.legal-document .policy-lead{border-top:2px solid #0b2946;border-bottom:1px solid #d7e0e6}
.legal-document .policy-matrix,.legal-document .content-grid.two{display:block;max-width:920px;margin:0 auto}
.legal-document .policy-matrix article,.legal-document .content-grid.two>article{display:block;margin:0;padding:24px 0;background:transparent;border:0;border-bottom:1px solid #d7e0e6;border-radius:0;box-shadow:none}
.legal-document .policy-matrix article span,.legal-document .panel-kicker{display:block;margin-bottom:7px;font-size:.7rem;font-weight:900;letter-spacing:.13em;color:#0b6f9f}
.legal-document .policy-matrix h3,.legal-document .panel h2{margin:.2rem 0 .55rem;color:#102f4c}
.legal-document .policy-matrix p,.legal-document .panel p{margin:.3rem 0;color:#506779;line-height:1.68}
.legal-document .signature-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px 28px}
.legal-document .final-sign{margin-top:30px;padding-top:24px;border-top:2px solid #0b2946}
.legal-document .legal-link-list{margin:10px 0 0;padding-left:1.25rem;columns:2;column-gap:40px}
.legal-document .legal-link-list li{break-inside:avoid;margin:0 0 9px}
.legal-document .legal-link-list a{color:#075f91;text-decoration:underline;text-underline-offset:3px}
.legal-document .split-banner,.legal-document .doc-card,.legal-document .document-hub{box-shadow:none}
@media(max-width:760px){.legal-document .document-sheet,.legal-document .legal-paper,.legal-document .policy-contract{padding:32px 24px}.legal-document .signature-grid{grid-template-columns:1fr}.legal-document .legal-link-list{columns:1}.legal-document .page-header{padding-left:2px;padding-right:2px}}
@media print{.sidebar,.topbar,.footer,.nav-scrim,.document-actions{display:none!important}.workspace{margin:0!important}.main-content.legal-document{max-width:none!important;padding:0!important}.legal-document .page-header{display:none!important}.legal-document .document-sheet,.legal-document .legal-paper,.legal-document .policy-contract{max-width:none;border:0;box-shadow:none;padding:0}.legal-document .document-sheet>section,.legal-document .legal-paper>section,.legal-document .policy-contract>section{break-inside:avoid}}
`;

const cssPath = path.join(root, 'assets', 'styles.css');
let styles = fs.readFileSync(cssPath, 'utf8');
styles = styles.replace(/\/\* Unified legal-document system \*\/[\s\S]*$/m, '').trimEnd() + '\n' + css;
fs.writeFileSync(cssPath, styles);

for (const rel of legalPages) {
  const html = read(rel);
  if (!/main-content legal-document/.test(html)) throw new Error(`Legal layout class missing: ${rel}`);
  if (/class="split-banner/.test(html)) throw new Error(`Marketing CTA remained on legal page: ${rel}`);
}

console.log(`Unified contract layout applied to ${legalPages.length} policy/legal pages.`);
