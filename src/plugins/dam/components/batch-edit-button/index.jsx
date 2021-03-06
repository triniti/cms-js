import React from 'react';
import PropTypes from 'prop-types';

import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { Button } from '@triniti/admin-ui-plugin/components';
import BatchEditModal from '@triniti/cms/plugins/dam/components/batch-edit-modal';

export default class BatchEditButton extends React.Component {
  static propTypes = {
    assetIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    children: PropTypes.node,
    isEditMode: PropTypes.bool,
    nodeRef: PropTypes.instanceOf(NodeRef).isRequired,
  };

  static defaultProps = {
    children: 'Batch Edit',
    isEditMode: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      isBatchEditOpen: false,
    };

    this.handleToggleBatchEdit = this.handleToggleBatchEdit.bind(this);
  }

  handleToggleBatchEdit() {
    this.setState(({ isBatchEditOpen }) => ({ isBatchEditOpen: !isBatchEditOpen }));
  }

  render() {
    const {
      assetIds,
      children,
      isEditMode,
      nodeRef,
      ...btnProps
    } = this.props;

    const {
      isBatchEditOpen,
    } = this.state;

    return (
      <>
        <Button
          disabled={!isEditMode || !assetIds.length}
          onClick={this.handleToggleBatchEdit}
          {...btnProps}
        >
          {children}
        </Button>
        {isBatchEditOpen
        && (
        <BatchEditModal
          assetIds={assetIds}
          isOpen={isBatchEditOpen}
          nodeRef={nodeRef}
          onToggleBatchEdit={this.handleToggleBatchEdit}
        />
        )}
      </>
    );
  }
}
