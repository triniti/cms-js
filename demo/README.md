cms-js DEMO
=======================

## Installation
+ Git clone the project to your computer:
```
$ git clone git@github.com:triniti/cms-js.git
```
+ Open terminal and `cd cms-js/demo`
+ Create a `.env` file with the desired vendor env information
+ Create a `schemas.js` file that imports and exports your vendor schemas
+ Protip: you can install your vendor schemas with the `--no-save` flag to prevent them being added to `package.json`
+ Run `$ nvm use`
+ Run `$ npm install`
+ Run `$ npm start`
+ Open <https://localhost:8080> in a browser.


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