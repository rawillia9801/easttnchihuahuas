import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');
const contactFile = path.join(root, 'contact', 'index.html');
const stylesFile = path.join(root, 'assets', 'styles.css');
const scriptFile = path.join(root, 'assets', 'contact-submit.js');

if (!fs.existsSync(root)) {
  throw new Error('public/ must exist before email-routing-pass.mjs runs');
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

for (const file of walk(root).filter((file) => file.endsWith('.html'))) {
  let html = fs.readFileSync(file, 'utf8');
  html = html.replaceAll('hello@easttnchihuahuas.com', 'contact@easttnchihuahuas.com');
  fs.writeFileSync(file, html);
}

if (!fs.existsSync(contactFile)) {
  throw new Error('Contact page is missing');
}

let contact = fs.readFileSync(contactFile, 'utf8');

const contactSection = `
<section class="website-contact-panel section-space" id="send-message">
  <div class="section-heading">
    <span>CONTACT EAST TENNESSEE CHIHUAHUAS</span>
    <h2>Send us a message</h2>
    <p>Choose the reason for your message and we will route it to the right inbox automatically. You will receive an email confirmation after the form is delivered.</p>
  </div>
  <div class="contact-route-grid">
    <article class="panel"><span class="panel-kicker">GENERAL QUESTIONS</span><h3>contact@easttnchihuahuas.com</h3><p>Puppy availability, our program, pricing, transportation, and general questions.</p></article>
    <article class="panel"><span class="panel-kicker">APPLICATIONS</span><h3>applications@easttnchihuahuas.com</h3><p>Puppy applications, application questions, and completed placement documents.</p></article>
    <article class="panel"><span class="panel-kicker">BUYER SUPPORT</span><h3>support@easttnchihuahuas.com</h3><p>Existing buyers, puppy-family updates, records, post-placement questions, and website support.</p></article>
  </div>
  <form class="website-contact-form panel" id="websiteContactForm" novalidate>
    <div class="contact-form-grid">
      <label>Your name<input type="text" name="customerName" autocomplete="name" required maxlength="160" /></label>
      <label>Email address<input type="email" name="customerEmail" autocomplete="email" required maxlength="254" /></label>
      <label>Reason for contacting us
        <select name="requestType" required>
          <option value="">Choose one</option>
          <option value="general">General question</option>
          <option value="puppy">Puppy availability or program question</option>
          <option value="application-question">Application question</option>
          <option value="existing-buyer">Existing buyer / puppy-family support</option>
          <option value="family-update">Past-puppy family update</option>
          <option value="website-help">Website or form help</option>
        </select>
      </label>
      <label>Phone number <span>(optional)</span><input type="tel" name="phone" autocomplete="tel" maxlength="40" /></label>
      <label class="contact-message-field">Message<textarea name="message" rows="7" required maxlength="6000"></textarea></label>
      <label class="contact-honeypot" aria-hidden="true">Website<input type="text" name="website" tabindex="-1" autocomplete="off" /></label>
    </div>
    <div class="contact-submit-row">
      <button class="button primary" type="submit">SEND MESSAGE</button>
      <p class="contact-submit-status" role="status" aria-live="polite"></p>
    </div>
  </form>
</section>`;

if (!contact.includes('id="websiteContactForm"')) {
  contact = contact.replace(/<\/main>/i, `${contactSection}\n</main>`);
}

if (!contact.includes('/assets/contact-submit.js')) {
  contact = contact.replace('</body>', '<script src="/assets/contact-submit.js" defer></script></body>');
}

fs.writeFileSync(contactFile, contact);

const script = `
(()=>{
  const form=document.getElementById('websiteContactForm');
  if(!form)return;
  const status=form.querySelector('.contact-submit-status');
  const button=form.querySelector('button[type="submit"]');
  const endpoint='/api/submit-form';
  const collect=()=>{
    const fields={};
    const fd=new FormData(form);
    for(const [key,value] of fd.entries()) fields[key]=String(value);
    return fields;
  };
  const route=(requestType)=>{
    if(requestType==='application-question') return 'application-inquiry';
    if(['existing-buyer','family-update','website-help'].includes(requestType)) return 'support';
    return 'contact';
  };
  form.addEventListener('submit',async(event)=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const fields=collect();
    const type=route(fields.requestType||'');
    button.disabled=true;
    button.textContent='SENDING…';
    status.textContent='Sending your message…';
    try{
      const response=await fetch(endpoint,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          type,
          customerName:fields.customerName||'',
          customerEmail:fields.customerEmail||'',
          website:fields.website||'',
          fields,
          pageUrl:location.href
        })
      });
      const data=await response.json().catch(()=>({}));
      if(!response.ok) throw new Error(data.error||'Unable to send your message.');
      const sentTo=data.deliveredTo||'the appropriate inbox';
      const confirmation=data.confirmationSentTo||fields.customerEmail;
      form.reset();
      status.textContent='Message sent to '+sentTo+'. A confirmation was sent to '+confirmation+'.';
      button.textContent='MESSAGE SENT';
      setTimeout(()=>{button.disabled=false;button.textContent='SEND MESSAGE';},2200);
    }catch(error){
      status.textContent=error.message+' Please try again.';
      button.disabled=false;
      button.textContent='SEND MESSAGE';
    }
  });
})();
`;

fs.mkdirSync(path.dirname(scriptFile), { recursive: true });
fs.writeFileSync(scriptFile, script);

const css = `
/* Website email routing and automatic confirmations */
.website-contact-panel{display:grid;gap:20px}.contact-route-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.contact-route-grid .panel{padding:22px}.contact-route-grid h3{font-size:1rem;overflow-wrap:anywhere}.website-contact-form{padding:26px}.contact-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.contact-form-grid label{display:flex;flex-direction:column;gap:7px;font-weight:800;color:#17324a}.contact-form-grid label span{font-size:.8rem;font-weight:500;color:#738596}.contact-form-grid input,.contact-form-grid select,.contact-form-grid textarea{font:inherit;padding:12px;border:1px solid #cad8e2;border-radius:9px;background:#fff;color:#102a40}.contact-message-field{grid-column:1/-1}.contact-honeypot{position:absolute!important;left:-10000px!important;width:1px!important;height:1px!important;overflow:hidden!important}.contact-submit-row{display:flex;gap:16px;align-items:center;margin-top:18px}.contact-submit-status{margin:0;font-weight:700;color:#31556f}.contact-submit-row button:disabled{opacity:.7;cursor:wait}@media(max-width:800px){.contact-route-grid,.contact-form-grid{grid-template-columns:1fr}.contact-message-field{grid-column:auto}.contact-submit-row{align-items:stretch;flex-direction:column}}
`;

fs.appendFileSync(stylesFile, css);

const finalContact = fs.readFileSync(contactFile, 'utf8');
if (!finalContact.includes('contact@easttnchihuahuas.com')) throw new Error('Contact mailbox is missing from contact page');
if (!finalContact.includes('applications@easttnchihuahuas.com')) throw new Error('Applications mailbox is missing from contact page');
if (!finalContact.includes('support@easttnchihuahuas.com')) throw new Error('Support mailbox is missing from contact page');
if (!finalContact.includes('id="websiteContactForm"')) throw new Error('Website contact form was not created');
if (!fs.existsSync(scriptFile)) throw new Error('Contact submission script was not created');

console.log('Website email routing enabled for contact, applications, and support.');
