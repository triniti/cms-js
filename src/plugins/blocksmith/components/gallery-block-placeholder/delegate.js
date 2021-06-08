import schemas from './schemas';

export default (dispatch) => ({
  /**
   * @param {nodeRef} nodeRef - A node ref to request for
   */
  handleGetGalleryNode: (nodeRef) => {
    dispatch(schemas.getGalleryNodeRequest.createMessage().set('node_ref', nodeRef));
  },
  handleGetImageNode: (nodeRef) => {
    dispatch(schemas.getImageNodeRequest.createMessage().set('node_ref', nodeRef));
  },
});
