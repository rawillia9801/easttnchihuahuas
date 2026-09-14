# East Tennessee Chihuahuas

Canonical source repository for the customer-facing website at `easttnchihuahuas.com`.

## Public website

The site is a multi-page breeder website with a Mission Control-inspired shell adapted for a customer-facing Chihuahua program. Core public areas include Home, Available Puppies, Upcoming Litters, Puppy Process, Application, Pricing & Deposits, Our Dogs, About, Our Program, Health & Care, Past Puppies, Transportation, FAQ, Contact, and separate policy/document pages.

The policy/document area includes the Deposit Agreement, Puppy Sales Agreement & Bill of Sale, One-Year Health Guarantee, Financing & Payment Plan Addendum, Lifetime Return & Rehoming Policy, Transportation Policy, Buyer Responsibilities & Care Agreement, Small Puppy Safety Policy, Breeding Rights Policy, Terms, and Privacy Policy.

`postbuild.mjs` performs the final customer-facing pass after the base site is rebuilt. It keeps the breeder biography/"since 2009" information on the About page, replaces internal/development-style customer copy, uses a real Chihuahua photograph on the home page, builds Pricing and About pages, generates dynamic puppy-listing surfaces, creates the private `/admin/` interface, and performs build-time customer-copy and internal-link validation.

## Website email and automatic replies

Website form delivery is handled by the Vercel Function at `api/submit-form.js`. Form submissions are routed by purpose and a confirmation email is automatically sent back to the visitor.

- `applications@easttnchihuahuas.com` receives puppy applications, application questions, and completed placement documents.
- `contact@easttnchihuahuas.com` receives general website, puppy-availability, pricing, transportation, and program inquiries.
- `support@easttnchihuahuas.com` receives existing-buyer questions, puppy-family updates, post-placement support, and website/form help.

`email-routing-pass.mjs` adds the routed contact form to `/contact/`, replaces the former public `hello@easttnchihuahuas.com` address with `contact@easttnchihuahuas.com`, and creates the browser-side submission handler.

Email delivery currently uses the Resend API from the server-side Vercel Function. The sending domain must be verified with the email provider before production mail can be sent from the East Tennessee Chihuahuas addresses.

Required server-side email environment variable:

- `RESEND_API_KEY`

Optional server-side routing overrides:

- `APPLICATIONS_INBOX`
- `CONTACT_INBOX`
- `SUPPORT_INBOX`
- `APPLICATIONS_FROM_EMAIL`
- `CONTACT_FROM_EMAIL`
- `SUPPORT_FROM_EMAIL`

These values are server-side only. Do not place API keys or mailbox passwords in public JavaScript or commit them to the repository.

## Puppy admin

`/admin/` is a private breeder interface for creating, editing, publishing, reserving, hiding, and deleting puppy listings. It can also upload puppy photographs. Public puppy cards on Home and Available Puppies read from the same API, so a saved listing can appear immediately without rebuilding the website.

The admin/API expects these server-side environment variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_TOKEN`

The database/storage setup is in `supabase/schema.sql`. The service-role key must remain server-side and must never be placed in customer-facing JavaScript.

## Deployment

`build.sh` reconstructs the validated base bundle into `public/`, then runs the customer-facing build passes. `vercel.json` deploys the generated `public/` directory while Vercel Functions under `api/` provide the puppy listing, photo upload, and website form-email APIs.

The build fails if customer-facing QA finds former SWVA branding, internal-placeholder language, `since 2009` outside the About page, or broken internal links.
