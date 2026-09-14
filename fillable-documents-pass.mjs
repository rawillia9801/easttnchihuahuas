import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve('public');
const docs=[
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
const file=rel=>path.join(root,rel,'index.html');
const input=(name,label,type='text',extra='')=>`<label class="doc-field"><span>${label}</span><input name="${name}" type="${type}" ${extra}></label>`;
const textarea=(name,label)=>`<label class="doc-field doc-wide"><span>${label}</span><textarea name="${name}" rows="4"></textarea></label>`;

function details(rel){
  let extra='';
  if(rel==='deposit-agreement') extra=`${input('purchasePrice','Puppy purchase price','number','min="0" step="0.01"')}${input('depositAmount','Reservation deposit','number','min="0" step="0.01" required')}${input('remainingBalance','Remaining balance','number','min="0" step="0.01"')}${input('plannedTransferDate','Planned transfer date','date')}`;
  if(rel==='bill-of-sale') extra=`${input('purchasePrice','Purchase price','number','min="0" step="0.01" required')}${input('depositPaid','Deposit paid','number','min="0" step="0.01"')}${input('remainingBalance','Remaining balance','number','min="0" step="0.01"')}${input('registry','Registry / registration')}`;
  if(rel==='health-guarantee') extra=`${input('veterinarian','Veterinarian / clinic')}${input('examDate','Planned post-placement exam','date')}${textarea('healthNotes','Health notes or questions')}`;
  if(rel==='financing-addendum') extra=`${input('purchasePrice','Purchase price','number','min="0" step="0.01" required')}${input('depositPaid','Deposit paid','number','min="0" step="0.01"')}${input('financedBalance','Balance financed','number','min="0" step="0.01" required')}${input('firstPaymentDate','First payment date','date')}${textarea('paymentSchedule','Payment schedule / agreed terms')}`;
  if(rel==='lifetime-return') extra=`${input('dogCurrentName','Dog current name')}${input('requestedReturnDate','Requested return date','date')}${textarea('returnReason','Reason for return or change in circumstances')}${textarea('careNotes','Diet, medication, veterinary, and behavior notes')}`;
  if(rel==='transportation-policy') extra=`${input('transportMethod','Pickup / transportation method')}${input('travelDate','Preferred travel date','date')}${input('meetingLocation','Pickup or meeting location')}${textarea('transportNotes','Transportation notes')}`;
  if(rel==='buyer-care-agreement') extra=`${input('primaryVet','Primary veterinary clinic')}${input('emergencyVet','Emergency veterinary clinic')}${textarea('carePlan','Daily feeding, supervision, and safety plan')}`;
  if(rel==='small-puppy-policy') extra=`${input('feedingInterval','Planned feeding interval')}${input('emergencyVet','Emergency veterinary clinic')}${textarea('smallPuppyPlan','Feeding, warmth, overnight, and supervision plan')}`;
  if(rel==='breeding-rights-policy') extra=`${input('placementType','Companion or breeding-rights request')}${input('programName','Breeding program / kennel name')}${textarea('breedingPlan','Breeding experience, health testing, and placement plan')}`;
  return extra;
}

function completion(rel){
return `<section class="inline-document-form"><div class="inline-form-heading"><span>COMPLETE THIS DOCUMENT</span><h2>Enter your information directly into the agreement.</h2><p>These fields are part of the document. Review the terms below, sign, and submit the completed page.</p></div><div class="doc-grid">
${input('customerName','Buyer full name','text','autocomplete="name" required')}
${input('customerEmail','Email address','email','autocomplete="email" required')}
${input('phone','Phone number','tel','autocomplete="tel" required')}
${input('streetAddress','Street address','text','autocomplete="street-address" required')}
${input('city','City','text','autocomplete="address-level2" required')}
${input('state','State','text','autocomplete="address-level1" required')}
${input('postalCode','ZIP code','text','autocomplete="postal-code" required')}
${input('puppy','Puppy name / ID')}
${input('puppyDob','Puppy date of birth','date')}
${details(rel)}
${textarea('additionalDetails','Additional information or special terms')}
</div></section>`;
}

function signature(){return `<section class="inline-document-signature"><label class="doc-check"><input type="checkbox" name="acknowledged" value="Yes" required><span>I have reviewed this document and confirm that the information I entered is accurate.</span></label><div class="doc-grid">${input('typedSignature','Buyer signature — type your full name','text','autocomplete="name" required')}${input('signatureDate','Signature date','date','required')}<label class="doc-field doc-trap" aria-hidden="true"><span>Website</span><input name="website" tabindex="-1" autocomplete="off"></label></div><div class="doc-actions"><button class="button primary" type="submit">SUBMIT COMPLETED DOCUMENT</button><button class="button ghost" type="button" onclick="window.print()">PRINT / SAVE A COPY</button><p class="doc-submit-status" role="status" aria-live="polite"></p></div><p class="doc-note">Your completed fields are sent to applications@easttnchihuahuas.com and a confirmation is sent to your email address.</p></section>`;}

for(const [rel,title] of docs){
 let html=fs.readFileSync(file(rel),'utf8');
 html=html.replace(/<section class="document-email-submit[\s\S]*?<\/section>/gi,'');
 html=html.replace(/<script src="\/assets\/form-submit\.js" defer><\/script>/gi,'');
 const m=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);if(!m)throw new Error(`Main missing: ${rel}`);
 let body=m[1];const firstEnd=body.indexOf('</section>');if(firstEnd<0)throw new Error(`Header missing: ${rel}`);
 body=body.slice(0,firstEnd+10)+completion(rel)+body.slice(firstEnd+10);
 const form=`<form class="fillable-document-form" data-form-type="${rel}" data-form-label="${title}" novalidate>${body}${signature()}</form>`;
 html=html.replace(m[0],`<main class="main-content">${form}</main>`);
 if(!html.includes('/assets/fillable-documents.js'))html=html.replace('</body>','<script src="/assets/fillable-documents.js" defer></script></body>');
 fs.writeFileSync(file(rel),html);
}

const js=`(()=>{document.querySelectorAll('.fillable-document-form').forEach(form=>{form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const fd=new FormData(form),fields={};for(const [k,v] of fd.entries()){const s=String(v);fields[k]=k in fields?(Array.isArray(fields[k])?[...fields[k],s]:[fields[k],s]):s}const status=form.querySelector('.doc-submit-status'),button=form.querySelector('button[type="submit"]'),original=button.textContent;button.disabled=true;button.textContent='SUBMITTING…';status.textContent='Sending your completed document…';try{const r=await fetch('/api/submit-form',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:form.dataset.formType,label:form.dataset.formLabel,customerName:fields.customerName,customerEmail:fields.customerEmail,website:fields.website||'',fields,pageUrl:location.href})});const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.error||'Unable to submit the document.');status.textContent='Submitted. A confirmation was sent to '+fields.customerEmail+'.';button.textContent='SUBMITTED'}catch(err){status.textContent=err.message+' Please try again.';button.disabled=false;button.textContent=original}})})})();`;
fs.writeFileSync(path.join(root,'assets','fillable-documents.js'),js);
fs.appendFileSync(path.join(root,'assets','styles.css'),`\n/* Fillable customer documents */\n.fillable-document-form{display:block}.inline-document-form,.inline-document-signature{max-width:980px;margin:22px auto;background:#f8fbfd;border:1px solid #cfdee8;border-radius:16px;padding:26px}.inline-form-heading{margin-bottom:18px}.inline-form-heading>span{font-size:.72rem;letter-spacing:.12em;font-weight:900;color:#0670ad}.inline-form-heading h2{margin:.35rem 0}.inline-form-heading p{margin:.35rem 0 0;color:#60758b}.doc-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.doc-field{display:flex;flex-direction:column;gap:7px;font-weight:800;color:#17324a}.doc-field span{font-size:.8rem}.doc-field input,.doc-field textarea{font:inherit;padding:11px;border:1px solid #b9cad8;border-radius:8px;background:#fff;color:#102a40}.doc-wide{grid-column:1/-1}.doc-check{display:flex;gap:10px;align-items:flex-start;font-weight:700;line-height:1.5;color:#27465f}.doc-check input{margin-top:4px}.doc-actions{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:20px}.doc-submit-status{margin:0;font-weight:700;color:#31556f;flex:1}.doc-note{font-size:.8rem;color:#6b7d8c;margin:12px 0 0}.doc-trap{position:absolute!important;left:-10000px!important;width:1px!important;height:1px!important;overflow:hidden!important}@media(max-width:700px){.inline-document-form,.inline-document-signature{padding:20px}.doc-grid{grid-template-columns:1fr}.doc-wide{grid-column:auto}.doc-actions{flex-direction:column;align-items:stretch}.doc-actions .button{width:100%;text-align:center}}@media print{.doc-actions,.doc-note{display:none!important}.inline-document-form,.inline-document-signature{background:#fff;border:1px solid #bbb}}\n`);
for(const [rel] of docs){const html=fs.readFileSync(file(rel),'utf8');if(!html.includes(`data-form-type="${rel}"`))throw new Error(`Fillable form missing: ${rel}`);if(!html.includes('name="customerEmail"'))throw new Error(`Email field missing: ${rel}`);if(!html.includes('name="typedSignature"'))throw new Error(`Signature missing: ${rel}`);if(html.includes('class="document-email-submit'))throw new Error(`Legacy bottom form remains: ${rel}`)}
console.log(`Fillable document forms applied to ${docs.length} pages.`);
