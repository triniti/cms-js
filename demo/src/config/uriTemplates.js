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
  [`${APP_VENDOR}:article.canonical`]: '{+web_base_url}{+slug}/',
  [`${APP_VENDOR}:article.preview`]: '{+web_base_url}_/preview/article/{_id}/',
  [`${APP_VENDOR}:article-teaser.canonical`]: '{+web_base_url}t/article/{_id}/',
  [`${APP_VENDOR}:category.canonical`]: '{+web_base_url}categories/{slug}/',
  [`${APP_VENDOR}:category-teaser.canonical`]: '{+web_base_url}t/category/{_id}/',
  [`${APP_VENDOR}:channel.canonical`]: '{+web_base_url}{slug}/',
  [`${APP_VENDOR}:channel-teaser.canonical`]: '{+web_base_url}t/channel/{_id}/',
  [`${APP_VENDOR}:gallery-teaser.canonical`]: '{+web_base_url}t/gallery/{_id}/',
  [`${APP_VENDOR}:link-teaser.canonical`]: '{+link_url}',
  [`${APP_VENDOR}:page.canonical`]: '{+web_base_url}pages/{slug}/',
  [`${APP_VENDOR}:page-teaser.canonical`]: '{+web_base_url}t/page/{_id}/',
  [`${APP_VENDOR}:person.canonical`]: '{+web_base_url}people/{slug}/',
  [`${APP_VENDOR}:person-teaser.canonical`]: '{+web_base_url}t/person/{_id}/',
  [`${APP_VENDOR}:poll-teaser.canonical`]: '{+web_base_url}t/poll/{_id}/',
  [`${APP_VENDOR}:timeline.canonical`]: '{+web_base_url}timelines/{slug}/',
  [`${APP_VENDOR}:timeline-teaser.canonical`]: '{+web_base_url}t/timeline/{_id}/',
  [`${APP_VENDOR}:video.canonical`]: '{+web_base_url}videos/{slug}/',
  [`${APP_VENDOR}:video-teaser.canonical`]: '{+web_base_url}t/video/{_id}/',
  [`${APP_VENDOR}:youtube-video-teaser.canonical`]: '{+web_base_url}t/youtube-video/{_id}/',
});
