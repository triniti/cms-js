import clearResponse from '@triniti/cms/plugins/pbjx/actions/clearResponse';

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
   * @param {Schema} schema - An instance of Schema to use to create requests.
   */
  componentWillUnmount: (schema) => {
    dispatch(clearResponse(schema.getCurie()));
  },
});
