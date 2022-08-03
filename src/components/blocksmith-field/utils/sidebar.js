let innerSidebar;
let sidebar;

/**
 * Utils for determining if a provided element is the sidebar or part of the sidebar.
 * Regularly used to determine sidebar/button behavior and styling.
 */
export default {
  /**
   * Clears the cached elements
   */
  clearCache: () => {
    innerSidebar = null;
    sidebar = null;
  },
  /**
   * Checks if the target is part of the inner sidebar
   *
   * @param {HTMLElement} target - a dom node that might be part of the sidebar icon
   *
   * @returns {boolean}
   */
  isInnerSidebar: (target) => {
    if (!innerSidebar) {
      innerSidebar = document.querySelector('.sidebar-holder > div');
    }
    return innerSidebar === target;
  },
  /**
   * Checks if the target is part of sidebar
   *
   * @param {HTMLElement} target - a dom node that might be part of the sidebar icon
   *
   * @returns {boolean}
   */
  isSidebar: (target) => {
    if (!sidebar) {
      sidebar = document.querySelector('.sidebar-holder');
    }
    return sidebar === target || sidebar.contains(target);
  },
};
