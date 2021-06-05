import schemas from './schemas';

export default (dispatch) => ({
  /**
   * @param {nodeRef} nodeRef - A node ref to request for
   */
  handleGetImageNode: (nodeRef) => {
    dispatch(schemas.getImageNodeRequest.createMessage().set('node_ref', nodeRef));
  },
  handleGetVideoNode: (nodeRef) => {
    dispatch(schemas.getVideoNodeRequest.createMessage().set('node_ref', nodeRef));
  },
});
