import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('public', 'financing-addendum', 'index.html');
if (!fs.existsSync(file)) throw new Error('Payment Plan Addendum page is missing');

let html = fs.readFileSync(file, 'utf8');

const body = `
<section class="page-header"><div><span class="page-eyebrow">PUPPY PAYMENT PLAN</span><h1>A clear financing plan with the numbers written down before the puppy goes home.</h1><p>Approved families may finance part of the puppy's purchase price for up to 12 months. The deposit, required pre-go-home payment, monthly schedule, late-payment terms, and default remedies are all stated in writing before the plan begins.</p></div></section>

<section class="panel section-space policy-lead"><span class="panel-kicker">HOW THE PLAN WORKS</span><h2>Deposit first, then half of the remaining balance before go-home.</h2><p>The reservation deposit is <strong>$250 for CKC or ACA puppies</strong> and <strong>$500 for AKC puppies</strong>. After that deposit is credited toward the purchase price, the buyer must pay <strong>50% of the remaining puppy balance before the puppy can go home</strong>. The balance left after that payment may be financed for up to <strong>12 months</strong> under the signed Payment Plan Addendum.</p></section>

<section class="policy-matrix section-space">
<article><span>01 / RESERVATION</span><h3>$250 CKC/ACA · $500 AKC deposit</h3><p>The reservation deposit is based on registration and is credited toward the puppy's purchase price.</p></article>
<article><span>02 / BEFORE GO-HOME</span><h3>50% of the remaining balance is due before transfer</h3><p>Once the deposit is applied, one-half of the remaining puppy balance must be paid before the puppy is released to the buyer.</p></article>
<article><span>03 / FINANCED BALANCE</span><h3>Up to 12 months</h3><p>The amount still owed after the required pre-go-home payment may be divided into as many as 12 monthly installments. The exact number of installments and payment amount are stated in the signed addendum.</p></article>
<article><span>04 / MONTHLY DUE DATE</span><h3>The same calendar day each month</h3><p>The first financed installment is due on the puppy's go-home date. Each later installment is due on the same numerical day of the following month, continuing monthly until the financed balance is paid in full.</p></article>
<article><span>05 / LATE PAYMENTS</span><h3>Late fee after the contractual grace period</h3><p>The standard addendum provides for a <strong>$25 late fee</strong> when a scheduled payment remains unpaid beyond the stated grace period, currently intended as 10 days after the due date, <strong>to the extent permitted by applicable law</strong>. The signed agreement controls the exact enforceable timing and amount.</p></article>
<article><span>06 / DEFAULT</span><h3>Nonpayment can lead to collection or court action</h3><p>If a buyer fails to make required payments and does not cure the default after written notice, East Tennessee Chihuahuas may pursue lawful collection remedies available under the signed agreement and applicable law. These may include referral to a collection agency, filing a civil or small-claims action where permitted, seeking a judgment for amounts lawfully due, and recovering court or collection costs only when authorized by the agreement and law.</p></article>
</section>

<section class="content-grid two section-space"><article class="panel"><span class="panel-kicker">PAYMENT PLAN APPLICATION</span><h2>Identity and contact information are required before financing is approved.</h2><p>Because the puppy may go home before the entire purchase price is paid, financing requires more information than a standard cash placement. Applicants should be prepared to provide their full legal name, date of birth, current address, phone number, email address, employer name, employer address and phone number, job title or occupation, length of employment, government-issued photo identification, and an emergency or alternate contact.</p><p><strong>Do not submit a Social Security number through the public website or by ordinary email.</strong> If additional verification is ever required, it should be collected through a secure private method.</p></article><article class="panel"><span class="panel-kicker">VERIFICATION &amp; RECORDS</span><h2>Information may be verified before approval.</h2><p>By applying for a payment plan, the buyer authorizes East Tennessee Chihuahuas to verify the contact, identity, and employment information supplied for the limited purpose of evaluating and administering the payment arrangement. Any identification copy or financing record should be handled as private customer information and used only for legitimate placement, payment, compliance, or collection purposes.</p></article></section>

<section class="document-sheet section-space"><div class="document-title"><span>EAST TENNESSEE CHIHUAHUAS</span><h2>Puppy Payment Plan Application &amp; Addendum</h2><p>Johnson City, Tennessee</p></div>
<section><h3>1. Applicant Information</h3><div class="signature-grid"><p>Full Legal Name: ______________________________</p><p>Date of Birth: __________________</p><p>Email: ______________________________________</p><p>Phone: _________________________</p><p>Current Address: ______________________________</p><p>City / State / ZIP: ______________</p><p>Government ID Type: __________________________</p><p>Last 4 / ID Reference: ___________</p></div></section>
<section><h3>2. Employment Information</h3><div class="signature-grid"><p>Employer: ___________________________________</p><p>Job Title: _______________________</p><p>Employer Phone: ______________________________</p><p>Length of Employment: ____________</p><p>Employer Address: _____________________________</p><p>Monthly Income (optional): ________</p></div></section>
<section><h3>3. Alternate Contact</h3><div class="signature-grid"><p>Name: ______________________________________</p><p>Relationship: ____________________</p><p>Phone: _____________________________________</p><p>Email: __________________________</p></div></section>
<section><h3>4. Puppy &amp; Purchase Terms</h3><div class="signature-grid"><p>Puppy Name / ID: _____________________________</p><p>Registry: CKC / ACA / AKC</p><p>Purchase Price: $_____________________________</p><p>Deposit Paid: $__________________</p><p>Balance After Deposit: $_______________________</p><p>50% Pre-Go-Home Payment: $_______</p><p>Amount Financed: $____________________________</p><p>Term: ______ months (maximum 12)</p><p>Monthly Payment: $____________________________</p><p>Monthly Due Day: _________________</p></div></section>
<section><h3>5. Payment Schedule</h3><p>The first financed installment is due on the puppy's go-home date. Each later installment is due on the same numerical day of each following month until the financed balance is paid in full, unless a different schedule is written into the signed addendum.</p></section>
<section><h3>6. Late Payment</h3><p>If a scheduled installment is not received within the grace period stated in this agreement, a $25 late fee may be assessed to the extent permitted by applicable law. A late fee is not a substitute for the required installment and does not waive an existing default.</p></section>
<section><h3>7. Default &amp; Right to Cure</h3><p>A missed payment places the account in default. East Tennessee Chihuahuas may provide written notice and a reasonable opportunity to cure as required by the agreement or applicable law. If the default is not cured, the remaining amount lawfully due may be accelerated only when permitted by the signed agreement and applicable law.</p></section>
<section><h3>8. Collection &amp; Legal Remedies</h3><p>After an uncured default, East Tennessee Chihuahuas may use lawful remedies to collect amounts due. Depending on the circumstances and applicable law, this may include internal collection efforts, referral to a licensed collection agency, or filing a civil or small-claims action in a court with proper jurisdiction. Any court costs, collection expenses, attorney's fees, interest, or other charges are recoverable only when expressly authorized by the signed agreement and permitted by law.</p></section>
<section><h3>9. Contact Information</h3><p>The buyer agrees to keep current mailing address, email address, phone number, and employment contact information on file while a financed balance remains outstanding and to notify East Tennessee Chihuahuas promptly of material changes.</p></section>
<section><h3>10. Privacy &amp; Identification</h3><p>Government-issued identification and financing records are collected for identity verification, administration of the payment plan, fraud prevention, and lawful collection activity. Sensitive information should not be sent through unsecured email. East Tennessee Chihuahuas does not require a Social Security number through this public form.</p></section>
<section><h3>11. Electronic Communications</h3><p>The buyer consents to receiving account notices, payment reminders, default notices, and payment-plan records electronically at the email address supplied unless applicable law requires another form of notice.</p></section>
<section><h3>12. Acknowledgment</h3><p>By signing, the buyer confirms that the payment amount, due dates, deposit credit, required pre-go-home payment, financed balance, late-payment terms, and default remedies have been disclosed before acceptance.</p></section>
<div class="signature-grid final-sign"><p>Buyer Signature: ______________________________</p><p>Date: __________________</p><p>Breeder Signature: ____________________________</p><p>Date: __________________</p></div></section>

<section class="split-banner section-space"><div><span>PAYMENT PLAN REQUEST</span><h2>Financing is approved separately from puppy placement.</h2><p>Submitting an application does not guarantee approval. Final terms are not effective until the written Payment Plan Addendum is completed and accepted by both parties.</p></div><a class="button primary large" href="/application/">START PUPPY APPLICATION</a></section>`;

html = html.replace(/<main class="main-content">[\s\S]*?<\/main>/i, `<main class="main-content">${body}</main>`);
html = html.replace(/<title>[\s\S]*?<\/title>/i, '<title>Puppy Payment Plan | East Tennessee Chihuahuas</title>');
html = html.replace(/<meta[^>]+name="description"[^>]*>/i, '<meta content="Review East Tennessee Chihuahuas puppy financing terms, including CKC/ACA and AKC deposits, the required pre-go-home payment, up to 12 monthly installments, late-payment terms, and the payment-plan application." name="description"/>');

fs.writeFileSync(file, html);

const verified = fs.readFileSync(file, 'utf8');
for (const required of [
  '$250 for CKC or ACA puppies',
  '$500 for AKC puppies',
  '50% of the remaining puppy balance before the puppy can go home',
  'up to <strong>12 months</strong>',
  '$25 late fee',
  'collection agency',
  'small-claims action',
  'Employer',
  'Government ID Type'
]) {
  if (!verified.includes(required)) throw new Error(`Payment plan copy missing: ${required}`);
}

console.log('Expanded puppy payment plan and financing application applied.');
