import dirtyEditor from '@triniti/cms/plugins/blocksmith/actions/dirtyEditor';
import storeEditor from '@triniti/cms/plugins/blocksmith/actions/storeEditor';
import convertToEditorState from '@triniti/cms/plugins/blocksmith/utils/convertToEditorState';
import Message from '@gdbots/pbj/Message';

export default (dispatch, formName, blocks) => {
  const canvasBlocks = blocks.reduce((accumulator, currentBlock) => {
    if (currentBlock !== null) {
      accumulator.push(Message.fromObject(currentBlock));
    }
    return accumulator;
  }, []);

  const editorState = convertToEditorState(canvasBlocks);
  dispatch(storeEditor(formName, editorState));
  dispatch(dirtyEditor(formName));
};
