import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import schemas from './schemas';

/**
 * @param {Object} state - The entire redux state.
 *
 * @returns {Object}
 */
export default (state) => {
  const { response } = getRequest(state, schemas.suggestHashtags.getCurie());

  return {
    response,
  };
};
