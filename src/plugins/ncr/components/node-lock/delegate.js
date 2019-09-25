import inflection from 'inflection';
import swal from 'sweetalert2';

import sendAlert from '@triniti/admin-ui-plugin/actions/sendAlert';
import clearResponse from '@triniti/cms/plugins/pbjx/actions/clearResponse';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

import lockNode from '../../actions/lockNode';
import unLockNode from '../../actions/unlockNode';

export default (dispatch, {
  node,
  nodeLabel = 'Node',
  schemas,
}) => ({
  handleUnlock: async (unlockButtonText) => {
    const result = await swal.fire({
      cancelButtonText: 'Cancel',
      confirmButtonText: unlockButtonText,
      showCancelButton: true,
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn btn-secondary',
      text: `${nodeLabel} will be unlocked from other users.`,
      title: 'Are you sure?',
      type: 'warning',
      reverseButtons: true,
    });

    if (result.value && node) {
      dispatch(unLockNode(schemas.unlockNode.createMessage({
        node_ref: NodeRef.fromNode(node),
      }), { nodeLabel, schemas }));
    }
  },

  handleLock: async (lockButtonText) => {
    const result = await swal.fire({
      cancelButtonText: 'Cancel',
      confirmButtonText: lockButtonText,
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn btn-secondary',
      showCancelButton: true,
      text: `${nodeLabel} will be locked from other users.`,
      title: 'Are you sure?',
      type: 'warning',
      reverseButtons: true,
    });

    if (result.value && node) {
      dispatch(lockNode(schemas.lockNode.createMessage({
        node_ref: NodeRef.fromNode(node),
      }), { nodeLabel, schemas }));
    }
  },

  handleRedirect: () => {
    dispatch(sendAlert({
      isDismissible: true,
      message: `${nodeLabel} is locked.`,
      type: 'danger',
    }));
    dispatch(clearResponse(schemas.getNodeRequest.getCurie()));
    const curie = schemas.node.getCurie();
    return `/${curie.getPackage()}/${inflection.pluralize(curie.getMessage())}`; // fixme:: need a better solution for redirect link
  },
});
