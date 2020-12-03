import cleanEditor from '../../actions/cleanEditor';
import copyBlock from '../../actions/copyBlock';
import dirtyEditor from '../../actions/dirtyEditor';
import storeEditor from '../../actions/storeEditor';

export default (dispatch, { formName }) => ({
  handleCleanEditor: () => dispatch(cleanEditor(formName)),
  handleCopyBlock: (block) => dispatch(copyBlock(block)),
  handleDirtyEditor: () => dispatch(dirtyEditor(formName)),
  handleStoreEditor: (editorState) => dispatch(storeEditor(formName, editorState)),
});
