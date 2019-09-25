/**
 * Checks if the provided block is a list
 *
 * @param {ContentBlock} contentBlock - a DraftJs ContentBlock
 *
 * @returns {boolean}
 */

export default (contentBlock) => (contentBlock.getType() === 'ordered-list-item' || contentBlock.getType() === 'unordered-list-item');
