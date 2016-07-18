#!/usr/bin/env bash -e

#
# Purpose: Pack and sign a Webextension extension directory into xpi format.
#
# Mozilla signing api keys can be found here: https://addons.mozilla.org/en-US/developers/addon/api/key/
#
# Use this script with two arguments: $ bash build_and_sign_xpi.sh <JWT issuer> <JWT secret>

./node_modules/web-ext/bin/web-ext sign --api-key ${1} --api-secret ${2} --artifacts-dir build
