import { EditorState } from 'draft-js';

import getEditorState from '@triniti/cms/plugins/blocksmith/selectors/getEditorState';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

/**
 * @param {Object} state - The entire redux state.
 * @param {Object} { formName }
 * @returns {Object}
 */
export default (state, { formName }) => ({
  editorState: getEditorState(state, formName) || EditorState.createEmpty(),
  getNode: (nodeRef) => getNode(state, nodeRef),
});
