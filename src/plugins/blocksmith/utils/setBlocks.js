import dirtyEditor from '@triniti/cms/plugins/blocksmith/actions/dirtyEditor';
import storeEditor from '@triniti/cms/plugins/blocksmith/actions/storeEditor';
import convertToEditorState from '@triniti/cms/plugins/blocksmith/utils/convertToEditorState';

export default (dispatch, formName, blocks) => {
  const editorState = convertToEditorState(blocks);
  dispatch(storeEditor(formName, editorState));
  dispatch(dirtyEditor(formName));
};
