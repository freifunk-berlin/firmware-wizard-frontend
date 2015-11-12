# Frontend of the firmware wizard [![Build Status](https://travis-ci.org/freifunk-berlin/firmware-wizard-frontend.svg?branch=master)](https://travis-ci.org/freifunk-berlin/firmware-wizard-frontend) [![Dependency Status](https://gemnasium.com/freifunk-berlin/firmware-wizard-frontend.svg)](https://gemnasium.com/freifunk-berlin/firmware-wizard-frontend)

Currently, this is a prototype for an upcoming firmware wizard. Check it out [here](https://freifunk-berlin.github.io/firmware-wizard-frontend/)!

## Technical background
This wizards follows a few principles:

1. Router configuration should be a piece of cake (for users *and* developers).
2. Make the router stupid: all business logic is in the browser. Lua and LuCI can be removed from the router.
3. The actual router config is generated from a single-source-of-truth JSON config.
4. The wizard can be re-run with the JSON config.
5. Migrations to new versions of the firmware can regenerate the actual config from the JSON config.

## Development
You need `npm` (included in NodeJS) and `bower` (`npm install -g bower`).

The dependencies are fetched via
```
npm install
bower install
```

A build (to the subdirectory `gh-pages`) is triggered via
```
npm run build
```
