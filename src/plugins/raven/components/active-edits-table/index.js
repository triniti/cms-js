import React, { useEffect, useMemo, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { STATUS_FULFILLED, STATUS_PENDING } from '@triniti/cms/constants.js';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
} from 'reactstrap';
import { Icon, Loading } from '@triniti/cms/components/index.js';
import selector from '@triniti/cms/plugins/raven/components/active-edits-table/selector.js';
import TableRow from '@triniti/cms/plugins/raven/components/active-edits-table/TableRow.js';
import fetchCollaborations from '@triniti/cms/plugins/raven/actions/fetchCollaborations.js';

const StatusMessage = ({ status, exception }) => {
  switch (status) {
    case STATUS_PENDING:
      return <Loading />;

    case STATUS_REJECTED:
      // fixme: we can derive a friendly message based on exception.getCode() as well
      return <Alert color="danger">{exception.getMessage()}</Alert>;

    default:
      return null;
  }
};

export const ActiveEditsTable = ({
  accessToken,
  collaborationNodes,
  title = 'Active Edits',
}) => {
  const [status, setStatus] = useState(null);
  const dispatch = useDispatch();
  const handleRefresh = async () => {
    setStatus(STATUS_PENDING);
    await dispatch(fetchCollaborations(accessToken));
    setStatus(STATUS_FULFILLED);
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  const memoizedTableRows = useMemo(() => collaborationNodes.map((node, idx) => (
    <TableRow node={node} idx={idx} key={node.get('_id')} />
  )), [status]);

  return (
    <Card className="card-shadow">
      <CardHeader className="pr-2">
        {title}
        <Button size="sm" color="light" onClick={handleRefresh}>
          <Icon
            imgSrc="refresh"
          />
        </Button>
      </CardHeader>
      <CardBody className="p-0">
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
            {!memoizedTableRows.length && (<tr><td /><td>No Content being collaborated on.</td></tr>)}
            {memoizedTableRows}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default connect(selector)(ActiveEditsTable);
