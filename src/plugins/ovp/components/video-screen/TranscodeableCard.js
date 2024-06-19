import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, Card, CardBody, CardHeader, Table } from 'reactstrap';
import { Icon } from '@triniti/cms/components/index.js';
import artifactUrl from '@triniti/cms/plugins/ovp/artifactUrl.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import camelCase from 'lodash-es/camelCase.js';
import startCase from 'lodash-es/startCase.js';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';

export default ({ nodeRef }) => {
  const { node } = useNode(nodeRef, false);
  const status = node.has('transcoding_status') ? node.get('transcoding_status').getValue() : 'unknown';

  return (
    <Card>
      <CardHeader>
        <span>
          Transcoding
          <Link to={nodeUrl(node, 'view')}>
            <Button color="hover">
              <Icon imgSrc="eye" alt="view" />
            </Button>
          </Link>
        </span>
        <span>
          Status <Badge color="dark" pill className={`status-${status}`}>{status}</Badge>
        </span>
      </CardHeader>
      <CardBody className="pb-3">
        {status === 'completed' && (
          <Table className="border-bottom border-light mb-0">
            <tbody>
              {['original', 'manifest', 'subtitled', 'video', 'tooltip-thumbnail-sprite', 'tooltip-thumbnail-track'].map((type) => (
                <tr key={type}>
                  <td className="pl-1">{`${startCase(camelCase(type))}:`}</td>
                  <td>
                    <a
                      href={artifactUrl(node, type)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {` ${artifactUrl(node, type)}`}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        {status !== 'completed' && (
          <p>{`No artifacts available. Transcoding status: ${status}.`}</p>
        )}
      </CardBody>
    </Card>
  )
}