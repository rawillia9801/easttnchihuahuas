import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');
const pageFile = rel => path.join(root, rel, 'index.html');
const read = rel => fs.readFileSync(pageFile(rel), 'utf8');
const write = (rel, html) => fs.writeFileSync(pageFile(rel), html);

const healthSection = `
<section class="health-screening-standard section-space" aria-labelledby="health-screening-title">
  <span class="panel-kicker">HEALTH SCREENING &amp; VETERINARY CARE</span>
  <h2 id="health-screening-title">Health information is part of every breeding and placement decision.</h2>
  <p>Our breeding dogs have completed OFA health clearances for patellas, eyes, and hips, with normal results. Genetic health screening is also part of our breeding program. Health information is considered alongside temperament, structure, overall condition, and veterinary guidance when making breeding decisions.</p>
  <p>Before placement, each puppy also receives a veterinary health examination to evaluate overall condition and readiness for transition to their new home. Puppy-specific health records are provided to the buyer at placement.</p>
</section>`;

function insertAfterPageHeader(rel) {
  let html = read(rel);
  if (html.includes('HEALTH SCREENING &amp; VETERINARY CARE')) return;
  const headerPattern = /(<section class="page-header[^>]*>[\s\S]*?<\/section>)/i;
  if (!headerPattern.test(html)) throw new Error(`Page header not found on ${rel}`);
  html = html.replace(headerPattern, `$1\n${healthSection}`);
  write(rel, html);
}

for (const rel of ['health-care', 'our-program']) insertAfterPageHeader(rel);

// Homepage: summarize the same standard without turning the home page into a policy document.
{
  const file = path.join(root, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  const cardPattern = /<article><strong>Health &amp; Care<\/strong><p>[\s\S]*?<\/p><\/article>/i;
  if (!cardPattern.test(html)) throw new Error('Homepage Health & Care card was not found');
  html = html.replace(cardPattern, '<article><strong>Health &amp; Care</strong><p>Our breeding dogs have completed OFA health clearances for patellas, eyes, and hips, with normal results, alongside genetic health screening. Before placement, each puppy receives a veterinary health examination, and puppy-specific health records are provided to the buyer.</p></article>');
  fs.writeFileSync(file, html);
}

// Available Puppies: make the veterinary hand-off explicit.
{
  let html = read('available-puppies');
  const recordPattern = /<article><strong>Veterinary &amp; Health Records<\/strong><p>[\s\S]*?<\/p><\/article>/i;
  if (!recordPattern.test(html)) throw new Error('Available Puppies veterinary-record card was not found');
  html = html.replace(recordPattern, '<article><strong>Veterinary &amp; Health Records</strong><p>Before placement, each puppy receives a veterinary health examination to evaluate overall condition and readiness for transition to their new home. Puppy-specific health records are provided to the buyer at placement.</p></article>');
  write('available-puppies', html);
}

// Upcoming Litters: keep the parent-health description positive and factual.
{
  let html = read('upcoming-litters');
  const parentPattern = /<article><strong>Sire &amp; Dam<\/strong><p>[\s\S]*?<\/p><\/article>/i;
  if (!parentPattern.test(html)) throw new Error('Upcoming Litters Sire & Dam card was not found');
  html = html.replace(parentPattern, '<article><strong>Sire &amp; Dam</strong><p>The actual parents involved in the pairing, with available registration, current weight, and documented health information. Our breeding dogs have completed OFA health clearances for patellas, eyes, and hips, with normal results. Genetic health screening is also part of our breeding program.</p></article>');
  write('upcoming-litters', html);
}

fs.appendFileSync(path.join(root, 'assets', 'styles.css'), `
/* Health screening and veterinary-care standard */
.health-screening-standard{border:1px solid #cbdbe6;border-left:4px solid #0b77a8;border-radius:12px;background:#f8fbfd;padding:30px 34px;box-shadow:0 10px 28px rgba(9,38,65,.04)}
.health-screening-standard h2{margin:.25rem 0 .7rem;color:#102f4c}.health-screening-standard p{max-width:980px;color:#506779;line-height:1.72}
@media(max-width:700px){.health-screening-standard{padding:24px 22px}}
`);

const allHtml = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) allHtml.push(fs.readFileSync(full, 'utf8'));
  }
}
walk(root);
const publicOutput = allHtml.join('\n');

for (const phrase of [
  'do not describe a dog as OFA-tested',
  'do not claim a clearance that is not documented',
  'we do not perform OFA',
  'we do not have OFA'
]) {
  if (publicOutput.toLowerCase().includes(phrase.toLowerCase())) throw new Error(`Unwanted negative health disclosure remains: ${phrase}`);
}

for (const rel of ['', 'health-care', 'our-program', 'upcoming-litters']) {
  if (!/completed OFA health clearances for patellas, eyes, and hips, with normal results/i.test(read(rel))) throw new Error(`Completed OFA health clearances are missing from ${rel || 'home'}`);
}
if (!/Before placement, each puppy also receives a veterinary health examination/i.test(read('health-care'))) throw new Error('Puppy pre-placement veterinary exam statement is missing from Health & Care');

console.log('Health screening and pre-placement veterinary-care statements applied.');
