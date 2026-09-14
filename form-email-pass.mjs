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

function pageFile(rel){ return path.join(root, rel, 'index.html'); }
function ensureScript(html){
  if (html.includes('/assets/form-submit.js')) return html;
  return html.replace('</body>', '<script src="/assets/form-submit.js" defer></script></body>');
}

for (const [rel,title] of docs) {
  const target = pageFile(rel);
  if (!fs.existsSync(target)) throw new Error(`Missing document page: ${rel}`);
  let html = fs.readFileSync(target,'utf8');
  html = html.replace(/<section class="document-email-submit[\s\S]*?<\/section>/i, '');
  const extra = rel === 'deposit-agreement'
    ? '<label>Deposit amount<input name="depositAmount" inputmode="decimal" placeholder="$250–$500" /></label>'
    : rel === 'bill-of-sale'
      ? '<label>Purchase price<input name="purchasePrice" inputmode="decimal" placeholder="Total purchase price" /></label>'
      : '';
  const form = `\n<section class="document-email-submit section-space"><span class="panel-kicker">SUBMIT COMPLETED DOCUMENT</span><h2>Submit this form directly to East Tennessee Chihuahuas</h2><p>Enter your contact information, review the document above, type your name as your electronic signature, and submit. The completed submission is sent directly to <strong>${inbox}</strong>, and a confirmation email is automatically sent to the email address you provide.</p><form class="document-submit-form" data-form-type="${rel}" data-form-label="${title}"><div class="submission-grid"><label>Customer name<input name="customerName" autocomplete="name" required /></label><label>Email address<input name="customerEmail" type="email" autocomplete="email" required /></label><label>Puppy name or ID <span>(if known)</span><input name="puppy" autocomplete="off" /></label>${extra}<label class="submission-wide">Additional details <span>(optional)</span><textarea name="notes" rows="4"></textarea></label><label class="submission-wide">Electronic signature<input name="typedSignature" autocomplete="name" required placeholder="Type your full legal name" /></label></div><label class="submission-check"><input type="checkbox" name="acknowledged" value="Yes" required /> I have reviewed this document and confirm that the information I am submitting is accurate.</label><div class="document-submit-actions"><button class="button primary" type="submit">SUBMIT COMPLETED DOCUMENT</button><button class="button ghost" type="button" onclick="window.print()">PRINT / SAVE PDF</button></div><p class="submission-status" role="status" aria-live="polite"></p></form></section>`;
  html = html.replace(/<\/main>/i, `${form}\n</main>`);
  html = ensureScript(html);
  fs.writeFileSync(target,html);
}

const applicationFile = pageFile('application');
if (!fs.existsSync(applicationFile)) throw new Error('Application page is missing');
let application = fs.readFileSync(applicationFile,'utf8');
application = ensureScript(application);
fs.writeFileSync(applicationFile, application);

const js = `
(()=>{
  const endpoint='/api/submit-form';
  const collect=(form)=>{
    const fd=new FormData(form); const fields={};
    for(const [k,v] of fd.entries()){
      const value=String(v);
      if(Object.prototype.hasOwnProperty.call(fields,k)) fields[k]=Array.isArray(fields[k])?[...fields[k],value]:[fields[k],value];
      else fields[k]=value;
    }
    return fields;
  };
  const post=async(payload)=>{
    const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(data.error||'Unable to submit the form.');
    return data;
  };
  const findEmail=(form)=>form.querySelector('input[type="email"]')||form.querySelector('input[name*="email" i]');
  const findName=(form)=>form.querySelector('input[name="customerName"]')||form.querySelector('input[name*="name" i]')||form.querySelector('input[type="text"]');

  document.querySelectorAll('.document-submit-form').forEach(form=>{
    form.addEventListener('submit',async event=>{
      event.preventDefault();
      if(!form.reportValidity()) return;
      const button=form.querySelector('button[type="submit"]'); const status=form.querySelector('.submission-status');
      button.disabled=true; button.textContent='SUBMITTING…'; status.textContent='Sending your completed document…';
      try{
        const fields=collect(form); const customerName=fields.customerName||''; const customerEmail=fields.customerEmail||'';
        await post({type:form.dataset.formType,label:form.dataset.formLabel,customerName,customerEmail,fields,pageUrl:location.href});
        status.textContent='Submitted successfully. A confirmation email has been sent to '+customerEmail+'.';
        button.textContent='SUBMITTED'; form.dataset.submitted='true';
      }catch(error){
        status.textContent=error.message+' Please try again or contact applications@easttnchihuahuas.com.';
        button.disabled=false; button.textContent='SUBMIT COMPLETED DOCUMENT';
      }
    });
  });

  const application=document.getElementById('puppyApplicationForm');
  if(application){
    const email=findEmail(application);
    if(email){ email.type='email'; email.required=true; }
    application.addEventListener('submit',async event=>{
      event.preventDefault(); event.stopImmediatePropagation();
      if(!application.reportValidity()) return;
      const submit=application.querySelector('[type="submit"]'); const original=submit?.textContent||'SUBMIT APPLICATION';
      if(submit){submit.disabled=true;submit.textContent='SUBMITTING…';}
      let status=application.querySelector('.application-submit-status');
      if(!status){status=document.createElement('p');status.className='application-submit-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');application.appendChild(status);}
      try{
        const fields=collect(application); const emailEl=findEmail(application); const nameEl=findName(application);
        const customerEmail=String(emailEl?.value||fields.email||fields.Email||'').trim();
        const customerName=String(nameEl?.value||fields.name||fields.Name||'').trim();
        if(!customerEmail) throw new Error('Please enter your email address so we can send your confirmation.');
        if(!customerName) throw new Error('Please enter your name.');
        await post({type:'application',label:'Puppy Application',customerName,customerEmail,fields,pageUrl:location.href});
        try{sessionStorage.setItem('etc_application_submitted','1')}catch{}
        status.textContent='Application submitted. We sent a confirmation to '+customerEmail+'.';
        setTimeout(()=>{location.href='/application-thank-you/';},900);
      }catch(error){
        status.textContent=error.message+' Please try again or contact applications@easttnchihuahuas.com.';
        if(submit){submit.disabled=false;submit.textContent=original;}
      }
    },true);
  }
})();
`;
fs.writeFileSync(path.join(root,'assets','form-submit.js'),js);

fs.appendFileSync(path.join(root,'assets','styles.css'), `\n/* Direct form submission */\n.document-submit-form{margin-top:22px}.submission-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.submission-grid label,.submission-check{display:flex;flex-direction:column;gap:7px;font-weight:800;color:#17324a}.submission-grid label span{font-weight:500;color:#738596;font-size:.8rem}.submission-grid input,.submission-grid textarea{font:inherit;padding:12px;border:1px solid #cad8e2;border-radius:9px;background:#fff;color:#102a40}.submission-wide{grid-column:1/-1}.submission-check{flex-direction:row;align-items:flex-start;margin-top:18px;font-weight:600}.submission-check input{margin-top:4px}.submission-status,.application-submit-status{margin-top:14px;font-weight:700;color:#31556f}@media(max-width:700px){.submission-grid{grid-template-columns:1fr}.submission-wide{grid-column:auto}}@media print{.document-email-submit{display:none!important}}\n`);

for (const [rel] of docs) {
  const html=fs.readFileSync(pageFile(rel),'utf8');
  if(!html.includes('data-form-type="'+rel+'"')) throw new Error(`Direct submission form missing: ${rel}`);
  if(!html.includes('name="customerEmail"')) throw new Error(`Customer email field missing: ${rel}`);
}
if(!fs.existsSync(path.join(root,'assets','form-submit.js'))) throw new Error('Form submission JavaScript is missing');
console.log(`Direct email submission enabled for application and ${docs.length} document forms.`);
