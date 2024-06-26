import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Table } from 'reactstrap';
import { Icon, Loading } from '@triniti/cms/components/index.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';

export default function TopArticles(props) {
  const policy = usePolicy();
  const canUpdate = policy.isGranted(`${APP_VENDOR}:article:update`);
  const { title, request } = props;
  const { response, pbjxError } = useRequest(request, true);

  return (
    <>
      {(!response || pbjxError) && <Loading error={pbjxError} />}
      {response && (
        <Card className="card-shadow">
          <CardHeader className="pe-3">
            {title}
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
                <tr key={`${node.get('_id')}`} className={`status-${node.get('status')}`}>
                  <td>{node.get('title')}  <Collaborators nodeRef={NodeRef.fromNode(node)} /></td>
                  <td>
                    {node.has('slotting')
                      ? Object.entries(node.get('slotting')).map(([key, slot]) => (
                        <span key={`${key}:${slot}`}>{key}:{slot}</span>
                      )) : null}
                  </td>
                  <td>{formatDate(node.get('order_date'))}</td>
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
