import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');

const targetPages = [
  'index.html',
  'about/index.html',
  'our-program/index.html',
  'health-care/index.html',
  'available-puppies/index.html',
  'upcoming-litters/index.html',
  'puppy-process/index.html',
  'our-dogs/index.html',
  'past-puppies/index.html',
  'pricing/index.html',
  'pricing-deposits/index.html',
  'transportation/index.html',
  'faq/index.html',
  'contact/index.html',
  'application/index.html',
];

const replacements = [
  ['Fit matters more than order', 'We do not place puppies strictly by who asks first'],
  ['The right home matters.', 'We want each puppy to go to the right home.'],
  ['A clear program, not a sales pitch.', 'We want you to know what to expect from us.'],
  ['Application first, reservation second.', 'We start with an application so we can get to know you.'],
  ['Your path forward is simple.', 'If you are waiting for a puppy, here is what to do.'],
  ['Real dogs do not follow a production calendar.', 'Breeding and pregnancy do not always follow an exact schedule.'],
  ['WHY WE WAIT TO PROMISE', 'WHY DATES CAN CHANGE'],
  ['We intentionally avoid publishing made-up due dates, guaranteed litter sizes, or exact puppy traits before nature gives us those answers.', 'We do not post firm due dates, litter sizes, or puppy traits until we have information we can actually stand behind.'],
  ["The puppy's personality matters too.", "We also pay attention to the puppy's personality."],
  ['Puppies are individuals.', 'Every puppy develops at a different pace.'],
  ['Written information matters.', 'You will get the important details in writing.'],
  ['Written information matters in our program.', 'We put the important details in writing so you can review them before you decide.'],
  ['Companionship is the goal.', 'Most of our puppies are placed as family companions.'],
  ['A careful process that should still feel personal.', 'We want the process to feel straightforward and personal.'],
  ['The point is not to make families jump through hoops; it is to make better matches and put expectations in writing.', 'The application gives us a chance to learn about your home, answer questions, and make sure everyone knows what to expect.'],
  ['We get to know each puppy as an individual before we make placement recommendations.', 'We spend time with each puppy before suggesting which home may be the best fit.'],
  ['Temperament, development, household fit, and readiness matter more to us than who clicked first.', 'We look at personality, development, your household, and whether the puppy is ready to leave—not just who contacted us first.'],
  ['Healthy habits, stable temperaments, and honest expectations.', 'We pay close attention to health, temperament, and how each puppy is developing.'],
  ['We do not promise an exact adult weight or rush a puppy home because a date arrived.', 'We cannot promise an exact adult weight, and we will keep a puppy longer if they need more time before going home.'],
  ['Small dogs. Serious care. A placement process built around the puppy.', 'Chihuahuas raised at home with hands-on care.'],
  ['A placement process built around the puppy.', 'A puppy process built around real life and individual needs.'],
  ['Five clear steps from hello to go-home.', 'Here is how our puppy process works.'],
  ['THOUGHTFUL MATCHING', 'FINDING THE RIGHT FIT'],
  ['Thoughtful Matching', 'Finding the Right Fit'],
  ['We share specifics when there is something real to announce.', 'We update this page when we have a confirmed pairing, pregnancy, or litter to share.'],
  ['What May Be Possible', 'Possible Traits'],
  ['EARLY CONSIDERATION', 'PLANNING AHEAD'],
  ['Individual Match', 'Finding the Right Puppy'],
  ['Final placement decisions are based on the actual puppies—their development, temperament, and fit for the home.', 'Once the puppies are old enough for us to know them better, we talk with approved families about which puppy may fit their home best.'],
  ['When a possible match becomes available, we can have a much more useful conversation because we already understand what matters to your family.', 'If a puppy may be a good fit, we can talk about that puppy with a better understanding of your home and what you are looking for.'],
  ['A LITTLE OF WHAT WE LOVE', 'WHY WE LOVE CHIHUAHUAS'],
  ['Big personality in a tiny package.', 'What we love about Chihuahuas.'],
  ['Written health &amp; sale terms', 'Health and sale terms in writing'],
  ['Individual go-home timing', 'Go-home timing based on the puppy'],
  ['WHAT MATTERS HERE', 'HOW WE RAISE OUR PUPPIES'],
  ['OUR PLACEMENT JOURNEY', 'OUR PUPPY PROCESS'],
  ['READ BEFORE YOU RESERVE', 'BEFORE YOU RESERVE'],
];

let changedPages = 0;
let replacementCount = 0;

for (const rel of targetPages) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) continue;

  let html = fs.readFileSync(file, 'utf8');
  const before = html;

  for (const [from, to] of replacements) {
    if (!html.includes(from)) continue;
    const hits = html.split(from).length - 1;
    html = html.split(from).join(to);
    replacementCount += hits;
  }

  if (html !== before) {
    fs.writeFileSync(file, html);
    changedPages += 1;
  }
}

const phrasesThatShouldNotRemain = [
  'Fit matters more than order',
  'Puppies are individuals.',
  'Written information matters.',
  'Companionship is the goal.',
  'A clear program, not a sales pitch.',
  'Application first, reservation second.',
  'Real dogs do not follow a production calendar.',
];

for (const rel of targetPages) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  for (const phrase of phrasesThatShouldNotRemain) {
    if (html.includes(phrase)) {
      throw new Error(`Human-voice pass missed \"${phrase}\" in ${rel}`);
    }
  }
}

console.log(`Human-voice pass updated ${changedPages} page(s) with ${replacementCount} copy change(s).`);
