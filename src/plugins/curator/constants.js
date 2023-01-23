export const PLUGIN_PREFIX = 'curator/';
const t = id => `${PLUGIN_PREFIX}${id}`;

export const actionTypes = {
  PREFIX: PLUGIN_PREFIX,
};

export const reorderGalleryOperations = {
  ADD_GALLERY_ASSETS: t('ADD_GALLERY_ASSETS'),
  REMOVE_GALLERY_ASSET: t('REMOVE_GALLERY_ASSET'),
  REORDER_GALLERY_ASSETS: t('REORDER_GALLERY_ASSETS'),
};