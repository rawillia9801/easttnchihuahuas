import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('public', 'financing-addendum', 'index.html');
if (!fs.existsSync(file)) throw new Error('Payment Plan Addendum page is missing');

let html = fs.readFileSync(file, 'utf8');

html = html
  .replace(
    /<section class="panel section-space policy-lead">[\s\S]*?<\/section>/i,
    `<section class="panel section-space policy-lead"><span class="panel-kicker">PUPPY PAYMENT PLAN</span><h2>A simple, clearly defined payment schedule.</h2><p>For an approved payment-plan placement, the reservation deposit is paid first: <strong>$250 for CKC or ACA puppies</strong> and <strong>$500 for AKC puppies</strong>. Before the puppy may go home, the buyer must then pay <strong>one-half of the remaining puppy balance</strong>. The unpaid remainder continues under the written payment-plan addendum according to the agreed payment schedule.</p></section>`
  )
  .replace(
    /<article><span>01 \/ RESERVATION<\/span>[\s\S]*?<\/article>/i,
    `<article><span>01 / RESERVATION</span><h3>$250 CKC/ACA · $500 AKC deposit</h3><p>The reservation deposit is based on registration: <strong>$250 for CKC or ACA puppies</strong> and <strong>$500 for AKC puppies</strong>. The deposit is credited toward the puppy's purchase price.</p></article>`
  )
  .replace(
    /<article><span>02 \/ DISCLOSURE<\/span>[\s\S]*?<\/article>/i,
    `<article><span>02 / BEFORE GO-HOME</span><h3>Half of the remaining balance is due before transfer</h3><p>After the reservation deposit is applied, the buyer must pay <strong>50% of the remaining puppy balance</strong> before the puppy can go home. This payment is also credited toward the total purchase price.</p></article>`
  )
  .replace(
    /<article><span>03 \/ PAYMENT SCHEDULE<\/span>[\s\S]*?<\/article>/i,
    `<article><span>03 / REMAINING BALANCE</span><h3>The rest continues on the written payment plan</h3><p>Any balance still remaining after the required pre-go-home payment is handled under the signed payment-plan addendum. The addendum states each payment amount, due date, and final payoff date so both parties have the same written record.</p></article>`
  )
  .replace(
    /<article><span>04 \/ TRANSFER<\/span>[\s\S]*?<\/article>/i,
    `<article><span>04 / TRANSFER</span><h3>The puppy may go home after the required pre-transfer amount is paid</h3><p>Under the standard puppy payment plan, the puppy may transfer after the applicable reservation deposit and one-half of the remaining puppy balance have been paid, provided all other placement requirements and signed documents are complete.</p></article>`
  )
  .replace(
    /<article><span>05 \/ REGISTRATION<\/span>[\s\S]*?<\/article>/i,
    `<article><span>05 / WRITTEN TERMS</span><h3>No surprise amounts or due dates</h3><p>The signed addendum identifies the puppy, purchase price, deposit already paid, required pre-go-home payment, remaining financed balance, payment dates, and any applicable fees or late/default terms before the buyer accepts the plan.</p></article>`
  );

fs.writeFileSync(file, html);

const verified = fs.readFileSync(file, 'utf8');
for (const required of [
  '$250 for CKC or ACA puppies',
  '$500 for AKC puppies',
  '50% of the remaining puppy balance',
  'The rest continues on the written payment plan'
]) {
  if (!verified.includes(required)) throw new Error(`Payment plan copy missing: ${required}`);
}

console.log('Puppy payment plan terms applied.');
