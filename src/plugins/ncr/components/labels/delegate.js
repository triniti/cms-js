/* eslint-disable-next-line max-len */
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import updateNodeLabels from '../../actions/updateNodeLabels';

export default (dispatch, ownProps) => ({
  handleApplyLabels: (selected) => {
    const { formName, schemas, node } = ownProps;
    const updatedNode = node.clone();
    updatedNode.clear('labels');
    updatedNode.addToSet('labels', selected);

    const command = schemas.updateNode.createMessage({
      node_ref: NodeRef.fromNode(node),
      old_node: node.freeze(),
      new_node: updatedNode,
      paths: ['labels'],
    });

    dispatch(updateNodeLabels(
      command,
      { formName, node, schemas },
    ));
  },
});
