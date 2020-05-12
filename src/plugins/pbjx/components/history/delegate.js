import clearResponse from '@triniti/cms/plugins/pbjx/actions/clearResponse';
import { change } from 'redux-form';

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
    selected.forEach(item => {
      const { id, value } = item;
      dispatch(change(formName, id, value));
    });
  },

  /**
   * @param {Schema} schema - An instance of Schema to use to create requests.
   */
  componentWillUnmount: (schema) => {
    dispatch(clearResponse(schema.getCurie()));
  },
});
