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
  damBaseUrl = `https://dam.${tld}/`;
  imageBaseUrl = damBaseUrl;
  ovpBaseUrl = damBaseUrl;
} else if (APP_ENV === 'dev' || APP_ENV === 'local') {
  ampBaseUrl = `https://main.amp.dev.${tld}/`;
  webBaseUrl = `https://main.www.dev.${tld}/`;
  damBaseUrl = `https://dam.dev.${tld}/`;
  imageBaseUrl = damBaseUrl;
  ovpBaseUrl = damBaseUrl;
} else {
  ampBaseUrl = `https://amp.${APP_ENV}.${tld}/`;
  webBaseUrl = `https://www.${APP_ENV}.${tld}/`;
  damBaseUrl = `https://dam.${APP_ENV}.${tld}/`;
  imageBaseUrl = damBaseUrl;
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
