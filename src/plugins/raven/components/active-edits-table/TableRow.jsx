import PropTypes from 'prop-types';
import React from 'react';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import { Button, Icon, RouterLink } from '@triniti/admin-ui-plugin/components';

const TableRow = ({ idx, node }) => (
  <tr className={`status-${node.get('status')}`} key={node.get('_id')}>
    <td style={{ width: '1px', textAlign: 'right' }}>{idx + 1}.</td>
    <td>
      {node.get('title')}
      <Collaborators nodeRef={NodeRef.fromNode(node)} />
    </td>
    <td>
      {node.get('is_locked') && <Icon imgSrc="locked-solid" alt="locked-status" />}
    </td>
    <td>{node.schema().getCurie().getMessage()}</td>

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
        rel="noopener noreferrer"
        target="_blank"
      >
        <Button id={`open-in-new-tab-${node.get('_id')}`} color="hover" radius="circle" className="mr-1 mb-0">
          <Icon imgSrc="external" alt="open" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`open-in-new-tab-${node.get('_id')}`}>Open in new tab</UncontrolledTooltip>
      </a>
    </td>
  </tr>
);

TableRow.propTypes = {
  node: PropTypes.instanceOf(Message).isRequired,
  idx: PropTypes.number.isRequired,
};

export default TableRow;
