import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { Button } from '@triniti/admin-ui-plugin/components';
import BatchEdit from '@triniti/cms/plugins/dam/components/batch-edit';

import createDelegateFactory from '@triniti/app/createDelegateFactory';
import delegateFactory from '@triniti/cms/plugins/dam/components/batch-edit/delegate';
import selector from '@triniti/cms/plugins/dam/components/batch-edit/selector';

class BatchEditButton extends React.Component {
  static propTypes = {
    assetIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    children: PropTypes.node,
    delegate: PropTypes.shape({
      handleToggleBatchEdit: PropTypes.func.isRequired,
    }).isRequired,
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
      delegate,
      isBatchEditOpen,
    } = this.props;
    console.log('class:handleToggleBatchEdit:', !isBatchEditOpen);
    delegate.handleToggleBatchEdit(!isBatchEditOpen);
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

    console.log('Is batch edit open?', isBatchEditOpen);

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
      <BatchEdit
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
  createDelegateFactory(delegateFactory),
)(BatchEditButton);
