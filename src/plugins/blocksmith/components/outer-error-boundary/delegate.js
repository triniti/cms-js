import dirtyEditor from '../../actions/dirtyEditor';
import storeEditor from '../../actions/storeEditor';

export default (dispatch, { formName }) => ({
  handleDirtyEditor: () => dispatch(dirtyEditor(formName)),
  handleStoreEditor: (editorState) => dispatch(storeEditor(formName, editorState)),
});
