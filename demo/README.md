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
+ Create a `src/schemas.js` file that imports and exports your vendor schemas (see example below)
+ Run `$ npm start` (or `npm run start --workspace demo` from root)
+ Open <https://localhost:3000> in a browser.

the directory structure should look like this

```
root
│   node_modules (includes vendor schemas)
│   ...rest
│
└───demo
│   │   node_modules (built when app started)
│   │   ...rest
|   └───src
|       |   .env[.environment]
|       |   schemas.js
|       |   ...rest
```


## example `.env` file:

```
CMS_APP_BASE_URL=/
CMS_APP_ENV=dev
CMS_APP_ID=acme-cms
CMS_APP_VENDOR=acme
CMS_APP_NAME=cms
CMS_APP_VERSION=v0.1.0
CMS_APP_BUILD=20190925145136
CMS_APP_DEPLOYMENT_ID=20190925145136
CMS_APP_DEV_BRANCH=master
CMS_CLIENT_PUBLIC_PATH=/
CMS_DAM_BASE_URL=https://dam.dev.acme.com/
CMS_IMAGE_BASE_URL=https://imagez-dev.acme.com/
CMS_SITE_BASE_URL=https://localhost:3000/
CMS_VIDEO_ASSET_BASE_URL=https://ovp.dev.acme.com/

CMS_AUTH0_AUDIENCE=https://api.dev.acme.com/
CMS_AUTH0_CLIENT_ID=blahblahblahblahblahblah
CMS_AUTH0_DOMAIN=acme.auth0.com

CMS_API_ENDPOINT=https://master.api.dev.acme.com
CMS_PBJX_ENDPOINT=https://master.api.dev.acme.com/pbjx

CMS_GOOGLE_MAPS_API_KEY=blahblahblahblahblahblah
```


## example `schemas.js` file:

```
export { default } from '@acme/schemas';
```
