import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { Button } from '@triniti/admin-ui-plugin/components';
import BatchEditModal from '@triniti/cms/plugins/dam/components/batch-edit-modal';

import selector from '@triniti/cms/plugins/dam/components/batch-edit-modal/selector';
import delegate from '@triniti/cms/plugins/dam/components/batch-edit-button/delegate';

class BatchEditButton extends React.Component {
  static propTypes = {
    assetIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    children: PropTypes.node,
    handleToggleBatchEdit: PropTypes.func.isRequired,
    getNode: PropTypes.func.isRequired,
    isBatchEditOpen: PropTypes.bool,
    isEditMode: PropTypes.bool,
    nodeRef: PropTypes.instanceOf(NodeRef).isRequired,
  };

  static defaultProps = {
    children: 'Batch Edit',
    isEditMode: false,
    isBatchEditOpen: false,
  };

  constructor(props) {
    super(props);
    this.handleToggleBatchEdit = this.handleToggleBatchEdit.bind(this);
  }

  handleToggleBatchEdit() {
    const {
      isBatchEditOpen,
      handleToggleBatchEdit,
    } = this.props;
    handleToggleBatchEdit(!isBatchEditOpen);
  }

  render() {
    const {
      assetIds,
      children,
      isBatchEditOpen,
      isEditMode,
      getNode,
      nodeRef,
      ...btnProps
    } = this.props;

    return ([
      <Button
        key="a"
        disabled={!isEditMode || !assetIds.length}
        onClick={this.handleToggleBatchEdit}
        {...btnProps}
      >
        {children}
      </Button>,
      isBatchEditOpen // This lazy loads the uploader form only when isBatchEditOpen is set to true
      && (
      <BatchEditModal
        key="b"
        assetIds={assetIds}
        isOpen={isBatchEditOpen}
        node={getNode(nodeRef)}
        nodeRef={nodeRef}
        onToggleBatchEdit={this.handleToggleBatchEdit}
      />
      ),
    ]);
  }
}

export default connect(
  selector,
  delegate,
)(BatchEditButton);
