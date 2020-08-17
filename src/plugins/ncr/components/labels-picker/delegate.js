/* eslint-disable-next-line max-len */
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import updateNodeLabels from '../../actions/updateNodeLabels';

export default (dispatch, ownProps) => ({
  handleApplyLabels: (selected) => {
    const { formName, schemas, node } = ownProps;
    const origLabels = node.get('labels', []);
    const addLabels = selected.filter((label) => origLabels.indexOf(label) === -1);
    const removeLabels = origLabels.filter((label) => selected.indexOf(label) === -1);

    const command = schemas.updateNodeLabels.fromObject({
      node_ref: NodeRef.fromNode(node),
      add_labels: addLabels,
      remove_labels: removeLabels,
    });

    dispatch(updateNodeLabels(
      command,
      {
        expectedEvent: `${schemas.nodeLabelsUpdated.getCurie()}`,
        formName,
        node,
        schemas,
      },
    ));
  },
});
