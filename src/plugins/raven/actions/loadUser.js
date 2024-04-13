import { actionTypes } from '@triniti/cms/plugins/raven/constants';
import GetNodeRequestV1 from '@gdbots/schemas/gdbots/ncr/request/GetNodeRequestV1';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import receiveNodes from '@triniti/cms/plugins/ncr/actions/receiveNodes';
import hasNode from '@triniti/cms/plugins/ncr/selectors/hasNode';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

export default (userRef) => async(dispatch, getState, app) => {
  const state = getState();
  let user;
  if (hasNode(state, userRef)) {
    user = getNode(state, userRef);
  } else {
    const pbjx = await app.getPbjx();
    const request = GetNodeRequestV1.create()
      .set('consistent_read', true)
      .set('node_ref', NodeRef.fromString(userRef));
    const response = await pbjx.request(request);
    user = response.get('node');
    dispatch(receiveNodes([ user ]));
  }
  return {
    type: actionTypes.USER_LOADED,
    user,
  }
}