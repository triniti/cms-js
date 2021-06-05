import { callPbjx } from '@gdbots/pbjx/redux/actions';
import { pbjxChannelNames } from '../../constants';
import schemas from './schemas';

export default (dispatch) => ({
  /**
   * @param {nodeRef} nodeRef - A node ref to request for
   */
  handleGetArticleNode: (nodeRef) => {
    dispatch(callPbjx(schemas.getArticleNodeRequest.createMessage().set('node_ref', nodeRef), pbjxChannelNames.NODE_REQUEST));
  },
  handleGetImageNode: (nodeRef) => {
    dispatch(schemas.getImageNodeRequest.createMessage().set('node_ref', nodeRef));
  },
});
