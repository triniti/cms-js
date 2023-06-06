const YOUTUBE_REGEX = new RegExp('youtu\\.?be(.com)?\\/(embed\\/|watch\\?v=)?[\\w\\s-]+');
const FB_POST_REGEX = new RegExp('(?:(?:https?:)?\\/\\/)?(?:www\\.)?facebook\\.com\\/[a-zA-Z0-9\\.]+\\/posts\\/(?:[a-z0-9\\.]+\\/)?([0-9]+)\\/?(?:\\?.*)?');

/**
 * Determines if any of the other blocks can be used instead
 *
 * @param {string} input
 *
 * @returns {string} Block type
 * @todo this method needs to be extended with other block checks
 */
export default (input) => {
  let match = '';
  if (YOUTUBE_REGEX.test(input)) {
    match = 'YouTube';
  }

  if (FB_POST_REGEX.test(input)) {
    match = 'Facebook Post';
  }
  return match;
};