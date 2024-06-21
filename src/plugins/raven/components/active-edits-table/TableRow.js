import React from 'react';
import { useNavigate } from 'react-router-dom';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import { Icon, RouterLink, UncontrolledTooltip } from '@triniti/cms/components/index.js';
import { Button } from 'reactstrap';

const TableRow = ({ idx, node }) => {
  const navigate = useNavigate();

  return (
    <tr className={`status-${node.get('status')}`} key={node.get('_id')} role='button'>
      <td style={{ width: '1px', textAlign: 'right' }} onClick={() => navigate(nodeUrl(node, 'view'))}>{idx + 1}.</td>
      <td onClick={() => navigate(nodeUrl(node, 'view'))}>
        {node.get('title')}
        <Collaborators nodeRef={NodeRef.fromNode(node)} />
      </td>
      <td onClick={() => navigate(nodeUrl(node, 'view'))}>
        {node.get('is_locked') && <Icon imgSrc="locked-solid" alt="locked-status" />}
      </td>
      <td onClick={() => navigate(nodeUrl(node, 'view'))}>{node.schema().getCurie().getMessage()}</td>

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
}

export default TableRow;
