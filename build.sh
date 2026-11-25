#!/bin/bash
# Packs the modules in js/ into one file, js/app.js, that also runs on older iPads (Safari 12+).
# Run after every code change:  ./build.sh
set -e
cd "$(dirname "$0")"
ESBUILD=$(command -v esbuild || echo /opt/npm-tools/node_modules/esbuild/bin/esbuild)
node tools/compat-css.js
"$ESBUILD" js/main.js --bundle --format=iife --target=es2017 --minify --legal-comments=none --sourcemap --outfile=js/app.js --log-level=warning
v=$(date +%s); sed -i "s#js/app.js?v=[0-9]*#js/app.js?v=$v#" index.html
echo "built js/app.js ($(wc -c < js/app.js) bytes)"
