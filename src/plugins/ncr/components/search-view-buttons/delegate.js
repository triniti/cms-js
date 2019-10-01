import searchNodesViewChanged from '../../actions/searchNodesViewChanged';

export default (dispatch, { schema: searchNodes }) => ({
  handleChangeView: (view) => dispatch(searchNodesViewChanged(searchNodes.getCurie(), view)),
});
