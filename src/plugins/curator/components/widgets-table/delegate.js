import cloneNode from '@triniti/cms/plugins/ncr/actions/cloneNode';

export default (dispatch, { history, node }) => ({
  handleCloneNode: () => {
    dispatch(cloneNode(node, history));
  },
});
