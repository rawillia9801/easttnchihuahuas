import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('public');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)])}
const files=walk(root);const htmlFiles=files.filter(f=>f.endsWith('.html'));const existing=new Set(files.map(f=>path.relative(root,f).split(path.sep).join('/')));const broken=[];const banned=[/breeder dashboard/i,/checking current availability/i,/if the board is empty/i,/real-life chihuahua photo/i,/stock photo/i,/seller use only/i,/50% to reserve/i,/our experience and breeding story belong in one place/i];
for(const file of htmlFiles){const html=fs.readFileSync(file,'utf8');if(!file.endsWith(path.join('admin','index.html'))){const text=html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ');for(const re of banned)if(re.test(text))throw new Error(`Customer copy QA failed: ${re} in ${path.relative(root,file)}`);if(!file.endsWith(path.join('about','index.html'))&&/since 2009/i.test(text))throw new Error(`Since 2009 must appear only on About: ${path.relative(root,file)}`)}const relDir=path.dirname(path.relative(root,file)).split(path.sep).join('/');for(const m of html.matchAll(/href="([^"]+)"/g)){const href=m[1];if(/^(?:https?:|mailto:|tel:|#|javascript:)/i.test(href))continue;const clean=href.split(/[?#]/)[0];let target;if(clean.startsWith('/'))target=clean.slice(1);else target=path.posix.normalize(path.posix.join(relDir==='.'?'':relDir,clean));if(!target||target==='.'||target==='./')target='index.html';if(target.endsWith('/'))target+='index.html';else if(!path.posix.extname(target))target=path.posix.join(target,'index.html');if(!existing.has(target))broken.push(`${path.relative(root,file)} -> ${href}`)}}
if(broken.length)throw new Error(`Broken internal links after final pass:\n${broken.join('\n')}`);
if(!fs.existsSync(path.join(root,'assets','home-puppy.webp')))throw new Error('Original Chihuahua image did not reach public assets');
if(!fs.existsSync(path.join(root,'assets','Cheralynnn.png')))throw new Error('Cheralyn homepage photo did not reach public assets');
if(!fs.existsSync(path.join(root,'assets','Cherlyn4444.jpg')))throw new Error('Cherlyn4444.jpg did not reach public assets');
if(!fs.existsSync(path.join(root,'application-thank-you','index.html')))throw new Error('Application thank-you page is missing');
if(!fs.existsSync(path.join(root,'email-templates','approved-applicant.txt')))throw new Error('Approved-applicant email template is missing');
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
if(!/src="\/assets\/Cheralynnn\.png"/i.test(home))throw new Error('Homepage is not using the Cheralyn photo');
const about=fs.readFileSync(path.join(root,'about','index.html'),'utf8');
if(!/src="\/assets\/Cherlyn4444\.jpg"/i.test(about))throw new Error('About page is not using Cherlyn4444.jpg');
const wizard=fs.readFileSync(path.join(root,'assets','application-wizard.js'),'utf8');
if(!/application-thank-you/i.test(wizard))throw new Error('Application success redirect is missing');
const formSubmit=fs.readFileSync(path.join(root,'assets','form-submit.js'),'utf8');
if(!formSubmit.includes('/api/submit-form'))throw new Error('Application form API integration is missing');
if(!formSubmit.includes("type:'application'"))throw new Error('Application direct submission integration is missing');
const application=fs.readFileSync(path.join(root,'application','index.html'),'utf8');
if(!application.includes('/assets/form-submit.js'))throw new Error('Application submission script is missing');
const pricing=fs.readFileSync(path.join(root,'pricing','index.html'),'utf8');
if(!/\$250[^<]{0,20}\$500|\$250–\$500/i.test(pricing))throw new Error('Pricing page does not show the approved $250–$500 deposit range');
const submissionDocs=['deposit-agreement','bill-of-sale','health-guarantee','financing-addendum','lifetime-return','transportation-policy','buyer-care-agreement','small-puppy-policy','breeding-rights-policy'];
for(const rel of submissionDocs){const html=fs.readFileSync(path.join(root,rel,'index.html'),'utf8');if(!html.includes(`data-form-type="${rel}"`))throw new Error(`Fillable document type missing: ${rel}`);if(!html.includes('name="customerEmail"'))throw new Error(`Required customer email field missing: ${rel}`);if(!html.includes('name="typedSignature"'))throw new Error(`Required signature field missing: ${rel}`);if(!html.includes('/assets/fillable-documents.js'))throw new Error(`Fillable document script missing: ${rel}`);if(html.includes('class="document-email-submit'))throw new Error(`Legacy bottom document form remains: ${rel}`)}
const api=fs.readFileSync(path.resolve('api','submit-form.js'),'utf8');
if(/resend\.com|RESEND_API_KEY/i.test(api))throw new Error('Resend dependency remains in website form handler');
if(!api.includes("require('./_mail')"))throw new Error('Hostinger SMTP mail transport is not wired into form handler');
console.log(`Final QA passed: ${htmlFiles.length} HTML pages; 0 broken internal links; both breeder photos, application flow, Hostinger mail routing, and integrated fillable documents verified.`);
