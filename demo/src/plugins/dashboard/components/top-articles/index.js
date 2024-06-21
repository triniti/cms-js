import React, { lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Table } from 'reactstrap';
import { CreateModalButton, Icon, Loading } from '@triniti/cms/components/index.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

const delay = (time = 500) => new Promise((resolve) => setTimeout(resolve, time));

const BatchOperationModal = lazy(() => import('@triniti/cms/plugins/ncr/components/batch-operation-modal/index.js'));

const sampleBatchOperation = async (dispatch, node) => {
  const num = getRandomInt(0, 10);
  if (num < 4) {
    throw new Error('omg, it broke for some raisin');
  }
  await delay(2000);
  console.log('sampleBatchOperation::starting', node.toObject());
  await delay(2000);
  console.log('sampleBatchOperation::complete', node.toObject());
  return { stuff: 'thing', key: node.generateNodeRef().toString() };
};

export default function TopArticles(props) {
  const policy = usePolicy();
  const canUpdate = policy.isGranted(`${APP_VENDOR}:article:update`);
  const { title, request } = props;
  const { response, pbjxError } = useRequest(request, true);
  const navigate = useNavigate();

  return (
    <>
      {(!response || pbjxError) && <Loading error={pbjxError} />}
      {response && (
        <Card className="card-shadow">
          <CardHeader className="pe-3">
            {title}
            <CreateModalButton
              text="Sample Batch Edit"
              modal={BatchOperationModal}
              modalProps={{
                header: 'Sample Batch Thingy',
                runningText: 'Doing stuff',
                completedText: 'Did Stuff',
                nodes: response.get('nodes'),
                operation: sampleBatchOperation,
              }}
            />
          </CardHeader>
          <CardBody className="p-0">
            <Table responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slotting</th>
                  <th>Order Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
              {response.get('nodes', []).map(node => (
                <tr key={`${node.get('_id')}`} className={`status-${node.get('status')}`} role='button'>
                  <td onClick={() => navigate(nodeUrl(node, 'view'))}>{node.get('title')}  <Collaborators nodeRef={NodeRef.fromNode(node)} /></td>
                  <td onClick={() => navigate(nodeUrl(node, 'view'))}>
                    {node.has('slotting')
                      ? Object.entries(node.get('slotting')).map(([key, slot]) => (
                        <span key={`${key}:${slot}`}>{key}:{slot}</span>
                      )) : null}
                  </td>
                  <td onClick={() => navigate(nodeUrl(node, 'view'))}>{formatDate(node.get('order_date'))}</td>
                  <td className="td-icons">
                    <Link to={nodeUrl(node, 'view')}>
                      <Button tag="span" color="hover" className="rounded-circle">
                        <Icon imgSrc="eye" alt="view" />
                      </Button>
                    </Link>
                    {canUpdate && (
                      <Link to={nodeUrl(node, 'edit')}>
                        <Button tag="span" color="hover" className="rounded-circle">
                          <Icon imgSrc="pencil" alt="edit" />
                        </Button>
                      </Link>
                    )}
                    <a href={nodeUrl(node, 'canonical')} target="_blank" rel="noopener noreferrer">
                      <Button tag="span" color="hover" className="rounded-circle">
                        <Icon imgSrc="external" alt="open" />
                      </Button>
                    </a>
                  </td>
                </tr>
              ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      )}
    </>
  );
}
