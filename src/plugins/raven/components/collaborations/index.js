import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Badge, Button, Card, CardBody, Table } from 'reactstrap';
import { Icon } from '@triniti/cms/components/index.js';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.js';
import getCollaborations from '@triniti/cms/plugins/raven/selectors/getCollaborations.js';
import createRowClickHandler from '@triniti/cms/utils/createRowClickHandler.js';
import formatDate from '@triniti/cms/utils/formatDate.js';

function TableRow(props) {
  const { nodeRef } = props;
  const navigate = useNavigate();
  const { node } = useNode(nodeRef);
  if (!node) {
    return null;
  }

  const schema = node.schema();
  const handleRowClick = createRowClickHandler(navigate, node);

  return (
    <tr key={`${node.get('_id')}`} className={`status-${node.get('status')} cursor-pointer`} onClick={handleRowClick}>
      <td className="td-title">
        {node.get('title')}
        <Badge className="ms-1" color="light" pill>
          {schema.getCurie().getMessage()}
        </Badge>
      </td>
      <td className="text-nowrap px-1 py-1"><Collaborators nodeRef={node.generateNodeRef().toString()} /></td>
      <td className="td-date">{formatDate(node.get('published_at', node.get('created_at')))}</td>
      <td className="td-icons" data-ignore-row-click={true}>
        <Link to={nodeUrl(node, 'view')}>
          <Button color="hover" tag="span">
            <Icon imgSrc="eye" alt="view" />
          </Button>
        </Link>
        <a href={nodeUrl(node, 'canonical')} target="_blank" rel="noopener noreferrer">
          <Button color="hover" tag="span">
            <Icon imgSrc="external" alt="open" />
          </Button>
        </a>
      </td>
    </tr>
  );
}

export default function Collaborations() {
  const nodeRefs = useSelector(getCollaborations);
  if (nodeRefs.length === 0) {
    return <Alert color="warning">No active edits happening right now.</Alert>;
  }

  return (
    <Card>
      <CardBody className="p-0">
        <Table hover responsive className="m-0">
          <thead>
          <tr>
            <th>Title</th>
            <th />
            <th>Date</th>
            <th />
          </tr>
          </thead>
          <tbody>
          {nodeRefs.map((ref) => <TableRow key={ref} nodeRef={ref} />)}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
}
