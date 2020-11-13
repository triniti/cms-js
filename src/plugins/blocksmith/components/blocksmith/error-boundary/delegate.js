import storeEditor from '@triniti/cms/plugins/blocksmith/actions/storeEditor';

export default (dispatch, { formName }) => ({
  handleStoreEditor: (editorState) => dispatch(storeEditor(formName, editorState)),
});
