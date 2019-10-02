const PLUGIN_PREFIX = '@triniti/curator/';

const t = (id) => `${PLUGIN_PREFIX}${id}`;

export default PLUGIN_PREFIX;

export const serviceIds = {
  PREFIX: PLUGIN_PREFIX,

  AD_WIDGET_SUBSCRIBER: t('ad_widget_subscriber'),
  ALERT_WIDGET_SUBSCRIBER: t('alert_widget_subscriber'),
  ARTICLE_TEASER_SUBSCRIBER: t('article_teaser_subscriber'),
  ASSET_TEASER_SUBSCRIBER: t('asset_teaser_subscriber'),
  BLOGROLL_WIDGET_SUBSCRIBER: t('blogroll_widget_subscriber'),
  CAROUSEL_WIDGET_SUBSCRIBER: t('carousel_widget_subscriber'),
  CATEGORY_TEASER_SUBSCRIBER: t('category_teaser_subscriber'),
  CHANNEL_TEASER_SUBSCRIBER: t('channel_teaser_subscriber'),
  CODE_WIDGET_SUBSCRIBER: t('code_widget_subscriber'),
  EXPIRABLE_SUBSCRIBER: t('expirable_subscriber'),
  GALLERY_SUBSCRIBER: t('gallery_subscriber'),
  GALLERY_TEASER_SUBSCRIBER: t('gallery_teaser_subscriber'),
  LINK_TEASER_SUBSCRIBER: t('link_teaser_subscriber'),
  PAGE_TEASER_SUBSCRIBER: t('page_teaser_subscriber'),
  PERSON_TEASER_SUBSCRIBER: t('person_teaser_subscriber'),
  POLL_TEASER_SUBSCRIBER: t('poll_teaser_subscriber'),
  PROMOTION_SUBSCRIBER: t('promotion_subscriber'),
  SEO_SUBSCRIBER: t('seo_subscriber'),
  SHOWTIMES_WIDGET_SUBSCRIBER: t('showtimes_widget_subscriber'),
  TEASER_SUBSCRIBER: t('teaser_subscriber'),
  TEASERABLE_SUBSCRIBER: t('teaserable_subscriber'),
  TETRIS_WIDGET_SUBSCRIBER: t('tetris_widget_subscriber'),
  TIMELINE_SUBSCRIBER: t('timeline_subscriber'),
  TIMELINE_TEASER_SUBSCRIBER: t('timeline_teaser_subscriber'),
  VIDEO_TEASER_SUBSCRIBER: t('video_teaser_subscriber'),
  WIDGET_HAS_SEARCH_REQUEST_SUBSCRIBER: t('widget_has_search_request_subscriber'),
  WIDGET_SUBSCRIBER: t('widget_subscriber'),
  YOUTUBE_VIDEO_TEASER_SUBSCRIBER: t('youtube_video_teaser_subscriber'),
};

export const formNames = {
  CREATE_GALLERY: t('create_gallery'),
  CREATE_PROMOTION: t('create_promotion'),
  CREATE_TEASER: t('create_teaser'),
  CREATE_TIMELINE: t('create_timeline'),
  CREATE_WIDGET: t('create_widget'),
  GALLERY: t('gallery'),
  PROMOTION: t('promotion'),
  TEASER: t('teaser'),
  TIMELINE: t('timeline'),
  WIDGET: t('widget'),
};

export const routeIds = {
  PREFIX: PLUGIN_PREFIX,

  GALLERY: t('gallery'),
  INDEX: t('index'),
  PROMOTION: t('promotion'),
  SEARCH_GALLERIES: t('search_galleries'),
  SEARCH_PROMOTIONS: t('search_promotions'),
  SEARCH_TEASERS: t('search_teasers'),
  SEARCH_TIMELINES: t('search_timelines'),
  SEARCH_WIDGETS: t('search_widgets'),
  TEASER: t('teaser'),
  TIMELINE: t('timeline'),
  WIDGET: t('widget'),
};

export const pbjxChannelNames = {
  GALLERY_SEARCH: t('gallerySearch'),
  GALLERY_MEDIA_SEARCH: t('galleryMediaSearch'),
  TIMELINE_SEARCH: t('timelineSearch'),
  WIDGET_SEARCH: t('widgetSearch'),
};

export const reorderGalleryOperations = {
  ADD_GALLERY_ASSETS: t('ADD_GALLERY_ASSETS'),
  REMOVE_GALLERY_ASSET: t('REMOVE_GALLERY_ASSET'),
  REORDER_GALLERY_ASSETS: t('REORDER_GALLERY_ASSETS'),
};

export const DATE_FIELD_QUICK_SELECT_OPTIONS = [
  {
    amount: 5,
    unit: 'year',
  },
  {
    amount: 1,
    unit: 'year',
  },
];
