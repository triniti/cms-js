import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import { STATUS_PENDING } from '@triniti/app/constants';

/**
 * if we do the standard thing and pass through the getNode anonymous function, the heartbeat
 * will cause the whole component to re-render which sucks.
 */
let cache = {};
const getMemoizedValues = (key, fields, optionsMapper) => {
  if (cache[key]) {
    return cache[key];
  }
  cache = {};
  cache[key] = fields.map(optionsMapper);
  return cache[key];
};

/**
 * @param {Object} state - The entire redux state.
 *
 * @returns {Object}
 */
export default (state, { constants, fields, schemas, isGetAll, optionsMapper = null }) => {
  const curie = isGetAll ? schemas.getAll.getCurie() : schemas.searchNodes.getCurie();
  const { response, status } = getRequest(state, curie, constants.CHANNEL_NAME);
  const allFields = (fields ? (fields.getAll() || []) : []);
  const cacheKey = `${!response ? '' : response.get('response_id')}-${allFields.reduce((acc, cur) => (acc + cur), '')}`;

  const value = getMemoizedValues(
    cacheKey,
    allFields,
    optionsMapper || ((nodeRef) => ({
      label: getNode(state, nodeRef).get('title'),
      value: nodeRef,
      node: getNode(state, nodeRef),
    })),
  );

  return {
    isLoading: status === STATUS_PENDING,
    value,
    response,
  };
};
