import { actionTypes } from 'plugins/raven/constants';
import { getInstance } from '@app/main';
import GetNodeRequestV1 from '@gdbots/schemas/gdbots/ncr/request/GetNodeRequestV1';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import receiveNodes from 'plugins/ncr/actions/receiveNodes';

export default (userRef) => async(dispatch) => {
  const app = getInstance();
  const pbjx = await app.getPbjx();
  const request = GetNodeRequestV1.create()
    .set('consistent_read', true)
    .set('node_ref', NodeRef.fromString(userRef));
  const response = await pbjx.request(request);
  const user = response.get('node');
  dispatch(receiveNodes([ user ]));
  return {
    type: actionTypes.USER_LOADED,
    user,
  }
}