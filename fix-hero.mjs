import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('public/index.html');
const healthyPuppy = 'https://images.unsplash.com/photo-1757002281010-7453072922e5?auto=format&fit=crop&fm=jpg&q=88&w=1800';

let html = fs.readFileSync(file, 'utf8');

html = html.replace(
  /(<article class="hero-photo"[^>]*>)[\s\S]*?(<\/article>)/i,
  `$1<img alt="Chihuahua puppy" loading="eager" src="${healthyPuppy}" style="object-fit:cover;object-position:center 42%;width:100%;height:100%;"/>$2`
);

// Do not show image-source, stock-photo, development, or explanatory copy to customers.
html = html
  .replace(/<div class="photo-overlay">[\s\S]*?<\/div>/gi, '')
  .replace(/<figcaption[\s\S]*?<\/figcaption>/gi, '')
  .replace(/<[^>]+>[^<]*(?:photographed by|Unsplash|stock photo|breed reference|representative image|real Chihuahua photograph)[\s\S]*?<\/[^>]+>/gi, '');

fs.writeFileSync(file, html);

if (!html.includes('photo-1757002281010-7453072922e5')) {
  throw new Error('Healthy Chihuahua puppy hero image was not applied');
}
