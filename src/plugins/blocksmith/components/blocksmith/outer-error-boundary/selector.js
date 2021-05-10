import getEditorState from '@triniti/cms/plugins/blocksmith/selectors/getEditorState';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

/**
 * @param {Object} state - The entire redux state.
 *
 * @returns {Object}
 */
export default (state, { formName }) => ({
  editorState: getEditorState(state, formName),
  getNode: (nodeRef) => getNode(state, nodeRef),
});
