import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { callPbjx } from '@gdbots/pbjx/redux/actions';
import schemas from './schemas';
import { pbjxChannelNames } from '../../constants';

export default (dispatch, { picklistId }) => ({
  getPicklist: () => {
    const nodeRef = new NodeRef(schemas.node.getQName(), picklistId);
    const request = schemas.getNodeRequest.createMessage();
    request.set('node_ref', nodeRef);
    return dispatch(callPbjx(request, `${pbjxChannelNames.PICKLIST_PICKER_REQUEST}/${picklistId}`));
  },
});
