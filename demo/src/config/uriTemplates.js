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
  'bachelornation:ad-widget.cms': '/curator/widgets/ad-widget/{_id}',
  'bachelornation:alert-widget.cms': '/curator/widgets/alert-widget/{_id}',
  'bachelornation:alexa-app.cms': '/iam/apps/alexa-app/{_id}',
  'bachelornation:alexa-notification.cms': '/notify/notifications/alexa-notification/{_id}',
  'bachelornation:android-app.cms': '/iam/apps/android-app/{_id}',
  'bachelornation:android-notification.cms': '/notify/notifications/android-notification/{_id}',
  'bachelornation:apple-news-app.cms': '/iam/apps/apple-news-app/{_id}',
  'bachelornation:apple-news-notification.cms': '/notify/notifications/apple-news-notification/{_id}',
  'bachelornation:archive-asset.cms': '/dam/assets/archive-asset/{_id}',
  'bachelornation:article.amp': '{+amp_base_url}{+slug}/',
  'bachelornation:article.canonical': '{+web_base_url}{+slug}/',
  'bachelornation:article.cms': '/news/articles/{_id}',
  'bachelornation:article.preview': '{+web_base_url}_/preview/article/{_id}/',
  'bachelornation:article-teaser.canonical': '{+web_base_url}t/article/{_id}/',
  'bachelornation:article-teaser.cms': '/curator/teasers/article-teaser/{_id}',
  'bachelornation:audio-asset.cms': '/dam/assets/audio-asset/{_id}',
  'bachelornation:blogroll-widget.cms': '/curator/widgets/blogroll-widget/{_id}',
  'bachelornation:browser-app.cms': '/iam/apps/browser-app/{_id}',
  'bachelornation:browser-notification.cms': '/notify/notifications/browser-notification/{_id}',
  'bachelornation:carousel-widget.cms': '/curator/widgets/carousel-widget/{_id}',
  'bachelornation:category.canonical': '{+web_base_url}categories/{slug}/',
  'bachelornation:category.cms': '/taxonomy/categories/{_id}',
  'bachelornation:category-teaser.canonical': '{+web_base_url}t/category/{_id}/',
  'bachelornation:category-teaser.cms': '/curator/teasers/category-teaser/{_id}',
  'bachelornation:channel.canonical': '{+web_base_url}{slug}/',
  'bachelornation:channel.cms': '/taxonomy/channels/{_id}',
  'bachelornation:channel-teaser.canonical': '{+web_base_url}t/channel/{_id}/',
  'bachelornation:channel-teaser.cms': '/curator/teasers/channel-teaser/{_id}',
  'bachelornation:code-asset.cms': '/dam/assets/code-asset/{_id}',
  'bachelornation:code-widget.cms': '/curator/widgets/code-widget/{_id}',
  'bachelornation:document-asset.cms': '/dam/assets/document-asset/{_id}',
  'bachelornation:email-app.cms': '/iam/apps/email-app/{_id}',
  'bachelornation:email-notification.cms': '/notify/notifications/email-notification/{_id}',
  'bachelornation:flagset.cms': '/sys/flagsets/{_id}',
  'bachelornation:gallery.canonical': '{+web_base_url}photos/{+slug}/',
  'bachelornation:gallery.cms': '/curator/galleries/{_id}',
  'bachelornation:gallery-teaser.canonical': '{+web_base_url}t/gallery/{_id}/',
  'bachelornation:gallery-teaser.cms': '/curator/teasers/gallery-teaser/{_id}',
  'bachelornation:gallery-widget.cms': '/curator/widgets/gallery-widget/{_id}',
  'bachelornation:gridler-widget.cms': '/curator/widgets/gridler-widget/{_id}',
  'bachelornation:hero-bar-widget.cms': '/curator/widgets/hero-bar-widget/{_id}',
  'bachelornation:image-asset.canonical': '{+web_base_url}photos/{_id}',
  'bachelornation:image-asset.cms': '/dam/assets/image-asset/{_id}',
  'bachelornation:ios-app.cms': '/iam/apps/ios-app/{_id}',
  'bachelornation:ios-notification.cms': '/notify/notifications/ios-notification/{_id}',
  'bachelornation:link-teaser.canonical': '{+link_url}',
  'bachelornation:link-teaser.cms': '/curator/teasers/link-teaser/{_id}',
  'bachelornation:media-list-widget.cms': '/curator/widgets/media-list-widget/{_id}',
  'bachelornation:page.canonical': '{+web_base_url}pages/{slug}/',
  'bachelornation:page.cms': '/canvas/pages/{_id}',
  'bachelornation:page-teaser.canonical': '{+web_base_url}t/page/{_id}/',
  'bachelornation:page-teaser.cms': '/curator/teasers/page-teaser/{_id}',
  'bachelornation:person.canonical': '{+web_base_url}people/{slug}/',
  'bachelornation:person.cms': '/people/people/{_id}',
  'bachelornation:person-teaser.canonical': '{+web_base_url}t/person/{_id}/',
  'bachelornation:person-teaser.cms': '/curator/teasers/person-teaser/{_id}',
  'bachelornation:picklist.cms': '/sys/picklists/{_id}',
  'bachelornation:playlist-widget.cms': '/curator/widgets/playlist-widget/{_id}',
  // 'bachelornation:poll.canonical': '{+web_base_url}polls/{_id}/',
  'bachelornation:poll.cms': '/apollo/polls/{_id}',
  'bachelornation:poll-teaser.canonical': '{+web_base_url}t/poll/{_id}/',
  'bachelornation:poll-teaser.cms': '/curator/teasers/poll-teaser/{_id}',
  'bachelornation:promotion.cms': '/curator/promotions/{_id}',
  'bachelornation:redirect.cms': '/sys/redirects/{_id}',
  'bachelornation:role.cms': '/iam/roles/{_id}',
  'bachelornation:showtimes-widget.cms': '/curator/widgets/showtimes-widget/{_id}',
  'bachelornation:slack-app.cms': '/iam/apps/slack-app/{_id}',
  'bachelornation:slack-notification.cms': '/notify/notifications/slack-notification/{_id}',
  'bachelornation:slider-widget.cms': '/curator/widgets/slider-widget/{_id}',
  'bachelornation:sms-app.cms': '/iam/apps/sms-app/{_id}',
  'bachelornation:sms-notification.cms': '/notify/notifications/sms-notification/{_id}',
  'bachelornation:sponsor.cms': '/boost/sponsors/{_id}',
  'bachelornation:spotlight-widget.cms': '/curator/widgets/spotlight-widget/{_id}',
  'bachelornation:tag-cloud-widget.cms': '/curator/widgets/tag-cloud-widget/{_id}',
  'bachelornation:tetris-widget.cms': '/curator/widgets/tetris-widget/{_id}',
  'bachelornation:timeline.canonical': '{+web_base_url}timelines/{slug}/',
  'bachelornation:timeline.cms': '/curator/timelines/{_id}',
  'bachelornation:timeline-teaser.canonical': '{+web_base_url}t/timeline/{_id}/',
  'bachelornation:timeline-teaser.cms': '/curator/teasers/timeline-teaser/{_id}',
  'bachelornation:unknown-asset.cms': '/dam/assets/unknown-asset/{_id}',
  'bachelornation:user.cms': '/iam/users/{_id}',
  'bachelornation:video.canonical': '{+web_base_url}videos/{slug}/',
  'bachelornation:video.cms': '/ovp/videos/{_id}',
  'bachelornation:video-asset.cms': '/dam/assets/video-asset/{_id}',
  'bachelornation:video-teaser.canonical': '{+web_base_url}t/video/{_id}/',
  'bachelornation:video-teaser.cms': '/curator/teasers/video-teaser/{_id}',
  'bachelornation:youtube-video-teaser.canonical': '{+web_base_url}t/youtube-video/{_id}/',
  'bachelornation:youtube-video-teaser.cms': '/curator/teasers/youtube-video-teaser/{_id}',
});
