cms-js DEMO
=======================

## Disclaimer
Do not actually use `acme` anywhere. Wherever it says `acme` below, you need to replace that with the appropriate vendor name.

## Installation
+ Enter the repo `$ cd cms-js`
+ Run `$ nvm use`
+ Run `$ npm install`
+ Install your vendor schemas (Note: install in the root directory and not in the demo to avoid package version conflicts) ex: `$ npm install @acme/schemas --no-save` (the `--no-save` flag prevents the package from being added to `package.json`)
+ Go to the demo directory `$ cd demo`
+ Create a `.env` file with the desired vendor env information (see example below)
+ Create a `schemas.js` file that imports and exports your vendor schemas (see example below)
+ Run `$ npm install`
+ Run `$ npm start`
+ Open <https://localhost:3000> in a browser.

the directory structure should look like this

```
root
│   node_modules (includes vendor shemas)
│   ...rest
│
└───demo
│   │   node_modules
│   │   .env
│   │   schemas.js
│   │   ...rest
```


## example `.env` file:

```
APP_BASE_URL=/
APP_ENV=dev
APP_ID=acme-cms
APP_VENDOR=acme
APP_NAME=cms
APP_VERSION=v0.1.0
APP_BUILD=20190925145136
APP_DEPLOYMENT_ID=20190925145136
APP_DEV_BRANCH=master
CLIENT_PUBLIC_PATH=/
DAM_BASE_URL=https://dam.dev.acme.com/
IMAGE_BASE_URL=https://imagez-dev.acme.com/
VIDEO_ASSET_BASE_URL=https://ovp.dev.acme.com/

AUTH0_AUDIENCE=https://api.dev.acme.com/
AUTH0_CLIENT_ID=blahblahblahblahblahblah
AUTH0_DOMAIN=acme.auth0.com

API_ENDPOINT=https://master.api.dev.acme.com
PBJX_ENDPOINT=https://master.api.dev.acme.com/pbjx

GOOGLE_MAPS_API_KEY=blahblahblahblahblahblah
```


## example `schemas.js` file:

```
export default from '@acme/schemas';
```
