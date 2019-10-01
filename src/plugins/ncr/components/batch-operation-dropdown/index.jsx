import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import {
  Badge,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from '@triniti/admin-ui-plugin/components';

import selector from './selector';
import delegateFactory from './delegate';
import { searchViewTypes } from '../../constants';

const { TABLE } = searchViewTypes;

export const BatchOperationDropdown = ({
  canDeleteNode,
  canMarkNodeAsDraft,
  canPublishNode,
  className,
  delegate,
  disabled,
  nodeRefs,
  onUnSelectAllRows,
  view,
}) => (
  <div className={classNames(className, 'float-right')}>
    {nodeRefs.length > 0 && view === TABLE
    && (
      <UncontrolledButtonDropdown>
        <DropdownToggle
          outline
          size="sm"
          onClick={(e) => e.preventDefault()}
          className="px-3 mr-2 mb-0 float-right"
        >
          Selected
          <Badge color="danger" alert>{nodeRefs.length}</Badge>
        </DropdownToggle>

        <DropdownMenu right>
          <DropdownItem header>Select Actions</DropdownItem>
          {canDeleteNode
          && (
            <DropdownItem
              disabled={disabled}
              onClick={delegate.handleBatchDelete}
            >
              Delete
            </DropdownItem>
          )}
          {canPublishNode
          && (
            <DropdownItem
              disabled={disabled}
              onClick={delegate.handleBatchPublish}
            >
              Publish
            </DropdownItem>
          )}
          {canMarkNodeAsDraft
          && (
            <DropdownItem
              disabled={disabled}
              onClick={delegate.handleBatchMarkAsDraft}
            >
              Mark As Draft
            </DropdownItem>
          )}
          {onUnSelectAllRows && <DropdownItem divider />}
          {onUnSelectAllRows
          && (
            <DropdownItem
              disabled={disabled}
              onClick={onUnSelectAllRows}
            >
              Unselect All
            </DropdownItem>
          )}
        </DropdownMenu>
      </UncontrolledButtonDropdown>
    )}
  </div>
);

BatchOperationDropdown.propTypes = {
  canDeleteNode: PropTypes.bool.isRequired,
  canMarkNodeAsDraft: PropTypes.bool,
  canPublishNode: PropTypes.bool,
  className: PropTypes.string,
  delegate: PropTypes.shape({
    handleBatchPublish: PropTypes.func.isRequired,
    handleBatchDelete: PropTypes.func.isRequired,
    handleBatchMarkAsDraft: PropTypes.func.isRequired,
  }).isRequired,
  disabled: PropTypes.bool,
  onUnSelectAllRows: PropTypes.func.isRequired,
  nodeRefs: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
  view: PropTypes.string,
};

BatchOperationDropdown.defaultProps = {
  canMarkNodeAsDraft: false,
  canPublishNode: false,
  className: null,
  disabled: true,
  nodeRefs: [],
  view: TABLE,
};

export default connect(selector, createDelegateFactory(delegateFactory))(BatchOperationDropdown);
