import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import { STATUS_PENDING } from '@triniti/app/constants';

/**
 * if we do the standard thing and pass through the getNode anonymous function, the heartbeat
 * will cause the whole component to re-render which sucks. keyed by curie because there can be
 * more than one on the page at the same time and the heartbeat kicks em all.
 */
const cache = {};
const getMemoizedValues = (curie, key, fields, optionsMapper) => {
  if (cache[curie] && cache[curie][key]) {
    return cache[curie][key];
  }
  cache[curie] = {};
  cache[curie][key] = fields.map(optionsMapper);
  return cache[curie][key];
};

/**
 * @param {Object} state - The entire redux state.
 * @param {Object} ownProps
 *
 * @returns {Object}
 */
export default (state, { constants, fields, schemas, isGetAll, optionsMapper = null }) => {
  const curie = isGetAll ? schemas.getAll.getCurie() : schemas.searchNodes.getCurie();
  const { response, status } = getRequest(state, curie, constants.CHANNEL_NAME);
  const allFields = (fields ? (fields.getAll() || []) : []);
  const cacheKey = `${!response ? '' : response.get('response_id')}-${allFields.reduce((acc, cur) => (acc + cur), '')}`;

  const value = getMemoizedValues(
    curie.toString(),
    cacheKey,
    allFields,
    optionsMapper || ((nodeRef) => {
      const node = getNode(state, nodeRef);
      return {
        label: node ? node.get('title') : '',
        node,
        value: nodeRef,
      };
    }),
  );

  return {
    isLoading: status === STATUS_PENDING,
    value,
    response,
  };
};
