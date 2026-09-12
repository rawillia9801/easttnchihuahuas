#!/usr/bin/env bash
set -euo pipefail

rm -rf public .site-build
mkdir -p public .site-build

# Rebuild the validated base website.
cat sitepart-* > .site-build/site.b64
base64 -d .site-build/site.b64 > .site-build/site.tgz
tar -xzf .site-build/site.tgz -C public

# Replace the public puppy application with the full 17-section intake form.
cat appover-* > .site-build/application.b64
base64 -d .site-build/application.b64 > .site-build/application.html.gz
mkdir -p public/application
gzip -dc .site-build/application.html.gz > public/application/index.html

# Fail the deployment if the application bundle is ever corrupted in transit.
printf '%s  %s\n' 'ca25fe41c39dc9fd3f6299fc4419eb7d9865a5f6864063709c290f095ed1fc69' 'public/application/index.html' | sha256sum -c -

printf 'East Tennessee Chihuahuas site prepared: '
find public -type f | wc -l
