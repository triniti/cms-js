import dirtyEditor from '@triniti/cms/plugins/blocksmith/actions/dirtyEditor';
import storeEditor from '@triniti/cms/plugins/blocksmith/actions/storeEditor';

export default (dispatch, { formName }) => ({
  handleDirtyEditor: () => dispatch(dirtyEditor(formName)),
  handleStoreEditor: (editorState) => dispatch(storeEditor(formName, editorState)),
});
