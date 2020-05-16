import clearResponse from '@triniti/cms/plugins/pbjx/actions/clearResponse';
import storeEditor from '@triniti/cms/plugins/blocksmith/actions/storeEditor';
import convertToEditorState from '@triniti/cms/plugins/blocksmith/utils/convertToEditorState';
import Message from '@gdbots/pbj/Message';
import { change } from 'redux-form';
import camelCase from 'lodash/camelCase';

export default (dispatch) => ({
  /**
   * Initializes the container.
   *
   * This is needed because state is not wiped out
   * when components/container are unmounted.
   *
   * @param {StreamId} streamId - An instance of StreamId
   * @param {Schema} schema - An instance of Schema to use to create requests.
   */
  handleInitialize: (streamId, schema) => {
    dispatch(schema.createMessage().set('stream_id', streamId));
  },

  /**
   * Handles load more events.
   *
   * @param {StreamId} streamId - An instance of StreamId
   * @param {Schema} schema - An instance of Schema to use to create requests.
   * @param {string} since - Return events since this time.
   */
  handleLoadMore: (streamId, schema, since) => {
    dispatch(schema.createMessage({
      stream_id: streamId,
      since,
    }));
  },

  handleRevert: (formName, selected) => {
    selected.forEach((item) => {
      const { id, value } = item;
      if (id === 'blocks') {
        const canvasBlocks = value.filter(item => item !== null).map(item => Message.fromObject(item));
        const editorState = convertToEditorState(canvasBlocks);
        dispatch(storeEditor(formName, editorState, true));
      } else {
        dispatch(change(formName, camelCase(id), value));
      }
    });
  },

  /**
   * @param {Schema} schema - An instance of Schema to use to create requests.
   */
  componentWillUnmount: (schema) => {
    dispatch(clearResponse(schema.getCurie()));
  },
});
