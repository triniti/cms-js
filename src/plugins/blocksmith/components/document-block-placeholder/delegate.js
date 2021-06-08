import schemas from './schemas';

export default (dispatch) => ({
  /**
   * @param {nodeRef} nodeRef - A node ref to request for
   */
  handleGetDocumentNode: (nodeRef) => {
    dispatch(schemas.getDocumentNodeRequest.createMessage().set('node_ref', nodeRef));
  },
  handleGetImageNode: (nodeRef) => {
    dispatch(schemas.getImageNodeRequest.createMessage().set('node_ref', nodeRef));
  },
});
