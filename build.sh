#!/usr/bin/env bash
set -euo pipefail

rm -rf public .site-build
mkdir -p public .site-build

cat sitepart-* > .site-build/site.b64
base64 -d .site-build/site.b64 > .site-build/site.tgz
tar -xzf .site-build/site.tgz -C public

printf 'East Tennessee Chihuahuas site prepared: '
find public -type f | wc -l
