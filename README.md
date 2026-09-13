# East Tennessee Chihuahuas

Canonical source repository for the customer-facing website at `easttnchihuahuas.com`.

## Public website

The site is a multi-page breeder website with a Mission Control-inspired shell adapted for a customer-facing Chihuahua program. Core public areas include Home, Available Puppies, Upcoming Litters, Puppy Process, Application, Pricing & Deposits, Our Dogs, About, Our Program, Health & Care, Past Puppies, Transportation, FAQ, Contact, and separate policy/document pages.

The policy/document area includes the Deposit Agreement, Puppy Sales Agreement & Bill of Sale, One-Year Health Guarantee, Financing & Payment Plan Addendum, Lifetime Return & Rehoming Policy, Transportation Policy, Buyer Responsibilities & Care Agreement, Small Puppy Safety Policy, Breeding Rights Policy, Terms, and Privacy Policy.

`postbuild.mjs` performs the final customer-facing pass after the base site is rebuilt. It keeps the breeder biography/"since 2009" information on the About page, replaces internal/development-style customer copy, uses a real Chihuahua photograph on the home page, builds Pricing and About pages, generates dynamic puppy-listing surfaces, creates the private `/admin/` interface, and performs build-time customer-copy and internal-link validation.

## Puppy admin

`/admin/` is a private breeder interface for creating, editing, publishing, reserving, hiding, and deleting puppy listings. It can also upload puppy photographs. Public puppy cards on Home and Available Puppies read from the same API, so a saved listing can appear immediately without rebuilding the website.

The admin/API expects these server-side environment variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_TOKEN`

The database/storage setup is in `supabase/schema.sql`. The service-role key must remain server-side and must never be placed in customer-facing JavaScript.

## Deployment

`build.sh` reconstructs the validated base bundle into `public/`, then runs `postbuild.mjs`. `vercel.json` deploys the generated `public/` directory while Vercel Functions under `api/` provide the puppy listing and photo upload APIs.

The build fails if customer-facing QA finds former SWVA branding, internal-placeholder language, `since 2009` outside the About page, or broken internal links.
