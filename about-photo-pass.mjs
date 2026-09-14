import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');
const source = path.resolve('assets/Cherlyn4444.jpg');
const destination = path.join(root, 'assets', 'Cherlyn4444.jpg');
const aboutFile = path.join(root, 'about', 'index.html');

if (!fs.existsSync(source)) throw new Error('Cheralyn shoulder photo asset is missing');
if (!fs.existsSync(aboutFile)) throw new Error('About page output is missing');

fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.copyFileSync(source, destination);

let html = fs.readFileSync(aboutFile, 'utf8');

const marker = '<section class="content-grid two section-space">';
if (!html.includes(marker)) throw new Error('About page content grid was not found');

const photoCard = `<article class="panel breeder-photo-card"><img src="/assets/Cherlyn4444.jpg" alt="Cheralyn with a Chihuahua on her shoulder" loading="lazy"/><div class="breeder-photo-copy"><span class="panel-kicker">MEET CHERALYN</span><h2>Chihuahuas are part of everyday life here.</h2><p>Our program is hands-on and personal, with close attention to each dog's temperament, development, health, and comfort.</p></div></article>`;

if (!html.includes('/assets/Cherlyn4444.jpg')) {
  html = html.replace(marker, `${marker}${photoCard}`);
}

fs.writeFileSync(aboutFile, html);
fs.appendFileSync(path.join(root, 'assets', 'styles.css'), `\n/* About breeder photo */\n.breeder-photo-card{overflow:hidden;padding:0}.breeder-photo-card img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;object-position:center 30%}.breeder-photo-copy{padding:24px}.breeder-photo-copy h2{margin:.45rem 0 .7rem}\n`);

const verified = fs.readFileSync(aboutFile, 'utf8');
if (!verified.includes('src="/assets/Cherlyn4444.jpg"')) throw new Error('About page breeder photo was not applied');
if (!verified.includes('alt="Cheralyn with a Chihuahua on her shoulder"')) throw new Error('About page breeder photo alt text is missing');

console.log('About breeder photo applied.');
