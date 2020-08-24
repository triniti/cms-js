/* eslint-disable-next-line max-len */
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import updateNodeLabels from '../../actions/updateNodeLabels';

export default (dispatch, ownProps) => ({
  handleApplyLabels: (selected) => {
    const { schemas, node } = ownProps;
    const origLabels = node.get('labels', []);
    const addLabels = selected.filter((label) => !origLabels.includes(label));
    const removeLabels = origLabels.filter((label) => !selected.includes(label));

    const command = schemas.updateNodeLabels.createMessage()
      .set('node_ref', NodeRef.fromNode(node))
      .addToSet('add_labels', addLabels)
      .addToSet('remove_labels', removeLabels);

    dispatch(updateNodeLabels(
      command,
      {
        expectedEvent: `${schemas.nodeLabelsUpdated.getCurie()}`,
        schemas,
      },
    ));
  },
});
