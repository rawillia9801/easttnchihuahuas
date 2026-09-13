import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');
const homeFile = path.join(root,'index.html');
let home = fs.readFileSync(homeFile,'utf8');
home = home.replace(/If the board is empty, our next steps are still easy to find\./gi,'If we do not have active listings, our next steps are still easy to find.');
home = home.replace(/alt="Long-coat black, tan and white Chihuahua puppy from East Tennessee Chihuahuas"/gi,'alt="Long-coat black, tan and white Chihuahua puppy in Johnson City, Tennessee"');
fs.writeFileSync(homeFile,home);

const appFile = path.join(root,'application','index.html');
let shell = fs.readFileSync(appFile,'utf8');
const thankMain = `
<main class="main-content">
<section class="page-header"><div><span class="page-eyebrow">APPLICATION RECEIVED</span><h1>Thank you for introducing your family.</h1><p>We appreciate the time it takes to complete a thorough application. Your answers help us understand your household and whether one of our Chihuahuas may be a good fit.</p></div></section>
<section class="content-grid two section-space"><article class="panel"><span class="panel-kicker">WHAT HAPPENS NEXT</span><h2>We review the whole application.</h2><p>We look at your household, daily routine, veterinary plan, other animals, puppy preferences, and any special care needs. If we need clarification, we will contact you using the information you provided.</p><p>Submitting an application does not reserve a puppy and does not require you to purchase one.</p></article><article class="panel"><span class="panel-kicker">WHILE YOU WAIT</span><h2>Review the documents that govern placement.</h2><p>We make the core agreements available in advance so you have time to read them before a reservation decision.</p><div class="document-links"><a href="/deposit-agreement/">Deposit Agreement</a><a href="/bill-of-sale/">Bill of Sale</a><a href="/health-guarantee/">Health Guarantee</a><a href="/small-puppy-policy/">Small Puppy Safety</a><a href="/policies/">All Policies</a></div></article></section>
<section class="split-banner section-space"><div><span>KEEP EXPLORING</span><h2>See current puppies or future litter plans.</h2><p>If there is no active puppy listing today, the upcoming-litters page explains how future placement works.</p></div><div class="hero-actions"><a class="button ghost" href="/available-puppies/">AVAILABLE PUPPIES</a><a class="button primary" href="/upcoming-litters/">UPCOMING LITTERS</a></div></section>
</main>`;
const thanksDir = path.join(root,'application-thank-you');
fs.mkdirSync(thanksDir,{recursive:true});
let thanks = shell.replace(/<main class="main-content">[\s\S]*?<\/main>/i, thankMain.replace(/^<main class="main-content">|<\/main>$/g,''));
thanks = thanks.replace(/<title>[\s\S]*?<\/title>/i,'<title>Application Received | East Tennessee Chihuahuas</title>');
thanks = thanks.replace(/<meta[^>]+name="description"[^>]*>/i,'<meta content="Thank you for applying to East Tennessee Chihuahuas. Review next steps, placement documents, health terms, and upcoming litter information." name="description"/>');
thanks = thanks.replace(/class="nav-link active"/g,'class="nav-link"');
fs.writeFileSync(path.join(thanksDir,'index.html'),thanks);

const wizardFile = path.join(root,'assets','application-wizard.js');
if (fs.existsSync(wizardFile)) {
  let js = fs.readFileSync(wizardFile,'utf8');
  js += `\n(()=>{const form=document.getElementById('puppyApplicationForm');if(!form)return;form.addEventListener('submit',()=>{try{sessionStorage.setItem('etc_application_submitted','1')}catch{}setTimeout(()=>{if(location.pathname.includes('/application'))location.href='/application-thank-you/'},1600)})})();\n`;
  fs.writeFileSync(wizardFile,js);
}

const templateDir = path.join(root,'email-templates');
fs.mkdirSync(templateDir,{recursive:true});
fs.writeFileSync(path.join(templateDir,'approved-applicant.txt'),`Subject: Your East Tennessee Chihuahuas application has been approved\n\nHi {{first_name}},\n\nThank you for taking the time to complete our puppy application. We have reviewed it and are happy to move you into our approved-family group for future placement consideration.\n\nApproval does not reserve a specific puppy. When we believe a puppy may be a good fit for your home, we will contact you to talk through temperament, development, timing, and any puppy-specific care needs before a reservation is offered.\n\nBefore that conversation, please review these two important references:\n\nHealth Guarantee: https://easttnchihuahuas.com/health-guarantee/\nSmall Puppy Safety Policy: https://easttnchihuahuas.com/small-puppy-policy/\n\nYou can also review all placement documents here:\nhttps://easttnchihuahuas.com/policies/\n\nThank you,\nCheralyn\nEast Tennessee Chihuahuas\nJohnson City, Tennessee\n`);

console.log('Final funnel polish applied.');
