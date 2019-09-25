import inflection from 'inflection';
import swal from 'sweetalert2';

import batchPublishNodes from '../../actions/batchPublishNodes';
import batchDeleteNodes from '../../actions/batchDeleteNodes';
import batchMarkNodesAsDraft from '../../actions/batchMarkNodesAsDraft';

export default (dispatch, {
  nodeRefs = [],
  schemas,
  actions = { deleteNode: {}, publishNode: {}, markNodeAsDraft: {} },
  nodeLabel = 'nodes',
}) => ({
  handleBatchPublish: async () => {
    const result = await swal.fire({
      title: 'Are you sure?',
      text: `${nodeRefs.length} ${nodeRefs.length === 1 ? nodeLabel : inflection.pluralize(nodeLabel)} will be published!`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, publish ${nodeRefs.length === 1 ? `selected ${nodeLabel}` : `all selected ${inflection.pluralize(nodeLabel)}`}.`,
      reverseButtons: true,
    });
    if (result.value) {
      dispatch(batchPublishNodes(nodeRefs, {
        nodeSchema: schemas.publishNode,
        expectedNodeSchema: schemas.nodePublished,
        getNodeRequestSchema: schemas.getNodeRequest,
        notGrantedMessage: actions.publishNode.notGrantedMessage || 'Error: Not authorized to perform batch operation.',
        delay: actions.publishNode.delay || 0,
      }));
    }
  },

  handleBatchDelete: async () => {
    const result = await swal.fire({
      title: 'Are you sure?',
      text: `${nodeRefs.length} ${nodeRefs.length === 1 ? nodeLabel : inflection.pluralize(nodeLabel)} will be processed for deletion!`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, delete ${nodeRefs.length === 1 ? `selected ${nodeLabel}` : `all selected ${inflection.pluralize(nodeLabel)}`}.`,
    });
    if (result.value) {
      dispatch(batchDeleteNodes(nodeRefs, {
        nodeSchema: schemas.deleteNode,
        expectedNodeSchema: schemas.nodeDeleted,
        getNodeRequestSchema: schemas.getNodeRequest,
        notGrantedMessage: actions.deleteNode.notGrantedMessage || 'Error: Not authorized to perform batch operation.',
        delay: actions.deleteNode.delay || 0,
      }));
    }
  },

  handleBatchMarkAsDraft: async () => {
    const result = await swal.fire({
      title: 'Are you sure?',
      text: `${nodeRefs.length} ${nodeRefs.length === 1 ? nodeLabel : inflection.pluralize(nodeLabel)} will be marked as draft!`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, mark ${nodeRefs.length === 1 ? `selected ${nodeLabel}` : `all selected ${inflection.pluralize(nodeLabel)}`} as draft.`,
    });
    if (result.value) {
      dispatch(batchMarkNodesAsDraft(nodeRefs, {
        nodeSchema: schemas.markNodeAsDraft,
        expectedNodeSchema: schemas.nodeMarkedAsDraft,
        getNodeRequestSchema: schemas.getNodeRequest,
        notGrantedMessage: actions.markNodeAsDraft.notGrantedMessage || 'Error: Not authorized to perform batch operation.',
        delay: actions.markNodeAsDraft.delay || 0,
      }));
    }
  },
});
