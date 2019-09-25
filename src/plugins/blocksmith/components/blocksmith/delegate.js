import cleanEditor from '../../actions/cleanEditor';
import copyBlock from '../../actions/copyBlock';
import dirtyEditor from '../../actions/dirtyEditor';
import storeEditor from '../../actions/storeEditor';

export default (dispatch) => ({
  handleCleanEditor: (formName) => dispatch(cleanEditor(formName)),
  handleCopyBlock: (block) => dispatch(copyBlock(block)),
  handleDirtyEditor: (formName) => dispatch(dirtyEditor(formName)),
  handleStoreEditor: (formName, editorState) => dispatch(storeEditor(formName, editorState)),
});
