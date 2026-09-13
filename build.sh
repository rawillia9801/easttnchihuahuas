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

# Apply customer-facing design, copy, image, form, contract, policy, and funnel passes.
node fix-hero.mjs
node final-pass.mjs
node contracts-pass.mjs
node policy-experience.mjs
node funnel-polish.mjs
node final-qa.mjs

printf 'East Tennessee Chihuahuas site prepared: '
find public -type f | wc -l
