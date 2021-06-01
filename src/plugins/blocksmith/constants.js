export const PLUGIN_PREFIX = '@triniti/blocksmith/';
const t = (id) => `${PLUGIN_PREFIX}${id}`;

export const actionTypes = {
  PREFIX: PLUGIN_PREFIX,

  EDITOR_CLEANED: t('EDITOR_CLEANED'),
  EDITOR_DIRTIED: t('EDITOR_DIRTIED'),
  EDITOR_DESTROYED: t('EDITOR_DESTROYED'),
  EDITOR_RESET: t('EDITOR_RESET'),
  EDITOR_STORED: t('EDITOR_STORED'),
};

export const pbjxChannelNames = {
  ARTICLE_SEARCH: t('articleSearch'),
  AUDIO_ASSET_SEARCH: t('audioAssetSearch'),
  GALLERY_SEARCH: t('gallerySearch'),
  IMAGE_ASSET_SEARCH: t('imageAssetSearch'),
  LINKED_IMAGE_ASSET_SEARCH: t('linkedImageAssetSearch'),
  POLL_SEARCH: t('pollSearch'),
  VIDEO_SEARCH: t('videoSearch'),
  NODE_REQUEST: t('nodeRequest'),
};

export const blockTypes = {
  ATOMIC: 'atomic',
  ORDERED_LIST_ITEM: 'ordered-list-item',
  UNORDERED_LIST_ITEM: 'unordered-list-item',
  UNSTYLED: 'unstyled',
};

export const inlineStyleTypes = {
  HIGHLIGHT: 'HIGHLIGHT',
};

export const mutabilityTypes = {
  MUTABLE: 'MUTABLE',
  IMMUTABLE: 'IMMUTABLE',
};

export const entityTypes = {
  EMOJI: 'EMOJI',
  LINK: 'LINK',
};

export const tokens = {
  BLOCKSMITH_COPIED_CONTENT_TOKEN: 'BLOCKSMITH_COPIED_CONTENT_TOKEN:',
  EMPTY_BLOCK_TOKEN: 'EMPTY_BLOCK_TOKEN',
};

export const COPIED_BLOCK_KEY = 'blocksmith.copiedBlock';

