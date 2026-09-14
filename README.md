# East Tennessee Chihuahuas

Canonical source repository for the customer-facing website at `easttnchihuahuas.com`.

## Public website

The site is a multi-page breeder website with a Mission Control-inspired shell adapted for a customer-facing Chihuahua program. Core public areas include Home, Available Puppies, Upcoming Litters, Puppy Process, Application, Pricing & Deposits, Our Dogs, About, Our Program, Health & Care, Past Puppies, Transportation, FAQ, Contact, and separate policy/document pages.

The policy/document area includes the Deposit Agreement, Puppy Sales Agreement & Bill of Sale, One-Year Health Guarantee, Financing & Payment Plan Addendum, Lifetime Return & Rehoming Policy, Transportation Policy, Buyer Responsibilities & Care Agreement, Small Puppy Safety Policy, Breeding Rights Policy, Terms, and Privacy Policy.

`postbuild.mjs` performs the final customer-facing pass after the base site is rebuilt. Additional build passes add the breeder photographs, customer form experience, policy/document presentation, and validation.

The homepage uses `assets/Cheralynnn.png`. The second breeder image, `assets/Cherlyn4444.jpg`, is copied into the deployed public assets and displayed on the About page.

## Website email and automatic replies

Website form delivery is handled by the Vercel Function at `api/submit-form.js`. The site sends directly through the East Tennessee Chihuahuas Hostinger mailboxes using authenticated Hostinger SMTP. There is no Resend dependency.

- `applications@easttnchihuahuas.com` receives puppy applications, application questions, and completed placement documents.
- `contact@easttnchihuahuas.com` receives general website, puppy-availability, pricing, transportation, and program inquiries.
- `support@easttnchihuahuas.com` receives existing-buyer questions, puppy-family updates, post-placement support, and website/form help.

The server-side transport is implemented in `api/_mail.js`. Default Hostinger SMTP settings are `smtp.hostinger.com` on port `465` with a secure connection. The credentials remain server-side and are never sent to browser JavaScript.

Required server-side mail environment variable when the three mailboxes share one password:

- `HOSTINGER_MAIL_PASSWORD`

Optional per-mailbox credentials:

- `APPLICATIONS_MAIL_PASSWORD`
- `CONTACT_MAIL_PASSWORD`
- `SUPPORT_MAIL_PASSWORD`

Optional SMTP and routing overrides:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `APPLICATIONS_INBOX`
- `CONTACT_INBOX`
- `SUPPORT_INBOX`

Do not commit mailbox passwords to the repository.

## Fillable documents

The customer document pages are interactive forms rather than a document preview followed by a separate submission box. Buyer/contact details, puppy details, document-specific information, acknowledgments, and signature fields are entered directly on the document page. The completed fields submit through `/api/submit-form`, are routed to `applications@easttnchihuahuas.com`, and trigger a confirmation email to the buyer.

`fillable-documents-pass.mjs` creates the integrated document form experience and removes the former bottom-of-page document submission form.

## Puppy admin

`/admin/` is a private breeder interface for creating, editing, publishing, reserving, hiding, and deleting puppy listings. It can also upload puppy photographs. Public puppy cards on Home and Available Puppies read from the same API, so a saved listing can appear immediately without rebuilding the website.

The admin/API expects these server-side environment variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_TOKEN`

The database/storage setup is in `supabase/schema.sql`. The service-role key must remain server-side and must never be placed in customer-facing JavaScript.

## Deployment

`build.sh` reconstructs the validated base bundle into `public/`, then runs the customer-facing build passes. `vercel.json` deploys the generated `public/` directory while Vercel Functions under `api/` provide the puppy listing, photo upload, and website form-email APIs.

The build fails if customer-facing QA finds former SWVA branding, internal-placeholder language, `since 2009` outside the About page, broken internal links, missing breeder images, legacy bottom document forms, or a Resend dependency in the website form handler.
