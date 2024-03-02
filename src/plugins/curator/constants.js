export const PLUGIN_PREFIX = 'curator/';
const t = id => `${PLUGIN_PREFIX}${id}`;

export const actionTypes = {
  PREFIX: PLUGIN_PREFIX,
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