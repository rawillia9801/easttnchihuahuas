import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');
const inbox = 'applications@easttnchihuahuas.com';
const docs = [
  ['deposit-agreement','Deposit & Reservation Agreement'],
  ['bill-of-sale','Puppy Sales Agreement & Bill of Sale'],
  ['health-guarantee','1-Year Health Guarantee'],
  ['financing-addendum','Financing Addendum'],
  ['lifetime-return','Lifetime Return & Rehoming Policy'],
  ['transportation-policy','Transportation Policy'],
  ['buyer-care-agreement','Buyer Care Agreement'],
  ['small-puppy-policy','Small Puppy Safety Policy'],
  ['breeding-rights-policy','Breeding Rights Policy']
];

function file(rel){ return path.join(root, rel, 'index.html'); }

for (const [rel,title] of docs) {
  const target = file(rel);
  if (!fs.existsSync(target)) throw new Error(`Missing page: ${rel}`);
  let html = fs.readFileSync(target,'utf8');
  if (html.includes('class="document-email-submit"')) continue;
  const subject = encodeURIComponent(`East Tennessee Chihuahuas - ${title}`);
  const block = `\n<section class="document-email-submit section-space"><span class="panel-kicker">SUBMIT COMPLETED DOCUMENT</span><h2>Send this document to our general inbox</h2><p>Complete the document, use <strong>Print / Save PDF</strong> to save your copy, then email the completed PDF to us. No buyer portal account is required.</p><div class="document-submit-actions"><a class="button primary" href="mailto:${inbox}?subject=${subject}">EMAIL COMPLETED DOCUMENT</a><button class="button ghost" type="button" onclick="window.print()">PRINT / SAVE PDF</button></div><p class="submission-note">General document inbox: <strong>${inbox}</strong></p></section>`;
  html = html.replace(/<\/main>/i, `${block}\n</main>`);
  fs.writeFileSync(target, html);
}

fs.appendFileSync(path.join(root,'assets','styles.css'), `\n/* General document inbox submission */\n.document-email-submit{max-width:980px;margin-left:auto;margin-right:auto;border-top:1px solid #dce6ed;padding-top:28px}.document-submit-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:18px}.submission-note{font-size:.82rem;color:#65798a;margin-top:12px}@media(max-width:700px){.document-submit-actions{flex-direction:column}.document-submit-actions .button{text-align:center;width:100%}}@media print{.document-email-submit{display:none!important}}\n`);

for (const [rel] of docs) {
  const html=fs.readFileSync(file(rel),'utf8');
  if(!html.includes(`mailto:${inbox}`)) throw new Error(`Email submission link missing: ${rel}`);
}
console.log(`General inbox links applied to ${docs.length} documents.`);
