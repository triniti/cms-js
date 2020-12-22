import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Message from '@gdbots/pbj/Message';
import { STATUS_FULFILLED, STATUS_PENDING } from '@triniti/app/constants';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Icon,
  StatusMessage,
  Table,
} from '@triniti/admin-ui-plugin/components';
import delegate from './delegate';
import selector from './selector';
import TableRow from './TableRow';

export const ActiveEditsTable = ({
  accessToken,
  collaborationNodes,
  handleUpdateCollaborations,
  title,
}) => {
  useEffect(() => {
    handleUpdateCollaborations(accessToken);
  }, []);

  const [status, setStatus] = useState(null);
  const handleRefresh = async () => {
    setStatus(STATUS_PENDING);
    await handleUpdateCollaborations(accessToken);
    setStatus(STATUS_FULFILLED);
  };

  return (
    <Card shadow>
      <CardHeader className="pr-2">
        {title}
        <Button size="sm">
          <Icon
            imgSrc="refresh"
            onClick={handleRefresh}
            noborder
          />
        </Button>
      </CardHeader>
      <CardBody className="pl-0 pr-0 pt-0 pb-0">
        {status === STATUS_PENDING && <StatusMessage status={status} />}
        <Table className="table-stretch table-sm" borderless hover responsive>
          <thead>
            <tr>
              <th style={{ width: '1px' }} />
              <th>Title</th>
              <th />
              <th>Type</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {!collaborationNodes.length && (<tr><td /><td>No Content being collaborated on.</td></tr>)}
            {collaborationNodes.map((node, idx) => (
              <TableRow node={node} idx={idx} key={node.get('_id')} />
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

ActiveEditsTable.propTypes = {
  accessToken: PropTypes.string.isRequired,
  collaborationNodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
  handleUpdateCollaborations: PropTypes.func.isRequired,
  title: PropTypes.string,
};

ActiveEditsTable.defaultProps = {
  title: 'Active Edits',
};

export default connect(selector, delegate)(ActiveEditsTable);
