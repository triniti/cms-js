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

// todo: sort out plugin vs alternate constants
export default {
  ATOMIC_BLOCKS_COPIED: 'ATOMIC_BLOCKS_COPIED',
  ATOMIC_BLOCKS_CUT: 'ATOMIC_BLOCKS_CUT',
  DOUBLE_ENTER_ON_LIST: 'DOUBLE_ENTER_ON_LIST',
  DRAFTJS_BLOCK_KEY: 'DRAFTJS_BLOCK_KEY',
  DRAG_BUTTON_ID: 'button-drag-block',
  INSERT_BLOCK_MARKER_ID: 'insert-block-marker',
  POSITION_ABOVE: 'POSITION_ABOVE',
  POSITION_AFTER: 'POSITION_AFTER',
  POSITION_BEFORE: 'POSITION_BEFORE',
  POSITION_BELOW: 'POSITION_BELOW',
  SOFT_NEWLINE: 'SOFT_NEWLINE',
};
