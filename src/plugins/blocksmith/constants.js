export const PLUGIN_PREFIX = '@triniti/blocksmith/';
const t = (id) => `${PLUGIN_PREFIX}${id}`;

export const actionTypes = {
  PREFIX: PLUGIN_PREFIX,

  BLOCK_COPIED: t('BLOCK_COPIED'),
  EDITOR_CLEANED: t('EDITOR_CLEANED'),
  EDITOR_DIRTIED: t('EDITOR_DIRTIED'),
  EDITOR_DESTROYED: t('EDITOR_DESTROYED'),
  EDITOR_RESET: t('EDITOR_RESET'),
  EDITOR_STORED: t('EDITOR_STORED'),
};

export const pbjxChannelNames = {
  ARTICLE_SEARCH: t('articleSearch'),
  AUDIO_ASSET_SEARCH: t('audioAssetSearch'),
  DOCUMENT_ASSET_SEARCH: t('documentAssetSearch'),
  GALLERY_SEARCH: t('gallerySearch'),
  IMAGE_ASSET_SEARCH: t('imageAssetSearch'),
  LINKED_IMAGE_ASSET_SEARCH: t('linkedImageAssetSearch'),
  POLL_SEARCH: t('pollSearch'),
  VIDEO_SEARCH: t('videoSearch'),
};
