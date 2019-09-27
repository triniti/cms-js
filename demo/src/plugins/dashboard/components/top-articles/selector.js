import createSlug from '@gdbots/common/createSlug';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import { SearchArticlesRequest } from '../../../../../schemas';

/**
 * @param {Object} state
 * @param {Object} ownProps
 *
 * @returns {Object}
 */
export default (state, { title }) => getRequest(
  state, SearchArticlesRequest.schema().getCurie(), `dashboard-${createSlug(title)}`,
);
