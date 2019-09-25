let inlineToolbar;

/**
 * Inline toolbar selector cache util
 */
export default {
  /**
   * Clears the cached element
   */
  clearCache: () => {
    inlineToolbar = null;
  },
  /**
   * Gets the inline toolbar, caches it if not already done
   *
   * @returns {HTMLElement}
   */
  get: () => {
    if (!inlineToolbar) {
      inlineToolbar = document.querySelector('.inline-toolbar');
    }
    return inlineToolbar;
  },
};
