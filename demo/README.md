cms-js DEMO
=======================

Do not actually use `acme` anywhere. Wherever it says `acme` below, you need to replace that with the appropriate vendor name.


## Installation
+ Enter the repo `$ cd cms-js`
+ Run `$ nvm use`
+ Run `$ npm install`
+ Go to the demo directory `$ cd demo`
+ Install your vendor schemas `$ npm install --no-save @yourvendor/schemas`
+ Create a `.env` file with the desired vendor env information (see example below)
+ Create a `src/schemas.js` file that imports and exports your vendor schemas (see example below)
+ Run `$ npm start`
+ Open <http://localhost:3000> in a browser.

The directory structure should look like this:

```
root
│   node_modules
│   ...rest
│
└───demo
│   │   node_modules
│   │   .env
│   │   ...rest
|   └───src
|       |   schemas.js
|       |   ...rest
```


### Example `.env` file:

```
APP_BASE_URL=http://localhost:3000/
SITE_BASE_URL=http://localhost:3000/
APP_ENV=dev
APP_ID=acme-cms
APP_VENDOR=acme
APP_NAME=cms
APP_VERSION=v2.0.0
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


### Example `schemas.js` file:

```
import MessageResolver from '@acme/schemas';
export default MessageResolver;

```
