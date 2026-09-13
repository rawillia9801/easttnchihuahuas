import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');
const imageUrl = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Chihuahua.jpg';
const email = 'hello@easttnchihuahuas.com';

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
function htmlFiles() { return walk(root).filter((f) => f.endsWith('.html')); }
function ensureDir(file) { fs.mkdirSync(path.dirname(file), { recursive: true }); }
function write(file, text) { ensureDir(file); fs.writeFileSync(file, text); }
function esc(s='') { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function replaceMain(html, content) {
  return html.replace(/<main class="main-content">[\s\S]*?<\/main>/i, `<main class="main-content">${content}</main>`);
}
function title(html, value) {
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(value)} | East Tennessee Chihuahuas</title>`);
}
function description(html, value) {
  return html.replace(/<meta content="[^"]*" name="description"\/>/i, `<meta content="${esc(value)}" name="description"/>`);
}
function addAboutAndPricingToNav(html) {
  if (!html.includes('href="/about/"')) {
    html = html.replace(/(<a class="nav-link(?: active)?" href="[^\"]*our-program\/"[\s\S]*?<\/a>)/i, `$1<a class="nav-link" href="/about/"><span>About</span></a>`);
  }
  if (!html.includes('href="/pricing/"')) {
    html = html.replace(/(<a class="nav-link(?: active)?" href="[^\"]*application\/"[\s\S]*?<\/a>)/i, `$1<a class="nav-link" href="/pricing/"><span>Pricing &amp; Deposits</span></a>`);
  }
  return html;
}
function cleanCustomerCopy(html) {
  const blocks = [
    /<[^>]+>[^<]*(?:REAL CHIHUAHUA PHOTOGRAPH|BREED REFERENCE|Real-life Chihuahua photo|not represented as a dog owned by East Tennessee Chihuahuas|representative breed image|representative image|stock photo|placeholder|profile slot|pending publication|for launch)[\s\S]*?<\/[^>]+>/gi,
    /<div class="photo-overlay">[\s\S]*?<\/div>/gi,
    /<figcaption[\s\S]*?<\/figcaption>/gi
  ];
  for (const re of blocks) html = html.replace(re, '');
  return html;
}
function removeSince2009(html) {
  return html
    .replace(/Since 2009,?\s*/gi, '')
    .replace(/since 2009\b/gi, '')
    .replace(/\s{2,}/g, ' ');
}

if (!fs.existsSync(root)) throw new Error('public/ was not created by the base build');

for (const file of htmlFiles()) {
  let html = fs.readFileSync(file, 'utf8');
  html = cleanCustomerCopy(html);
  html = addAboutAndPricingToNav(html);
  if (!file.endsWith(path.join('about','index.html'))) html = removeSince2009(html);
  fs.writeFileSync(file, html);
}

const homeFile = path.join(root, 'index.html');
let home = fs.readFileSync(homeFile, 'utf8');
home = home.replace(/(<article class="hero-photo"[^>]*>)[\s\S]*?(<\/article>)/i, `$1<img alt="Chihuahua puppy" loading="eager" src="${imageUrl}"/>$2`);
home = replaceMain(home, `
<section class="page-header"><div><span class="page-eyebrow">JOHNSON CITY // EAST TENNESSEE</span><h1>Chihuahuas raised with care, matched with purpose.</h1><p>Family-raised Chihuahuas in Johnson City, Tennessee, with clear health, placement, contract, and go-home standards.</p></div></section>
<section class="hero-grid section-space">
  <article class="hero-card"><span class="hero-kicker">EAST TENNESSEE CHIHUAHUAS</span><h2>Small dogs. Serious care. A placement process built around the puppy.</h2><p>We focus on temperament, individual development, thoughtful family matching, and straightforward communication from first inquiry through go-home and beyond.</p><div class="hero-actions"><a class="button primary" href="/available-puppies/">VIEW AVAILABLE PUPPIES</a><a class="button ghost" href="/application/">APPLY FOR A PUPPY</a></div><div class="hero-checks"><span>✓ Application-first placements</span><span>✓ Individual go-home readiness</span><span>✓ Written agreements &amp; health terms</span></div></article>
  <article class="hero-photo"><img alt="Chihuahua puppy" loading="eager" src="${imageUrl}"/></article>
</section>
<section class="metric-grid section-space compact-top"><article><span>LOCATION</span><strong>Johnson City</strong><small>Serving the Tri-Cities and beyond</small></article><article><span>PLACEMENT</span><strong>Family Match</strong><small>Fit matters more than order</small></article><article><span>GO-HOME</span><strong>8+ Weeks</strong><small>Later when an individual puppy needs more time</small></article><article><span>SUPPORT</span><strong>Lifetime Return</strong><small>We remain a resource for our families</small></article></section>
<section class="section-space"><div class="section-heading"><span>AVAILABLE PUPPIES</span><h2>Current puppy listings</h2><p>Posted puppies appear here automatically from our breeder dashboard.</p></div><div id="homePuppies" class="puppy-grid"><article class="panel"><h3>Checking current availability…</h3></article></div><div class="hero-actions"><a class="button ghost" href="/available-puppies/">SEE ALL AVAILABLE PUPPIES</a></div></section>
<section class="content-grid three section-space"><article class="panel feature-panel"><span class="panel-kicker">HEALTH &amp; CARE</span><h3>Clear records and written expectations.</h3><p>Families receive puppy-specific care information, vaccination and deworming records, and the applicable written health guarantee.</p><a class="text-link" href="/health-care/">HEALTH &amp; CARE →</a></article><article class="panel feature-panel"><span class="panel-kicker">MATCHING</span><h3>The right home matters.</h3><p>Applications help us understand household, schedule, experience, other animals, and the type of Chihuahua a family hopes to welcome.</p><a class="text-link" href="/puppy-process/">OUR PROCESS →</a></article><article class="panel feature-panel"><span class="panel-kicker">TRANSPARENCY</span><h3>Read the documents before committing.</h3><p>Our deposit agreement, bill of sale, health guarantee, return policy, care terms, and transportation policy can be reviewed before placement.</p><a class="text-link" href="/policies/">POLICIES &amp; DOCUMENTS →</a></article></section>
<section class="journey section-space"><div class="section-heading"><span>FROM INQUIRY TO GO-HOME</span><h2>A simple, deliberate process.</h2></div><div class="journey-grid"><article><b>01</b><strong>Learn</strong><p>Review our program, care standards, pricing, policies, and current puppies.</p></article><article><b>02</b><strong>Apply</strong><p>Tell us about your home, schedule, experience, and preferences.</p></article><article><b>03</b><strong>Match</strong><p>We discuss fit, temperament, development, and timing.</p></article><article><b>04</b><strong>Reserve</strong><p>A written deposit agreement secures a specific puppy once approved.</p></article><article><b>05</b><strong>Go Home</strong><p>Transfer happens when the puppy is developmentally ready and required paperwork is complete.</p></article></div></section>
<section class="split-banner section-space"><div><span>MEET THE BREEDER</span><h2>Learn who is behind East Tennessee Chihuahuas.</h2><p>Our experience and breeding story belong in one place, without repeating the same biography across the website.</p></div><a class="button primary large" href="/about/">ABOUT US</a></section>
<script src="/assets/puppies.js" defer></script>`);
home = title(home, 'Chihuahua Puppies in Johnson City, TN');
home = description(home, 'East Tennessee Chihuahuas in Johnson City, Tennessee. View available Chihuahua puppies, our placement process, health and care standards, pricing, policies, and application.');
if (!home.includes('application/ld+json')) {
  home = home.replace('</head>', `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"LocalBusiness","name":"East Tennessee Chihuahuas","url":"https://easttnchihuahuas.com","email":email,"address":{"@type":"PostalAddress","addressLocality":"Johnson City","addressRegion":"TN","addressCountry":"US"},"areaServed":"Tri-Cities, Tennessee"})}</script></head>`);
}
fs.writeFileSync(homeFile, home);

const templateFile = fs.existsSync(path.join(root,'our-program','index.html')) ? path.join(root,'our-program','index.html') : homeFile;
const shell = fs.readFileSync(templateFile, 'utf8');
let about = addAboutAndPricingToNav(shell);
about = title(about, 'About');
about = description(about, 'Meet the breeder behind East Tennessee Chihuahuas and learn about a Chihuahua breeding experience that began in 2009.');
about = about.replace(/data-page="[^"]*"/, 'data-page="/about/"');
about = replaceMain(about, `<section class="page-header"><div><span class="page-eyebrow">ABOUT // EAST TENNESSEE CHIHUAHUAS</span><h1>Experience, care, and a love for Chihuahuas.</h1><p>East Tennessee Chihuahuas is based in Johnson City, Tennessee.</p></div></section><section class="content-grid two section-space"><article class="panel"><span class="panel-kicker">OUR STORY</span><h2>Breeding Chihuahuas since 2009.</h2><p>Our experience with Chihuahuas began in 2009. Over the years, that experience has shaped a hands-on approach centered on temperament, careful daily care, honest communication, and matching each puppy with a home prepared for their individual needs.</p><p>We believe buyers should be able to understand the process before making a commitment. That is why our application, pricing approach, deposit terms, health guarantee, care expectations, transportation policies, and return policy are available for families to review.</p></article><article class="panel"><span class="panel-kicker">HOW WE RAISE</span><h2>Home-raised and individually observed.</h2><p>Chihuahuas are small dogs with very individual personalities and developmental timelines. Puppies are observed for confidence, appetite, growth, interaction, and readiness rather than being moved simply because a date has arrived.</p><p>Very small puppies may remain with us longer and may require additional screening to make sure a prospective home can safely meet their feeding, supervision, and veterinary-care needs.</p></article></section><section class="content-grid three section-space"><article class="panel"><h3>Temperament</h3><p>We value confident, affectionate companion temperaments and thoughtful social development.</p></article><article class="panel"><h3>Transparency</h3><p>Families can review core agreements and policies before placing a deposit.</p></article><article class="panel"><h3>Long-term responsibility</h3><p>Our lifetime return policy means a dog we placed should always have a path back to us if circumstances change.</p></article></section><section class="split-banner section-space"><div><span>NEXT STEP</span><h2>Looking for a Chihuahua?</h2><p>Review current availability, then submit an application so we can learn about your home and preferences.</p></div><a class="button primary large" href="/application/">START APPLICATION</a></section>`);
write(path.join(root,'about','index.html'), about);

let pricing = addAboutAndPricingToNav(shell);
pricing = title(pricing, 'Pricing & Deposits');
pricing = description(pricing, 'Chihuahua puppy pricing, deposit terms, what is included, and payment expectations at East Tennessee Chihuahuas.');
pricing = pricing.replace(/data-page="[^"]*"/, 'data-page="/pricing/"');
pricing = replaceMain(pricing, `<section class="page-header"><div><span class="page-eyebrow">PRICING // RESERVATIONS</span><h1>Pricing &amp; Deposits</h1><p>Clear expectations before a family reserves a puppy.</p></div></section><section class="content-grid two section-space"><article class="panel"><span class="panel-kicker">PUPPY PRICING</span><h2>$2,500–$5,000</h2><p>Pricing can vary by registration, sex, coat, and the individual puppy. The exact price for an available puppy is shown on that puppy’s listing and confirmed in writing before a deposit is accepted.</p><h3>Typically included</h3><ul><li>Age-appropriate vaccinations and deworming records</li><li>Puppy-specific care information</li><li>Applicable registration information</li><li>Written bill of sale and health terms</li><li>Ongoing breeder support</li></ul></article><article class="panel"><span class="panel-kicker">RESERVATION DEPOSIT</span><h2>50% to reserve a specific puppy</h2><p>After approval and puppy selection, a 50% non-refundable deposit secures the specific puppy and removes that puppy from public availability. The remaining balance is due before pickup or delivery unless separate written payment terms are approved.</p><p>If we cannot complete placement because of the puppy’s health, readiness, or suitability, the written Deposit Agreement controls whether funds are transferred or refunded.</p><a class="text-link" href="/deposit-agreement/">READ DEPOSIT AGREEMENT →</a></article></section><section class="panel section-space"><span class="panel-kicker">IMPORTANT</span><h2>Deposits are accepted only after approval.</h2><p>Submitting an application does not reserve a puppy. A puppy is reserved only after the required steps are complete, the applicable agreement has been accepted, and the deposit has cleared.</p></section>`);
write(path.join(root,'pricing','index.html'), pricing);

let avail = addAboutAndPricingToNav(shell);
avail = title(avail, 'Available Chihuahua Puppies');
avail = description(avail, 'View Chihuahua puppies currently posted as available from East Tennessee Chihuahuas in Johnson City, Tennessee.');
avail = avail.replace(/data-page="[^"]*"/, 'data-page="/available-puppies/"');
avail = replaceMain(avail, `<section class="page-header"><div><span class="page-eyebrow">CURRENT AVAILABILITY</span><h1>Available Puppies</h1><p>Current puppy listings are updated from our breeder dashboard. Each listing shows the information we are ready to share publicly.</p></div></section><section class="section-space"><div id="puppyBoard" class="puppy-grid"><article class="panel"><h3>Checking current availability…</h3></article></div></section><section class="split-banner section-space"><div><span>INTERESTED IN A PUPPY?</span><h2>Applications come before reservations.</h2><p>Tell us about your household and the type of Chihuahua you are looking for.</p></div><a class="button primary large" href="/application/">START APPLICATION</a></section><script src="/assets/puppies.js" defer></script>`);
write(path.join(root,'available-puppies','index.html'), avail);

let dogs = addAboutAndPricingToNav(shell);
dogs = title(dogs, 'Our Dogs');
dogs = description(dogs, 'Learn how East Tennessee Chihuahuas evaluates adult dogs, plans pairings, and documents health, temperament, and registration information.');
dogs = dogs.replace(/data-page="[^"]*"/, 'data-page="/our-dogs/"');
dogs = replaceMain(dogs, `<section class="page-header"><div><span class="page-eyebrow">OUR CHIHUAHUAS</span><h1>The dogs behind our program.</h1><p>Our adult Chihuahuas are family dogs first. Health, temperament, structure, pedigree, and the needs of each individual dog guide our breeding decisions.</p></div></section><section class="content-grid two section-space"><article class="panel"><span class="panel-kicker">TEMPERAMENT</span><h2>Companion temperament matters.</h2><p>We value affectionate, confident Chihuahuas that can live comfortably as household companions. We pay attention to sociability, resilience, handling tolerance, energy level, and how each adult functions in normal daily life.</p></article><article class="panel"><span class="panel-kicker">HEALTH &amp; RECORDS</span><h2>Specific records over broad claims.</h2><p>Registration and health information is documented dog by dog. Puppy paperwork identifies the sire and dam when applicable, and planned-litter information is tied to the actual pairing rather than generic promises.</p></article></section><section class="content-grid three section-space"><article class="panel"><h3>Pairing decisions</h3><p>Pairings are planned around complementary temperament, structure, health information, pedigree, and the traits we want to preserve.</p></article><article class="panel"><h3>Home life</h3><p>Our breeding dogs live as dogs—not as inventory. Daily handling and household life give us information that a pedigree alone cannot provide.</p></article><article class="panel"><h3>Puppy evaluation</h3><p>We watch how each litter develops before making placement recommendations. Puppies from the same parents can still have very different personalities and needs.</p></article></section><section class="split-banner section-space"><div><span>PLANNED PAIRINGS</span><h2>Looking for information about a specific litter?</h2><p>Upcoming-litter announcements are the place to find pairing-specific information when a litter is ready to be announced.</p></div><a class="button primary large" href="/upcoming-litters/">UPCOMING LITTERS</a></section>`);
write(path.join(root,'our-dogs','index.html'), dogs);

let past = addAboutAndPricingToNav(shell);
past = title(past, 'Past Puppies');
past = description(past, 'Learn about the family experience after placement and how East Tennessee Chihuahuas supports puppy families after go-home.');
past = past.replace(/data-page="[^"]*"/, 'data-page="/past-puppies/"');
past = replaceMain(past, `<section class="page-header"><div><span class="page-eyebrow">PAST PUPPIES // FAMILY JOURNEYS</span><h1>Past Puppies</h1><p>Placement is the beginning of the relationship, not the end.</p></div></section><section class="content-grid two section-space"><article class="panel"><span class="panel-kicker">AFTER GO-HOME</span><h2>Support continues after pickup.</h2><p>Families leave with care information and puppy-specific records, and we remain available for questions about feeding, adjustment, routines, and the transition into a new home.</p></article><article class="panel"><span class="panel-kicker">FAMILY UPDATES</span><h2>We love seeing our puppies grow.</h2><p>When families choose to share updates, those photos and milestones help us follow development and celebrate the dogs our puppies become. Family photos are shared publicly only with permission.</p></article></section><section class="content-grid three section-space"><article class="panel"><h3>Transition support</h3><p>Small puppies can need careful feeding, rest, temperature management, and a gradual introduction to a new environment.</p></article><article class="panel"><h3>Veterinary care</h3><p>New families are expected to establish prompt veterinary care and follow the written health and care requirements provided with their puppy.</p></article><article class="panel"><h3>Lifetime return policy</h3><p>If a family can no longer keep a dog we placed, we want to be contacted before the dog is sold, surrendered, gifted, or rehomed.</p><a class="text-link" href="/lifetime-return/">READ RETURN POLICY →</a></article></section>`);
write(path.join(root,'past-puppies','index.html'), past);

let upcoming = addAboutAndPricingToNav(shell);
upcoming = title(upcoming, 'Upcoming Litters');
upcoming = description(upcoming, 'Planned Chihuahua litters and future puppy placement information from East Tennessee Chihuahuas in Johnson City, Tennessee.');
upcoming = upcoming.replace(/data-page="[^"]*"/, 'data-page="/upcoming-litters/"');
upcoming = replaceMain(upcoming, `<section class="page-header"><div><span class="page-eyebrow">PLANNED LITTERS</span><h1>Upcoming Litters</h1><p>We announce a planned or confirmed litter only when there is useful, pairing-specific information to share.</p></div></section><section class="content-grid two section-space"><article class="panel"><span class="panel-kicker">HOW ANNOUNCEMENTS WORK</span><h2>Pairing first, promises second.</h2><p>Planned-litter information may include the sire and dam, expected timing, registration information, coat or color possibilities, and placement notes. Dates and litter size are never guaranteed before puppies are born.</p></article><article class="panel"><span class="panel-kicker">FUTURE FAMILIES</span><h2>Application-first consideration.</h2><p>If there is not a current litter announcement, families may still submit an application. Approval does not guarantee a puppy, but it gives us the information needed to discuss future fit when availability changes.</p><a class="text-link" href="/application/">START APPLICATION →</a></article></section><section class="panel section-space"><h2>What we do not promise</h2><p>Pregnancy, litter size, sex distribution, color, coat, exact adult weight, and exact go-home date can all change. We provide updates as facts become known rather than advertising uncertain outcomes as guarantees.</p></section>`);
write(path.join(root,'upcoming-litters','index.html'), upcoming);

const puppyJs = `
const target=document.getElementById('puppyBoard')||document.getElementById('homePuppies');
const money=n=>n?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n):'';
const safe=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function loadPuppies(){if(!target)return;try{const r=await fetch('/api/puppies?status=available',{headers:{Accept:'application/json'}});if(!r.ok)throw new Error('not configured');const data=await r.json();const puppies=Array.isArray(data)?data:data.puppies||[];if(!puppies.length){target.innerHTML='<article class="panel puppy-empty"><h3>No puppies are currently posted as available.</h3><p>You are welcome to review upcoming litters or submit an application for future consideration.</p><a class="text-link" href="/application/">START AN APPLICATION →</a></article>';return;}target.innerHTML=puppies.slice(0,target.id==='homePuppies'?3:99).map(p=>'<article class="panel puppy-card">'+(p.image_url?'<img loading="lazy" src="'+safe(p.image_url)+'" alt="'+safe(p.name||'Chihuahua puppy')+'">':'')+'<div class="puppy-card-body"><span class="panel-kicker">'+safe(p.status||'Available')+'</span><h3>'+safe(p.name||'Chihuahua Puppy')+'</h3><p class="puppy-meta">'+[p.sex,p.coat,p.color,p.registry].filter(Boolean).map(safe).join(' • ')+'</p>'+(p.description?'<p>'+safe(p.description)+'</p>':'')+'<div class="puppy-card-footer">'+(p.price?'<strong>'+money(p.price)+'</strong>':'')+(p.ready_date?'<span>Ready around '+safe(p.ready_date)+'</span>':'')+'</div></div></article>').join('');}catch(e){target.innerHTML='<article class="panel puppy-empty"><h3>No puppies are currently posted as available.</h3><p>Please check upcoming litters or submit an application if you would like to be considered for a future puppy.</p><a class="text-link" href="/upcoming-litters/">VIEW UPCOMING LITTERS →</a></article>';}}
loadPuppies();`;
write(path.join(root,'assets','puppies.js'), puppyJs);

const adminHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Breeder Admin | East Tennessee Chihuahuas</title><link rel="stylesheet" href="/assets/styles.css"></head><body class="admin-body"><main class="admin-wrap"><section class="admin-head"><div><span class="page-eyebrow">PRIVATE BREEDER AREA</span><h1>Puppy Admin</h1><p>Add, edit, publish, reserve, or remove puppy listings.</p></div><a class="button ghost" href="/">VIEW WEBSITE</a></section><section class="panel admin-login" id="loginPanel"><h2>Admin access</h2><label>Admin token<input id="token" type="password" autocomplete="current-password" placeholder="Enter admin token"></label><button class="button primary" id="loginBtn">UNLOCK ADMIN</button><p id="loginMsg" class="admin-msg"></p></section><section id="adminApp" hidden><div class="admin-grid"><form class="panel admin-form" id="puppyForm"><input type="hidden" id="id"><h2 id="formTitle">Add puppy</h2><div class="form-grid"><label>Name<input id="name" required></label><label>Status<select id="status"><option value="available">Available</option><option value="reserved">Reserved</option><option value="pending">Pending</option><option value="placed">Placed</option><option value="hidden">Hidden</option></select></label><label>Sex<select id="sex"><option value="">Select</option><option>Male</option><option>Female</option></select></label><label>Birth date<input id="birth_date" type="date"></label><label>Price<input id="price" type="number" min="0" step="1"></label><label>Ready date<input id="ready_date" type="date"></label><label>Registry<input id="registry" placeholder="AKC, CKC, ACA…"></label><label>Coat<input id="coat" placeholder="Long coat / smooth coat"></label><label>Color<input id="color"></label><label>Size/placement<input id="size_category" placeholder="Standard / Toy / Micro-Toy"></label><label>Sire<input id="sire"></label><label>Dam<input id="dam"></label></div><label>Public description<textarea id="description" rows="5"></textarea></label><label>Puppy photo<input id="photo" type="file" accept="image/jpeg,image/png,image/webp"></label><label>Existing image URL<input id="image_url" type="url"></label><div class="hero-actions"><button class="button primary" type="submit">SAVE PUPPY</button><button class="button ghost" type="button" id="resetBtn">CLEAR</button></div><p id="formMsg" class="admin-msg"></p></form><section class="panel"><div class="admin-list-head"><h2>Puppies</h2><button class="button ghost" id="refreshBtn">REFRESH</button></div><div id="adminList"><p>Unlock admin to load puppies.</p></div></section></div></section></main><script src="/assets/admin.js"></script></body></html>`;
write(path.join(root,'admin','index.html'), adminHtml);

const adminJs = `
let adminToken=sessionStorage.getItem('etc_admin_token')||'';const $=id=>document.getElementById(id);const fields=['id','name','status','sex','birth_date','price','ready_date','registry','coat','color','size_category','sire','dam','description','image_url'];
function headers(extra={}){return {'Content-Type':'application/json','Authorization':'Bearer '+adminToken,...extra}}
function msg(el,text,bad=false){el.textContent=text;el.classList.toggle('bad',bad)}
async function api(url,opt={}){const r=await fetch(url,opt);let data={};try{data=await r.json()}catch{}if(!r.ok)throw new Error(data.error||data.message||'Request failed');return data}
function unlock(){adminToken=$('token').value.trim();if(!adminToken)return msg($('loginMsg'),'Enter the admin token.',true);sessionStorage.setItem('etc_admin_token',adminToken);load().then(()=>{$('loginPanel').hidden=true;$('adminApp').hidden=false}).catch(e=>msg($('loginMsg'),e.message,true))}
async function load(){const data=await api('/api/puppies?admin=1',{headers:headers({'Content-Type':'application/json'})});const list=Array.isArray(data)?data:data.puppies||[];$('adminList').innerHTML=list.length?list.map(p=>'<article class="admin-row"><div>'+(p.image_url?'<img src="'+p.image_url+'" alt="">':'')+'</div><div><strong>'+p.name+'</strong><span>'+[p.status,p.sex,p.color].filter(Boolean).join(' • ')+'</span></div><div><button data-edit="'+p.id+'">Edit</button><button data-delete="'+p.id+'">Delete</button></div></article>').join(''):'<p>No puppy records yet.</p>';$('adminList').querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>edit(list.find(p=>p.id===b.dataset.edit)));$('adminList').querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>remove(b.dataset.delete));}
function edit(p){for(const f of fields)if($(f))$(f).value=p[f]??'';$('formTitle').textContent='Edit '+p.name;window.scrollTo({top:0,behavior:'smooth'})}
function reset(){for(const f of fields)if($(f))$(f).value='';$('status').value='available';$('formTitle').textContent='Add puppy';$('photo').value=''}
async function upload(){const file=$('photo').files[0];if(!file)return $('image_url').value.trim();const base64=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=reject;reader.readAsDataURL(file)});const out=await api('/api/upload',{method:'POST',headers:headers(),body:JSON.stringify({filename:file.name,type:file.type,data:base64})});return out.url}
async function save(e){e.preventDefault();try{msg($('formMsg'),'Saving…');const image_url=await upload();const payload={};for(const f of fields){if(f==='id'||f==='image_url')continue;payload[f]=$(f).value||null}payload.price=payload.price?Number(payload.price):null;payload.image_url=image_url||null;const id=$('id').value;await api('/api/puppies'+(id?'?id='+encodeURIComponent(id):''),{method:id?'PUT':'POST',headers:headers(),body:JSON.stringify(payload)});msg($('formMsg'),'Saved. The public website will reflect the update immediately.');reset();await load()}catch(e){msg($('formMsg'),e.message,true)}}
async function remove(id){if(!confirm('Delete this puppy record?'))return;try{await api('/api/puppies?id='+encodeURIComponent(id),{method:'DELETE',headers:headers()});await load()}catch(e){alert(e.message)}}
$('loginBtn').onclick=unlock;$('puppyForm').onsubmit=save;$('resetBtn').onclick=reset;$('refreshBtn').onclick=load;if(adminToken){$('token').value=adminToken;unlock()}`;
write(path.join(root,'assets','admin.js'), adminJs);

const cssFile = path.join(root,'assets','styles.css');
if (fs.existsSync(cssFile)) {
  fs.appendFileSync(cssFile, `\n/* ETC public/admin additions */\n.hero-photo{overflow:hidden}.hero-photo img{width:100%;height:100%;min-height:440px;object-fit:cover;display:block}.puppy-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.puppy-card{padding:0;overflow:hidden}.puppy-card img{width:100%;height:280px;object-fit:cover;display:block}.puppy-card-body{padding:22px}.puppy-meta{color:var(--muted,#65778a)}.puppy-card-footer{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-top:20px}.puppy-empty{grid-column:1/-1}.admin-body{background:#eef3f7;color:#0b2946}.admin-wrap{max-width:1400px;margin:0 auto;padding:40px 24px}.admin-head,.admin-list-head{display:flex;justify-content:space-between;gap:20px;align-items:center;margin-bottom:24px}.admin-grid{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(420px,.9fr);gap:24px}.admin-form label,.admin-login label{display:grid;gap:7px;font-weight:700;margin-bottom:14px}.admin-form input,.admin-form select,.admin-form textarea,.admin-login input{width:100%;box-sizing:border-box;border:1px solid #cbd8e3;border-radius:8px;padding:12px;background:white;color:#0b2946;font:inherit}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 14px}.admin-row{display:grid;grid-template-columns:70px 1fr auto;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid #dce6ee}.admin-row img{width:64px;height:64px;object-fit:cover;border-radius:10px}.admin-row span{display:block;color:#63758a;margin-top:4px}.admin-row button{margin-left:7px}.admin-msg{min-height:1.2em;color:#117a56}.admin-msg.bad{color:#a22}.nav-link[href=\"/about/\"],.nav-link[href=\"/pricing/\"]{min-height:38px}@media(max-width:900px){.puppy-grid,.admin-grid{grid-template-columns:1fr}.form-grid{grid-template-columns:1fr}}\n`);
}

const sitemapRoutes = ['','available-puppies','upcoming-litters','puppy-process','application','pricing','our-dogs','about','our-program','health-care','past-puppies','transportation','faq','contact','policies','deposit-agreement','bill-of-sale','health-guarantee','financing-addendum','lifetime-return','transportation-policy','buyer-care-agreement','small-puppy-policy','breeding-rights-policy','terms','privacy'];
write(path.join(root,'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapRoutes.map(r=>`<url><loc>https://easttnchihuahuas.com/${r?`${r}/`:''}</loc></url>`).join('')}</urlset>`);
write(path.join(root,'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://easttnchihuahuas.com/sitemap.xml\n`);

const banned = [/Southwest Virginia Chihuahua/i,/swvachihuahua/i,/Marion,? Virginia/i,/real-life chihuahua photo/i,/not represented as a dog owned/i,/breed reference/i,/placeholder/i,/pending publication/i,/profile slot/i,/seller use only/i];
for (const file of htmlFiles()) {
  if (file.endsWith(path.join('admin','index.html'))) continue;
  const html = fs.readFileSync(file,'utf8');
  const text = html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ');
  for (const re of banned) if (re.test(text)) throw new Error(`Customer-facing QA failed: ${re} in ${path.relative(root,file)}`);
  if (!file.endsWith(path.join('about','index.html')) && /since 2009/i.test(text)) throw new Error(`"Since 2009" must live only on About: ${path.relative(root,file)}`);
}

const existing = new Set(walk(root).map(f=>path.relative(root,f).split(path.sep).join('/')));
const broken = [];
for (const file of htmlFiles()) {
  const html = fs.readFileSync(file,'utf8');
  const relDir = path.dirname(path.relative(root,file)).split(path.sep).join('/');
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href=m[1];
    if (/^(?:https?:|mailto:|tel:|#|javascript:)/i.test(href)) continue;
    const noQuery=href.split(/[?#]/)[0];
    let target;
    if (noQuery.startsWith('/')) target=noQuery.slice(1); else target=path.posix.normalize(path.posix.join(relDir==='.'?'':relDir,noQuery));
    if (!target || target==='.' || target==='./') target='index.html';
    if (target.endsWith('/')) target+='index.html';
    else if (!path.posix.extname(target)) target=path.posix.join(target,'index.html');
    if (!existing.has(target)) broken.push(`${path.relative(root,file)} -> ${href}`);
  }
}
if (broken.length) throw new Error(`Broken internal links:\n${broken.join('\n')}`);
console.log(`Post-build QA passed: ${htmlFiles().length} HTML pages; 0 broken internal links.`);
