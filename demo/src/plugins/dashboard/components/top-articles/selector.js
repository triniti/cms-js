import createSlug from '@gdbots/common/createSlug';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import SearchArticlesRequestV1 from '@bachelornation/schemas/bachelornation/news/request/SearchArticlesRequestV1';

/**
 * @param {Object} state
 * @param {Object} ownProps
 *
 * @returns {Object}
 */
export default (state, { title }) => getRequest(
  state, SearchArticlesRequestV1.schema().getCurie(), `dashboard-${createSlug(title)}`,
);
