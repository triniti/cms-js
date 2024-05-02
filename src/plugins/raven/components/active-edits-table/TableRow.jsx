import React from 'react';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.jsx';
import Message from '@gdbots/pbj/Message.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import { Icon, RouterLink, UncontrolledTooltip } from '@triniti/cms/components/index.js';
import { Button } from 'reactstrap';

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
      <RouterLink to={nodeUrl(node, 'view')}>
        <Button id={`view-${node.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
          <Icon imgSrc="eye" alt="view" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`view-${node.get('_id')}`}>View</UncontrolledTooltip>
      </RouterLink>
      <RouterLink to={`${nodeUrl(node, 'edit')}`}>
        <Button id={`edit-${node.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
          <Icon imgSrc="pencil" alt="edit" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`edit-${node.get('_id')}`}>Edit</UncontrolledTooltip>
      </RouterLink>
      <a
        href={nodeUrl(node, 'canonical')}
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
