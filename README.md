# East Tennessee Chihuahuas

Canonical source repository for the customer-facing website at `easttnchihuahuas.com`.

## Website structure

The site is a true multi-page website using the East Tennessee Chihuahuas Mission Control-inspired design. Customer-facing routes include Home, Available Puppies, Upcoming Litters, Puppy Process, Application, Our Dogs, Our Program, Health & Care, Past Puppies, Transportation, Pup-Lift, FAQ, Contact, and separate policy/document pages.

The policy and document area includes separate pages for the Deposit Agreement, Bill of Sale, One-Year Health Guarantee, Financing & Payment Plan Addendum, Lifetime Return & Rehoming Policy, Transportation Policy, Buyer Responsibilities & Care Agreement, Small Puppy Safety Policy, Breeding Rights Policy, Terms, and Privacy Policy.

## Deployment

The validated website is stored as an atomic compressed source bundle split across `sitepart-*` files. `build.sh` reconstructs that bundle into `public/`, and `vercel.json` tells Vercel to deploy that generated directory.

This keeps the complete site versioned in GitHub and allows future website changes to be committed here and deployed automatically rather than manually uploading folders to web hosting.

## Source checks

Current packaged site: 25 HTML pages, 30 deployed files, with internal links validated before packaging. Customer-facing content is branded as East Tennessee Chihuahuas and does not use the former Southwest Virginia Chihuahua business identity.
