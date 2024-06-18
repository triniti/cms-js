import React from 'react';
import { Badge, Card, CardBody, CardHeader, Table } from 'reactstrap';
import artifactUrl from '@triniti/cms/plugins/ovp/artifactUrl.js';
import camelCase from 'lodash-es/camelCase.js';
import startCase from 'lodash-es/startCase.js';

export default ({ node }) => {
  const status = node.has('transcoding_status') ? node.get('transcoding_status').getValue() : 'unknown';

  return (
    <Card>
      <CardHeader>
        Transcoding
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
