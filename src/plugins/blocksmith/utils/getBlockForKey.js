import normalizeKey from './normalizeKey';

/**
 * Gets a block by its key. Just like ContentState.getBlockForKey but this allows
 * submitting dom keys (ie 'asdf-0-0' when the block's api key is 'asdf').
 *
 * @param {ContentState} contentState - a state instance of a DraftJs Editor
 * @param {string}       key          - a block, a block index, or a block key
 *
 * @returns {?ContentBlock}
 */
export default (contentState, key) => contentState.getBlockForKey(normalizeKey(key));
