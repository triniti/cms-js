import schemas from './schemas';

export default (dispatch) => ({
  /**
   * @param {nodeRef} nodeRef - A node ref to request for
   */
  handleGetNode: (nodeRef) => {
    dispatch(schemas.getNodeRequest.createMessage().set('node_ref', nodeRef));
  },
});
