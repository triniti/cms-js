import schemas from './schemas';

export default (dispatch) => ({
  /**
   * @param {nodeRef} nodeRef - A node ref to request for
   */
  handleGetPollNode: (nodeRef) => {
    dispatch(schemas.getPollNodeRequest.createMessage().set('node_ref', nodeRef));
  },
});
