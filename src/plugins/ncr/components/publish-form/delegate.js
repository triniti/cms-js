/* eslint-disable-next-line max-len */
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import publishNode from '../../actions/publishNode';
import unpublishNode from '../../actions/unpublishNode';
import markNodeAsDraft from '../../actions/markNodeAsDraft';
import markNodeAsPending from '../../actions/markNodeAsPending';

export default (dispatch, ownProps) => ({
  handleMarkNodeAsDraft: () => {
    const { formName, node, schemas } = ownProps;
    const nodeRef = NodeRef.fromNode(node);
    dispatch(markNodeAsDraft(
      schemas.markNodeAsDraft.createMessage({ node_ref: nodeRef }),
      { formName, node, schemas },
    ));
  },

  handleMarkNodeAsPending: () => {
    const { formName, node, schemas } = ownProps;
    const nodeRef = NodeRef.fromNode(node);
    dispatch(markNodeAsPending(
      schemas.markNodeAsPending.createMessage({ node_ref: nodeRef }),
      { formName, node, schemas },
    ));
  },

  handlePublishNow: () => {
    const { formName, node, schemas } = ownProps;
    const nodeRef = NodeRef.fromNode(node);
    dispatch(publishNode(
      schemas.publishNode.createMessage({ node_ref: nodeRef }),
      { formName, node, schemas },
    ));
  },

  handleUnpublish: () => {
    const { formName, node, schemas } = ownProps;
    const nodeRef = NodeRef.fromNode(node);
    dispatch(unpublishNode(
      schemas.unpublishNode.createMessage({ node_ref: nodeRef }),
      { formName, node, schemas },
    ));
  },

  handlePublishSchedule: (publishedAt) => {
    const { formName, node, schemas } = ownProps;
    const nodeRef = NodeRef.fromNode(node);
    dispatch(publishNode(
      schemas.publishNode.createMessage({
        node_ref: nodeRef,
        publish_at: publishedAt,
      }),
      { formName, node, schemas },
    ));
  },
});
