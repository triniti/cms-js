import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

export default (state) => ({
  getNode: (nodeRef) => getNode(state, nodeRef),
});
