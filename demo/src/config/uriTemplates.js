/* globals APP_ENV, APP_VENDOR */
import { registerGlobals, registerTemplates } from '@gdbots/pbjx/pbjUrl';

// eslint-disable-next-line
const tld = API_ENDPOINT.split('://').pop().split('/').shift().split('.').slice(-2).join('.');

let ampBaseUrl;
let webBaseUrl;

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

registerTemplates({
  [`${APP_VENDOR}:ad-widget.cms`]: '/curator/widgets/ad-widget/{_id}',
  [`${APP_VENDOR}:alert-widget.cms`]: '/curator/widgets/alert-widget/{_id}',
  [`${APP_VENDOR}:alexa-app.cms`]: '/iam/apps/alexa-app/{_id}',
  [`${APP_VENDOR}:alexa-notification.cms`]: '/notify/notifications/alexa-notification/{_id}',
  [`${APP_VENDOR}:android-app.cms`]: '/iam/apps/android-app/{_id}',
  [`${APP_VENDOR}:android-notification.cms`]: '/notify/notifications/android-notification/{_id}',
  [`${APP_VENDOR}:apple-news-app.cms`]: '/iam/apps/apple-news-app/{_id}',
  [`${APP_VENDOR}:apple-news-notification.cms`]: '/notify/notifications/apple-news-notification/{_id}',
  [`${APP_VENDOR}:archive-asset.cms`]: '/dam/assets/archive-asset/{_id}',
  [`${APP_VENDOR}:article.amp`]: '{+amp_base_url}{+slug}/',
  [`${APP_VENDOR}:article.canonical`]: '{+web_base_url}{+slug}/',
  [`${APP_VENDOR}:article.cms`]: '/news/articles/{_id}',
  [`${APP_VENDOR}:article.preview`]: '{+web_base_url}_/preview/article/{_id}/',
  [`${APP_VENDOR}:article-teaser.canonical`]: '{+web_base_url}t/article/{_id}/',
  [`${APP_VENDOR}:article-teaser.cms`]: '/curator/teasers/article-teaser/{_id}',
  [`${APP_VENDOR}:audio-asset.cms`]: '/dam/assets/audio-asset/{_id}',
  [`${APP_VENDOR}:blogroll-widget.cms`]: '/curator/widgets/blogroll-widget/{_id}',
  [`${APP_VENDOR}:browser-app.cms`]: '/iam/apps/browser-app/{_id}',
  [`${APP_VENDOR}:browser-notification.cms`]: '/notify/notifications/browser-notification/{_id}',
  [`${APP_VENDOR}:carousel-widget.cms`]: '/curator/widgets/carousel-widget/{_id}',
  [`${APP_VENDOR}:category.canonical`]: '{+web_base_url}categories/{slug}/',
  [`${APP_VENDOR}:category.cms`]: '/taxonomy/categories/{_id}',
  [`${APP_VENDOR}:category-teaser.canonical`]: '{+web_base_url}t/category/{_id}/',
  [`${APP_VENDOR}:category-teaser.cms`]: '/curator/teasers/category-teaser/{_id}',
  [`${APP_VENDOR}:channel.canonical`]: '{+web_base_url}{slug}/',
  [`${APP_VENDOR}:channel.cms`]: '/taxonomy/channels/{_id}',
  [`${APP_VENDOR}:channel-teaser.canonical`]: '{+web_base_url}t/channel/{_id}/',
  [`${APP_VENDOR}:channel-teaser.cms`]: '/curator/teasers/channel-teaser/{_id}',
  [`${APP_VENDOR}:code-asset.cms`]: '/dam/assets/code-asset/{_id}',
  [`${APP_VENDOR}:code-widget.cms`]: '/curator/widgets/code-widget/{_id}',
  [`${APP_VENDOR}:document-asset.cms`]: '/dam/assets/document-asset/{_id}',
  [`${APP_VENDOR}:email-app.cms`]: '/iam/apps/email-app/{_id}',
  [`${APP_VENDOR}:email-notification.cms`]: '/notify/notifications/email-notification/{_id}',
  [`${APP_VENDOR}:flagset.cms`]: '/sys/flagsets/{_id}',
  [`${APP_VENDOR}:gallery.canonical`]: '{+web_base_url}photos/{+slug}/',
  [`${APP_VENDOR}:gallery.cms`]: '/curator/galleries/{_id}',
  [`${APP_VENDOR}:gallery-teaser.canonical`]: '{+web_base_url}t/gallery/{_id}/',
  [`${APP_VENDOR}:gallery-teaser.cms`]: '/curator/teasers/gallery-teaser/{_id}',
  [`${APP_VENDOR}:gallery-widget.cms`]: '/curator/widgets/gallery-widget/{_id}',
  [`${APP_VENDOR}:gridler-widget.cms`]: '/curator/widgets/gridler-widget/{_id}',
  [`${APP_VENDOR}:hero-bar-widget.cms`]: '/curator/widgets/hero-bar-widget/{_id}',
  [`${APP_VENDOR}:image-asset.canonical`]: '{+web_base_url}photos/{_id}',
  [`${APP_VENDOR}:image-asset.cms`]: '/dam/assets/image-asset/{_id}',
  [`${APP_VENDOR}:ios-app.cms`]: '/iam/apps/ios-app/{_id}',
  [`${APP_VENDOR}:ios-notification.cms`]: '/notify/notifications/ios-notification/{_id}',
  [`${APP_VENDOR}:link-teaser.canonical`]: '{+link_url}',
  [`${APP_VENDOR}:link-teaser.cms`]: '/curator/teasers/link-teaser/{_id}',
  [`${APP_VENDOR}:media-list-widget.cms`]: '/curator/widgets/media-list-widget/{_id}',
  [`${APP_VENDOR}:page.canonical`]: '{+web_base_url}pages/{slug}/',
  [`${APP_VENDOR}:page.cms`]: '/canvas/pages/{_id}',
  [`${APP_VENDOR}:page-teaser.canonical`]: '{+web_base_url}t/page/{_id}/',
  [`${APP_VENDOR}:page-teaser.cms`]: '/curator/teasers/page-teaser/{_id}',
  [`${APP_VENDOR}:person.canonical`]: '{+web_base_url}people/{slug}/',
  [`${APP_VENDOR}:person.cms`]: '/people/people/{_id}',
  [`${APP_VENDOR}:person-teaser.canonical`]: '{+web_base_url}t/person/{_id}/',
  [`${APP_VENDOR}:person-teaser.cms`]: '/curator/teasers/person-teaser/{_id}',
  [`${APP_VENDOR}:picklist.cms`]: '/sys/picklists/{_id}',
  [`${APP_VENDOR}:playlist-widget.cms`]: '/curator/widgets/playlist-widget/{_id}',
  // [`${APP_VENDOR}:poll.canonical`]: '{+web_base_url}polls/{_id}/',
  [`${APP_VENDOR}:poll.cms`]: '/apollo/polls/{_id}',
  [`${APP_VENDOR}:poll-teaser.canonical`]: '{+web_base_url}t/poll/{_id}/',
  [`${APP_VENDOR}:poll-teaser.cms`]: '/curator/teasers/poll-teaser/{_id}',
  [`${APP_VENDOR}:promotion.cms`]: '/curator/promotions/{_id}',
  [`${APP_VENDOR}:redirect.cms`]: '/sys/redirects/{_id}',
  [`${APP_VENDOR}:role.cms`]: '/iam/roles/{_id}',
  [`${APP_VENDOR}:showtimes-widget.cms`]: '/curator/widgets/showtimes-widget/{_id}',
  [`${APP_VENDOR}:slack-app.cms`]: '/iam/apps/slack-app/{_id}',
  [`${APP_VENDOR}:slack-notification.cms`]: '/notify/notifications/slack-notification/{_id}',
  [`${APP_VENDOR}:slider-widget.cms`]: '/curator/widgets/slider-widget/{_id}',
  [`${APP_VENDOR}:sms-app.cms`]: '/iam/apps/sms-app/{_id}',
  [`${APP_VENDOR}:sms-notification.cms`]: '/notify/notifications/sms-notification/{_id}',
  [`${APP_VENDOR}:sponsor.cms`]: '/boost/sponsors/{_id}',
  [`${APP_VENDOR}:spotlight-widget.cms`]: '/curator/widgets/spotlight-widget/{_id}',
  [`${APP_VENDOR}:tag-cloud-widget.cms`]: '/curator/widgets/tag-cloud-widget/{_id}',
  [`${APP_VENDOR}:tetris-widget.cms`]: '/curator/widgets/tetris-widget/{_id}',
  [`${APP_VENDOR}:timeline.canonical`]: '{+web_base_url}timelines/{slug}/',
  [`${APP_VENDOR}:timeline.cms`]: '/curator/timelines/{_id}',
  [`${APP_VENDOR}:timeline-teaser.canonical`]: '{+web_base_url}t/timeline/{_id}/',
  [`${APP_VENDOR}:timeline-teaser.cms`]: '/curator/teasers/timeline-teaser/{_id}',
  [`${APP_VENDOR}:unknown-asset.cms`]: '/dam/assets/unknown-asset/{_id}',
  [`${APP_VENDOR}:user.cms`]: '/iam/users/{_id}',
  [`${APP_VENDOR}:video.canonical`]: '{+web_base_url}videos/{slug}/',
  [`${APP_VENDOR}:video.cms`]: '/ovp/videos/{_id}',
  [`${APP_VENDOR}:video-asset.cms`]: '/dam/assets/video-asset/{_id}',
  [`${APP_VENDOR}:video-teaser.canonical`]: '{+web_base_url}t/video/{_id}/',
  [`${APP_VENDOR}:video-teaser.cms`]: '/curator/teasers/video-teaser/{_id}',
  [`${APP_VENDOR}:youtube-video-teaser.canonical`]: '{+web_base_url}t/youtube-video/{_id}/',
  [`${APP_VENDOR}:youtube-video-teaser.cms`]: '/curator/teasers/youtube-video-teaser/{_id}',
});
