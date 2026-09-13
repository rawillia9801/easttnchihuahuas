#!/usr/bin/env bash
set -euo pipefail

rm -rf public .site-build
mkdir -p public .site-build

# Rebuild the validated base website.
cat sitev2-00 sitev2-01 sitev2-02 sitev2-03 sitev2-04 sitev2-05 sitev2-06-restB > .site-build/site.b64
base64 -d .site-build/site.b64 > .site-build/site.tgz
printf '%s  %s\n' '34225bc5f5f16a9955beaca4caa0173837b688679b56cee9534d4a21f8ab57cd' '.site-build/site.tgz' | sha256sum -c -
tar -xzf .site-build/site.tgz -C public

# Apply the customer-facing audit, About/Pricing pages, dynamic puppy listings,
# private /admin, sitemap, and link/content QA.
node postbuild.mjs

# Apply the final hero-image safeguard so the home page always uses a healthy,
# professional Chihuahua puppy photo and never shows photo-source/development copy.
node fix-hero.mjs

printf 'East Tennessee Chihuahuas site prepared: '
find public -type f | wc -l
