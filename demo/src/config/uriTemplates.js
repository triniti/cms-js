import { registerGlobals, registerTemplates } from '@gdbots/pbjx/pbjUrl';

const tld = API_ENDPOINT.split('://').pop().split('/').shift().split('.').slice(-2).join('.');

let ampBaseUrl;
let webBaseUrl;
let damBaseUrl;
let imageBaseUrl;
let ovpBaseUrl;

if (APP_ENV === 'prod') {
  ampBaseUrl = `https://amp.${tld}/`;
  webBaseUrl = `https://www.${tld}/`;
} else if (APP_ENV === 'dev') {
  ampBaseUrl = `https://master.amp.${APP_ENV}.${tld}/`;
  webBaseUrl = `https://master.www.${APP_ENV}.${tld}/`;
} else {
  ampBaseUrl = `https://amp.${APP_ENV}.${tld}/`;
  webBaseUrl = `https://www.${APP_ENV}.${tld}/`;
}

registerGlobals({
  amp_base_url: ampBaseUrl,
  web_base_url: webBaseUrl,
});

window.DAM_BASE_URL = damBaseUrl;
window.IMAGE_BASE_URL = imageBaseUrl;
window.VIDEO_ASSET_BASE_URL = ovpBaseUrl;

registerTemplates({
  'pbj.json-schema': `https://schemas.${tld}/json-schema/{vendor}/{package}{/category}/{message}/{version}.json`,
  'node.edit': '/ncr/{label}/{_id}/edit',
  'node.view': '/ncr/{label}/{_id}',
});
