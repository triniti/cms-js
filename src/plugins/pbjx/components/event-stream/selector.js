import isGranted from '@triniti/cms/plugins/iam/selectors/isGranted';

/**
 * @param {Object} state     - The entire redux state.
 *
 * @returns {Object}
 */
export default (state) => {
  const isRevertGranted = isGranted(state, 'cms-history-revert');

  return {
    isRevertGranted,
  };
};
