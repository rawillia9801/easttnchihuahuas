import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');
const pageFile = rel => path.join(root, rel, 'index.html');
const read = rel => fs.readFileSync(pageFile(rel), 'utf8');
const write = (rel, html) => fs.writeFileSync(pageFile(rel), html);
const replaceMain = (html, body) => html.replace(/<main class="main-content(?:\s+[^\"]*)?">[\s\S]*?<\/main>/i, `<main class="main-content">${body}</main>`);

const legalFooter = `
<nav class="page-legal-footer section-space" aria-label="Policies and legal documents">
  <a href="/policies/">Policies &amp; Standards</a>
  <a href="/deposit-agreement/">Deposit Agreement</a>
  <a href="/bill-of-sale/">Bill of Sale</a>
  <a href="/health-guarantee/">Health Guarantee</a>
  <a href="/terms/">Terms</a>
  <a href="/privacy/">Privacy</a>
  <a href="/contact/">Contact</a>
</nav>`;

const availableBody = `
<section class="page-header"><div><span class="page-eyebrow">CURRENT AVAILABILITY</span><h1>Available Puppies</h1><p>When a puppy is ready to be considered for placement, their current information appears here.</p></div></section>

<section class="section-space"><div id="puppyBoard" class="puppy-grid"><article class="panel puppy-empty premium-empty"><span class="panel-kicker">CURRENT AVAILABILITY</span><h2>No puppies are currently posted as available.</h2><p>That is not a broken page. It simply means we do not have a puppy publicly listed right now. You can still review upcoming litter plans, learn how matching works, or submit an application for future consideration.</p><div class="hero-actions priority-actions"><a class="button primary" href="/application/">APPLY FOR FUTURE CONSIDERATION</a><a class="button ghost" href="/upcoming-litters/">UPCOMING LITTERS</a></div></article></div></section>

<section class="safety-standard section-space" aria-labelledby="weight-safety-title"><span class="panel-kicker">DEVELOPMENTAL READINESS</span><h2 id="weight-safety-title">Our weight &amp; safety standard</h2><p>Chihuahua puppies can mature at very different rates, especially at the smallest sizes. We never clear a puppy for placement based on age alone. Weight, steady growth, appetite, energy, temperature stability, independence, and the demands of the receiving home all matter.</p><p>Especially small puppies may remain with us to 12 weeks or longer when they need additional development. Our pre-placement wellness process and puppy-specific veterinary findings are reviewed before release, and families receive the records that apply to their puppy.</p></section>

<section class="placement-includes section-space"><div class="section-heading"><span>EVERY COMPANION PLACEMENT INCLUDES</span><h2>A clear health, care, and legal hand-off.</h2></div><div class="trust-grid"><article><strong>Veterinary &amp; Health Records</strong><p>Puppy-specific wellness information and available veterinary documentation are provided with the puppy.</p></article><article><strong>Vaccination &amp; Parasite-Control Record</strong><p>Documented vaccine and deworming information that applies to the individual puppy.</p></article><article><strong>Transition Kit &amp; Care Guidance</strong><p>Familiar food or transition supplies, comfort items when appropriate, and toy-breed feeding and safety instructions.</p></article><article><strong>Written Placement Protections</strong><p>Deposit terms, Puppy Sales Agreement &amp; Bill of Sale, Health Guarantee, and Lifetime Return Policy.</p></article></div></section>

<section class="content-grid two section-space"><article class="panel"><span class="panel-kicker">WHAT HAPPENS NEXT</span><h2>Application first, reservation second.</h2><p>An application helps us understand your household, schedule, experience, other animals, and the type of companion you hope to welcome. It does not obligate you to purchase a puppy.</p><p>When a possible match becomes available, we can have a more useful conversation because we already understand what matters to your family.</p></article><article class="panel image-panel"><img class="inline-puppy-photo" src="/assets/home-puppy.webp" alt="Long-coat Chihuahua puppy"/><div><span class="panel-kicker">A LITTLE OF WHAT WE LOVE</span><h2>Big personality in a tiny package.</h2><p>We love confident, affectionate Chihuahuas with bright expressions and a strong connection to their people.</p><a class="text-link" href="/past-puppies/">VISIT PAST PUPPIES →</a></div></article></section>

<section class="journey section-space"><div class="section-heading"><span>IF YOU ARE WAITING FOR A PUPPY</span><h2>Your path forward is simple.</h2></div><div class="journey-grid three-step actionable-journey"><a class="journey-link" href="/application/"><b>01</b><strong>Apply</strong><p>Share your household and puppy preferences in our placement application.</p><span>START APPLICATION →</span></a><article><b>02</b><strong>Stay in Touch</strong><p>Approved families can be contacted when a potential match becomes available.</p></article><a class="journey-link" href="/deposit-agreement/"><b>03</b><strong>Reserve</strong><p>Once a specific puppy is approved for your home, written terms and the reservation deposit secure the placement.</p><span>READ DEPOSIT TERMS →</span></a></div></section>

${legalFooter}
<script src="/assets/puppies.js" defer></script>`;

const upcomingBody = `
<section class="page-header"><div><span class="page-eyebrow">UPCOMING LITTERS</span><h1>Planned Pairings &amp; Future Litters</h1><p>Breeding plans depend on the health, condition, recovery, and natural cycles of our dogs. We publish specifics when there is something real to announce.</p></div></section>

<section class="content-grid two section-space"><article class="panel"><span class="panel-kicker">CURRENT OUTLOOK</span><h2>Future pairings are being planned.</h2><p>We intentionally avoid publishing made-up due dates, guaranteed litter sizes, or exact puppy traits before nature gives us those answers. When a pairing is planned, this page will identify the actual sire and dam and the expected timing.</p><p>If a pregnancy is confirmed, we update the timeline as new information becomes available.</p></article><article class="panel image-panel"><img class="inline-puppy-photo" src="/assets/home-puppy.webp" alt="Long-coat Chihuahua puppy"/><div><span class="panel-kicker">WHY WE WAIT TO PROMISE</span><h2>Real dogs do not follow a production calendar.</h2><p>Heat cycles, conception, litter size, sex, coat, color, growth, and go-home timing can all vary. We would rather give families accurate updates than sell a prediction as a guarantee.</p></div></article></section>

<section class="maternal-standard section-space"><span class="panel-kicker">DAM-FIRST BREEDING STANDARD</span><h2>Maternal condition comes before a planned litter.</h2><p>We do not breed a female simply because another heat cycle arrived. Recovery, body condition, overall health, prior pregnancy and delivery history, age, and veterinary guidance all matter. If a dam needs more recovery time or is not in appropriate condition for a planned pairing, the pairing is postponed.</p></section>

<section class="program-standards section-space"><div class="section-heading"><span>WHEN A PAIRING IS ANNOUNCED</span><h2>Here is what we will publish.</h2></div><div class="trust-grid"><article><strong>Sire &amp; Dam</strong><p>The actual parents involved in the pairing, with registration details, current weight information, and the documented health information available for each dog. Completed health screening is described accurately, including whether it is veterinarian-performed, DNA-based, or registered through OFA/CAER when applicable. We do not treat a routine wellness examination as a substitute for a breed-specific screening test, and we do not claim a clearance that is not documented.</p></article><article><strong>Timing</strong><p>The breeding window, pregnancy status when known, expected birth window, and an estimated go-home range. Dates remain estimates until the puppies are born and developing normally.</p></article><article><strong>What May Be Possible</strong><p>Coat, color, registration, sex, size range, and other traits may be discussed as possibilities—not guarantees.</p></article><article><strong>Placement Notes</strong><p>Each litter update can identify size and growth observations, appetite and developmental needs, temperament trends, and specialized toy-breed care considerations. Exceptionally small puppies are specifically flagged when closer feeding and hypoglycemia precautions may be needed.</p></article></div></section>

<section class="journey section-space"><div class="section-heading"><span>EARLY CONSIDERATION</span><h2>How future placement works.</h2></div><div class="journey-grid three-step"><a class="journey-link" href="/application/"><b>01</b><strong>Application Review</strong><p>We learn about your household and what you are hoping for.</p><span>START APPLICATION →</span></a><article><b>02</b><strong>Litter Updates</strong><p>When a real pairing or litter is ready to discuss, approved families can be contacted.</p></article><a class="journey-link" href="/policies/"><b>03</b><strong>Individual Match</strong><p>Final placement decisions are based on the actual puppies—their development, temperament, health, and fit for the home.</p><span>REVIEW STANDARDS →</span></a></div></section>

<section class="split-banner section-space"><div><span>INTERESTED IN A FUTURE LITTER?</span><h2>You do not need to wait for a puppy to be posted before introducing yourself.</h2><p>An application gives us a useful starting point when the right puppy comes along.</p></div><a class="button primary large" href="/application/">START APPLICATION</a></section>

${legalFooter}`;

for (const [rel, body] of [['available-puppies', availableBody], ['upcoming-litters', upcomingBody]]) {
  if (!fs.existsSync(pageFile(rel))) throw new Error(`Missing page: ${rel}`);
  write(rel, replaceMain(read(rel), body));
}

const htmlFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}
walk(root);

for (const full of htmlFiles) {
  let html = fs.readFileSync(full, 'utf8');
  html = html
    .replace(/Our standard reservation deposit is\s*<strong>50% of the agreed puppy purchase price<\/strong>\./gi, 'Our standard reservation deposit generally ranges from <strong>$250 to $500</strong>. The exact amount is stated in the puppy-specific reservation agreement and is credited toward the purchase price.')
    .replace(/a 50% non-refundable deposit secures the specific puppy/gi, 'a non-refundable reservation deposit, generally $250–$500, secures the specific puppy')
    .replace(/50% to reserve a specific puppy/gi, '$250–$500 to reserve a specific puppy')
    .replace(/50% non-refundable deposit/gi, '$250–$500 non-refundable reservation deposit');
  fs.writeFileSync(full, html);
}

const css = `
/* Availability and upcoming-litter transparency pass */
.safety-standard,.maternal-standard{border:1px solid #cbdbe6;border-left:4px solid #0b77a8;border-radius:12px;background:linear-gradient(135deg,#f7fbfe 0%,#fffaf1 100%);padding:30px 34px;box-shadow:0 10px 28px rgba(9,38,65,.04)}
.safety-standard h2,.maternal-standard h2{margin:.25rem 0 .7rem;color:#102f4c}.safety-standard p,.maternal-standard p{max-width:980px;color:#506779;line-height:1.72}
.priority-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:20px}.placement-includes .trust-grid article{min-height:150px}.actionable-journey .journey-link,.journey-grid .journey-link{display:block;color:inherit;text-decoration:none;border:1px solid #d8e3ea;border-radius:14px;background:#fff;padding:22px;transition:transform .15s ease,box-shadow .15s ease,border-color .15s ease}.journey-grid .journey-link:hover{transform:translateY(-2px);border-color:#8fc4df;box-shadow:0 10px 28px rgba(9,38,65,.07)}.journey-grid .journey-link span{display:block;margin-top:12px;font-size:.72rem;font-weight:900;letter-spacing:.08em;color:#0873a8}.page-legal-footer{display:flex;gap:16px;flex-wrap:wrap;justify-content:center;border-top:1px solid #dbe4ea;padding-top:20px!important;font-size:.78rem}.page-legal-footer a{color:#5a7184;text-decoration:none}.page-legal-footer a:hover{text-decoration:underline;text-underline-offset:3px;color:#0b6f9f}
@media(max-width:700px){.safety-standard,.maternal-standard{padding:24px 22px}.priority-actions{flex-direction:column}.priority-actions .button{width:100%;text-align:center}.page-legal-footer{justify-content:flex-start}}
`;
fs.appendFileSync(path.join(root, 'assets', 'styles.css'), css);

const available = read('available-puppies');
const upcoming = read('upcoming-litters');
const allPublicHtml = htmlFiles.map(file => fs.readFileSync(file, 'utf8')).join('\n');

if (!/Our weight &amp; safety standard/i.test(available)) throw new Error('Available Puppies safety standard missing');
if (!/href="\/application\/"[^>]*>[\s\S]*?01[\s\S]*?Apply/i.test(available)) throw new Error('Available Puppies application step is not linked');
if (!/href="\/deposit-agreement\/"[^>]*>[\s\S]*?03[\s\S]*?Reserve/i.test(available)) throw new Error('Available Puppies reserve step is not linked');
if (!/EVERY COMPANION PLACEMENT INCLUDES/i.test(available)) throw new Error('Placement-includes section missing');
if (!/DAM-FIRST BREEDING STANDARD/i.test(upcoming)) throw new Error('Maternal safety standard missing');
if (!/routine wellness examination as a substitute for a breed-specific screening test/i.test(upcoming)) throw new Error('Health-testing transparency statement missing');
if (/50%/.test(allPublicHtml)) throw new Error('Incorrect 50% deposit language remains in public output');
if (!/\$250(?:\s|&ndash;|–|-|to)+\$500|\$250 to \$500/i.test(allPublicHtml)) throw new Error('Reservation deposit range is missing from public output');

for (const html of [available, upcoming]) {
  for (const href of ['/policies/', '/deposit-agreement/', '/bill-of-sale/', '/terms/', '/privacy/']) {
    if (!html.includes(`href="${href}"`)) throw new Error(`Required legal link missing: ${href}`);
  }
}

console.log('Availability, upcoming-litter, footer-link, deposit, and health-testing transparency pass applied.');
