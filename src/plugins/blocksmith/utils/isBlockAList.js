/**
 * Checks if the provided block is a list
 *
 * @param {ContentBlock} contentBlock - a DraftJs ContentBlock
 *
 * @returns {boolean}
 */

export default (contentBlock) => /^(?:un)?ordered-list-item$/.test(contentBlock.getType());
