import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import { Button, Checkbox, Icon, RouterLink } from '@triniti/admin-ui-plugin/components';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import convertReadableTime from '@triniti/cms/utils/convertReadableTime';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import pbjUrl from '@gdbots/pbjx/pbjUrl';

import delegate from './delegate';

const TableRow = ({ disabled, handleCloneNode, node, onSelectRow, isSelected }) => (
  <tr className={`status-${node.get('status')}`}>
    <th scope="row">
      <Checkbox
        disabled={disabled}
        id={NodeRef.fromNode(node)}
        onChange={() => onSelectRow(NodeRef.fromNode(node))}
        checked={isSelected}
        size="sm"
      />
    </th>
    <td>
      {node.get('title')}
      <Collaborators nodeRef={NodeRef.fromNode(node)} />
    </td>
    <td>{node.has('slotting')
      ? Object.entries(node.get('slotting')).map(([key, slot]) => (
        <span key={`${key}:${slot}`}>{key}:{slot} </span>
      ))
      : null}
    </td>
    <td className="text-nowrap">{convertReadableTime(node.get('order_date'))}</td>
    <td className="text-nowrap">
      {node.has('published_at') && convertReadableTime(node.get('published_at'))}
    </td>
    <td className="td-icons">
      <RouterLink to={pbjUrl(node, 'cms')}>
        <Button id={`view-${node.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
          <Icon imgSrc="eye" alt="view" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`view-${node.get('_id')}`}>View</UncontrolledTooltip>
      </RouterLink>
      <RouterLink to={`${pbjUrl(node, 'cms')}/edit`}>
        <Button id={`edit-${node.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
          <Icon imgSrc="pencil" alt="edit" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`edit-${node.get('_id')}`}>Edit</UncontrolledTooltip>
      </RouterLink>
      <a
        href={pbjUrl(node, 'canonical')}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button color="hover" id={`open-in-new-tab-${node.get('_id')}`} radius="circle" className="mr-1 mb-0">
          <Icon imgSrc="external" alt="open" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`open-in-new-tab-${node.get('_id')}`}>Open in new tab</UncontrolledTooltip>
      </a>
      <Button onClick={handleCloneNode} id={`clone-${node.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
        <Icon imgSrc="documents" alt="clone" />
      </Button>
      <UncontrolledTooltip placement="auto" target={`clone-${node.get('_id')}`}>Clone</UncontrolledTooltip>
    </td>
  </tr>
);

TableRow.propTypes = {
  disabled: PropTypes.bool,
  handleCloneNode: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  onSelectRow: PropTypes.func.isRequired,
};

TableRow.defaultProps = {
  disabled: false,
  isSelected: false,
};

export default connect(null, delegate)(TableRow);
