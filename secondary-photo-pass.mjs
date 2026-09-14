import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve('public');
const source=path.resolve('assets/Cherlyn4444.jpg');
const destination=path.join(root,'assets','Cherlyn4444.jpg');
const aboutFile=path.join(root,'about','index.html');

if(!fs.existsSync(source))throw new Error('Cherlyn4444.jpg is missing from repository assets');
if(!fs.existsSync(aboutFile))throw new Error('About page output is missing');

fs.mkdirSync(path.dirname(destination),{recursive:true});
fs.copyFileSync(source,destination);

let html=fs.readFileSync(aboutFile,'utf8');
if(!html.includes('/assets/Cherlyn4444.jpg')){
  const feature=`<section class="about-secondary-photo section-space"><div class="about-secondary-photo-frame"><img src="/assets/Cherlyn4444.jpg" alt="East Tennessee Chihuahuas breeder photo" loading="lazy"></div><div class="about-secondary-photo-copy"><span class="panel-kicker">OUR CHIHUAHUA HOME</span><h2>Personal care is part of the program.</h2><p>Our dogs and puppies are part of everyday life here. That close involvement helps us learn their personalities, routines, confidence, and individual care needs before we make placement recommendations.</p><a class="text-link" href="/our-program/">LEARN ABOUT OUR PROGRAM →</a></div></section>`;
  const mainClose=html.indexOf('</main>');
  if(mainClose<0)throw new Error('About page main content is missing');
  html=html.slice(0,mainClose)+feature+html.slice(mainClose);
}
fs.writeFileSync(aboutFile,html);

fs.appendFileSync(path.join(root,'assets','styles.css'),`\n/* Secondary breeder photo */\n.about-secondary-photo{display:grid;grid-template-columns:minmax(280px,.9fr) 1.1fr;gap:28px;align-items:center;background:#fff;border:1px solid #d9e4ed;border-radius:18px;padding:18px}.about-secondary-photo-frame img{display:block;width:100%;height:430px;object-fit:cover;object-position:center;border-radius:14px}.about-secondary-photo-copy{padding:24px}.about-secondary-photo-copy p{color:#60758b;line-height:1.7}@media(max-width:800px){.about-secondary-photo{grid-template-columns:1fr}.about-secondary-photo-frame img{height:auto;max-height:560px}.about-secondary-photo-copy{padding:8px 6px 18px}}\n`);

const verified=fs.readFileSync(aboutFile,'utf8');
if(!verified.includes('src="/assets/Cherlyn4444.jpg"'))throw new Error('Second breeder photo was not added to About');
console.log('Cherlyn4444.jpg added to the About page.');
