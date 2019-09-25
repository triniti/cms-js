let blockParentNode;

function check() {
  if (!blockParentNode) {
    blockParentNode = document.querySelector('[data-contents="true"]');
  }
}

/**
 * Utils for getting the block parent node (the parent div of the blocks) and determining
 * if a provided element is the block parent node. Regularly used to determine
 * sidebar/button behavior and styling, among other things.
 */
export default {
  /**
   * Clears the cached element
   */
  clearCache() {
    blockParentNode = null;
  },
  /**
   * Returns the blockParentNode
   *
   * @returns {HTMLElement}
   */
  get() {
    check();
    return blockParentNode;
  },
  /**
   * Checks if the target is contained by the block parent node
   *
   * @param {Node} target - a dom node that might be part of the sidebar icon
   *
   * @returns {boolean}
   */
  contains(target) {
    check();
    return blockParentNode.contains(target) && target !== blockParentNode;
  },
  /**
   * Checks if the target is the block parent node
   *
   * @param {Node} target - a dom node that might be part of the sidebar icon
   *
   * @returns {boolean}
   */
  is(target) {
    check();
    return blockParentNode === target;
  },
};
