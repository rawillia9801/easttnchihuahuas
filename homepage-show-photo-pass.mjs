import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');
const source = path.resolve('assets/Cheralynnn.png');
const destination = path.join(root, 'assets', 'Cheralynnn.png');
const homeFile = path.join(root, 'index.html');

if (!fs.existsSync(source)) throw new Error('Cheralyn homepage photo asset is missing');
if (!fs.existsSync(homeFile)) throw new Error('Homepage output is missing');

fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.copyFileSync(source, destination);

let html = fs.readFileSync(homeFile, 'utf8');
const heroPattern = /(<article class="hero-photo literal-photo">\s*<img\s+)([^>]*)(>\s*<\/article>)/i;
if (!heroPattern.test(html)) throw new Error('Homepage hero photo block was not found');

html = html.replace(heroPattern, (_, open, attrs, close) => {
  let next = attrs
    .replace(/\s*src="[^"]*"/i, '')
    .replace(/\s*alt="[^"]*"/i, '')
    .replace(/\s*loading="[^"]*"/i, '');
  return `${open}${next} src="/assets/Cheralynnn.png" alt="Cheralyn Smith, East Tennessee Chihuahuas breeder" loading="eager"${close}`;
});

fs.writeFileSync(homeFile, html);
fs.appendFileSync(path.join(root, 'assets', 'styles.css'), `\n/* Homepage breeder photo */\n.home-hero .hero-photo img{width:100%;height:100%;object-fit:cover;object-position:center 28%}\n`);

const verified = fs.readFileSync(homeFile, 'utf8');
if (!verified.includes('src="/assets/Cheralynnn.png"')) throw new Error('Cheralyn homepage photo was not applied');
if (!verified.includes('alt="Cheralyn Smith, East Tennessee Chihuahuas breeder"')) throw new Error('Cheralyn homepage photo alt text is missing');

console.log('Cheralyn homepage photo applied.');
