cms-js DEMO
=======================

## Installation
+ Enter the repo `$ cd cms-js`
+ Run `$ nvm use`
+ Go to the demo directory `$ cd demo`
+ Create a `.env` file with the desired vendor env information (see example below)
+ Create a `schemas.js` file that imports and exports your vendor schemas (see example below)
+ Return to the root of the project `$ cd ..`
+ Install your vendor schemas. ex: `$ npm install @acme/schemas --no-save` (the `--no-save` flag prevents them from being added to `package.json`)
+ Run `$ npm install`
+ Go to the demo directory `$ cd demo`
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
DAM_BASE_URL=https://dam.dev.acme.com/
IMAGE_BASE_URL=https://imagez-dev.acme.com/

AUTH0_API_IDENTIFIER=https://api.dev.acme.com/
AUTH0_CLIENT_ID=blahblahblahblahblahblah
AUTH0_DOMAIN=acme.auth0.com

API_ENDPOINT=https://master.api.dev.acme.com
PBJX_ENDPOINT=https://master.api.dev.acme.com/pbjx

GOOGLE_MAPS_API_KEY=blahblahblahblahblahblah
```


## example `schemas.js` file:

```
import schemas from '@acme/schemas';
import SearchArticlesRequestV1 from '@acme/schemas/acme/news/request/SearchArticlesRequestV1';

export default schemas;
export const SearchArticlesRequest = SearchArticlesRequestV1;
```


