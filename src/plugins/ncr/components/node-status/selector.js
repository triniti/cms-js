import moment from 'moment';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

/**
 * @param {Object} state     - The entire redux state.
 * @param {Object} ownProps  - Props given to the container.
 *
 * @returns {Object}
 */
export default (state, { node }) => {
  const updatedAt = node.get('updated_at', node.get('created_at')).toMoment();
  const secondsAgo = moment().diff(updatedAt, 's');
  const updatedAgo = secondsAgo < 60 ? `${secondsAgo} seconds ago` : updatedAt.fromNow();
  let user = null;

  if (node.has('updater_ref') || node.has('creator_ref')) {
    user = getNode(state, NodeRef.fromMessageRef(node.get('updater_ref', node.get('creator_ref'))));
  }

  return {
    updatedAgo,
    user,
  };
};
