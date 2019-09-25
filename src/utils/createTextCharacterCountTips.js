import isNumber from 'lodash/isNumber';
/**
 * @param {String} value - a string value from redux form
 * @param {Integer} maxCount - same as maxLength for a html input field
 * @param {Integer} warningCount - the recommended character count for the field
 *
 * @returns {String || Null}
 */
export default (value, maxCount, warningCount = Number.MAX_SAFE_INTEGER) => {
  if (!isNumber(maxCount)) {
    return null;
  }

  const charactersRemainingStr = 'characters remaining';
  if (!value) {
    return `${maxCount} ${charactersRemainingStr}.`;
  }

  const charactersExceedRecommendationStr = 'characters exceed recommendation';
  const charactersRemaining = maxCount - value.length;
  if (isNumber(warningCount) && value.length > warningCount) {
    return `${charactersRemaining} ${charactersRemainingStr}. ${value.length - warningCount} ${charactersExceedRecommendationStr}.`;
  }

  return `${charactersRemaining} ${charactersRemainingStr}.`;
};
