/* eslint-disable-next-line max-len */
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import UpdateNodeLabelsV1 from '@gdbots/schemas/gdbots/ncr/command/UpdateNodeLabelsV1';
import updateNodeLabels from '../../actions/updateNodeLabels';

export default (dispatch, ownProps) => ({
  handleApplyLabels: (selected) => {
    const { schemas, node } = ownProps;
    const origLabels = node.get('labels', []);
    const addLabels = selected.filter((label) => !origLabels.includes(label));
    const removeLabels = origLabels.filter((label) => !selected.includes(label));

    const command = UpdateNodeLabelsV1.fromObject({
      node_ref: `${NodeRef.fromNode(node)}`,
      add_labels: addLabels,
      remove_labels: removeLabels,
    });

    dispatch(updateNodeLabels(
      command,
      {
        expectedEvent: 'gdbots:ncr:event:node-labels-updated',
        schemas,
      },
    ));
  },
});
