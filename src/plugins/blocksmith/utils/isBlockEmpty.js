import { blockTypes } from '../constants';

/**
 * Checks if the block is "empty", eg its text is an empty string, or it is a non-atomic block and
 * contains only spaces
 *
 * @param {ContentBlock} block - a draft js block
 *
 * @returns {boolean}
 */

export default (block) => block.getText() === '' || (block.getType() !== blockTypes.ATOMIC && block.getText().match(/^\s+$/));
