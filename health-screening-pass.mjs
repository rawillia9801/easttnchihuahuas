import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');
const pageFile = rel => path.join(root, rel, 'index.html');
const read = rel => fs.readFileSync(pageFile(rel), 'utf8');
const write = (rel, html) => fs.writeFileSync(pageFile(rel), html);

const healthSection = `
<section class="health-screening-standard section-space" aria-labelledby="health-screening-title">
  <span class="panel-kicker">HEALTH TESTING</span>
  <h2 id="health-screening-title">Health Testing</h2>
  <p>The health of our breeding dogs is an important part of every breeding decision we make. Our dogs receive breed-appropriate health screening, with particular attention to the conditions identified as important in Chihuahuas.</p>
  <p>The Chihuahua Club of America recommends screening breeding Chihuahuas for patellar luxation, cardiac disease, and inherited eye conditions. We maintain health records for our breeding dogs and make applicable testing documentation available to prospective families.</p>
  <p>Additional genetic and veterinary screening may also be completed based on the individual dog and our veterinarian's recommendations. As OFA-registered results become available, individual health-testing information and verification will be included with each dog's profile.</p>
</section>`;

function replaceOrInsertHealthSection(rel) {
  let html = read(rel);
  const existingSectionPattern = /<section class="health-screening-standard section-space"[\s\S]*?<\/section>/i;
  if (existingSectionPattern.test(html)) {
    html = html.replace(existingSectionPattern, healthSection.trim());
    write(rel, html);
    return;
  }

  const headerPattern = /(<section class="page-header[^>]*>[\s\S]*?<\/section>)/i;
  if (!headerPattern.test(html)) throw new Error(`Page header not found on ${rel}`);
  html = html.replace(headerPattern, `$1\n${healthSection}`);
  write(rel, html);
}

for (const rel of ['health-care', 'our-program']) replaceOrInsertHealthSection(rel);

// Homepage: summarize the same health-testing approach without overstating registry status.
{
  const file = path.join(root, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  const cardPattern = /<article><strong>Health &amp; Care<\/strong><p>[\s\S]*?<\/p><\/article>/i;
  if (!cardPattern.test(html)) throw new Error('Homepage Health & Care card was not found');
  html = html.replace(cardPattern, '<article><strong>Health &amp; Care</strong><p>Our breeding dogs receive breed-appropriate health screening, with particular attention to patellar luxation, cardiac disease, and inherited eye conditions. We maintain health records and make applicable testing documentation available to prospective families.</p></article>');
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

// Upcoming Litters: keep the parent-health description factual and consistent with the main health section.
{
  let html = read('upcoming-litters');
  const parentPattern = /<article><strong>Sire &amp; Dam<\/strong><p>[\s\S]*?<\/p><\/article>/i;
  if (!parentPattern.test(html)) throw new Error('Upcoming Litters Sire & Dam card was not found');
  html = html.replace(parentPattern, '<article><strong>Sire &amp; Dam</strong><p>The actual parents involved in the pairing, with available registration, current weight, and documented health information. Our breeding dogs receive breed-appropriate health screening, and applicable testing documentation is made available to prospective families.</p></article>');
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
  'completed OFA health clearances for patellas, eyes, and hips',
  'OFA health clearances for patellas, eyes, and hips, with normal results',
  'do not describe a dog as OFA-tested',
  'do not claim a clearance that is not documented',
  'we do not perform OFA',
  'we do not have OFA'
]) {
  if (publicOutput.toLowerCase().includes(phrase.toLowerCase())) throw new Error(`Unwanted health-testing language remains: ${phrase}`);
}

for (const rel of ['health-care', 'our-program']) {
  const html = read(rel);
  if (!/The health of our breeding dogs is an important part of every breeding decision we make\./i.test(html)) throw new Error(`Health Testing introduction is missing from ${rel}`);
  if (!/patellar luxation, cardiac disease, and inherited eye conditions/i.test(html)) throw new Error(`Breed-appropriate Chihuahua screening language is missing from ${rel}`);
  if (!/As OFA-registered results become available/i.test(html)) throw new Error(`OFA verification language is missing from ${rel}`);
}

if (!/breed-appropriate health screening/i.test(read(''))) throw new Error('Updated health-testing summary is missing from home');
if (!/applicable testing documentation is made available/i.test(read('upcoming-litters'))) throw new Error('Updated parent health-testing language is missing from Upcoming Litters');
if (!/Before placement, each puppy receives a veterinary health examination/i.test(read('available-puppies'))) throw new Error('Puppy pre-placement veterinary exam statement is missing from Available Puppies');

console.log('Health Testing language applied consistently.');
