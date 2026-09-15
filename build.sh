#!/usr/bin/env bash
set -euo pipefail

rm -rf public .site-build
mkdir -p public .site-build

# Rebuild the validated base website.
cat sitev2-00 sitev2-01 sitev2-02 sitev2-03 sitev2-04 sitev2-05 sitev2-06-restB > .site-build/site.b64
base64 -d .site-build/site.b64 > .site-build/site.tgz
printf '%s  %s\n' '34225bc5f5f16a9955beaca4caa0173837b688679b56cee9534d4a21f8ab57cd' '.site-build/site.tgz' | sha256sum -c -
tar -xzf .site-build/site.tgz -C public

# Build the working site, admin tools, and dynamic puppy data hooks.
node postbuild.mjs

# Apply customer-facing design, copy, image, form, contract, policy, funnel, health, photo, submission, and email-routing passes.
node fix-hero.mjs
node final-pass.mjs
node contracts-pass.mjs
node policy-experience.mjs
node funnel-polish.mjs
node legal-policy-pass.mjs
node availability-upcoming-pass-v2.mjs
node health-screening-pass.mjs
node upcoming-waitlist-pass.mjs
node homepage-show-photo-pass.mjs
node secondary-photo-pass.mjs
node document-email-links-pass.mjs
node form-email-pass.mjs
node fillable-documents-pass.mjs
node email-routing-pass.mjs
node admin-dashboard-pass.mjs
# final-qa imports finance-plan-pass after the document layout is complete, then validates the finished output.
node final-qa.mjs

printf 'East Tennessee Chihuahuas site prepared: '
find public -type f | wc -l
