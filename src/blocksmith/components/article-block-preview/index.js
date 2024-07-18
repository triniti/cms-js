import React from 'react';
import { Badge, Button, Col, Media, Row, Table } from 'reactstrap';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import { Icon } from '@triniti/cms/components/index.js';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function ArticleBlockPreview(props) {
  const { block, article } = props;
  const imageUrl = damUrl(block.get('image_ref', article.get('image_ref')), '1by1', 'sm');
  const status = article.get('status').getValue();

  return (
    <Row className="gx-2" >
        <Col xs={2}>
          {block.get('show_image') && imageUrl && (
            <Media
              className="block-image rounded-2"
              src={imageUrl}
              alt=""
              width="100%"
              height="auto"
              object
            />
          )}
        </Col>
        <Col>
          <Table borderless size="sm">
            <tbody>
                <tr>
                    <th className="nowrap ps-2 pt-0" scope="row">Title:</th>
                    <td className="w-100 text-break pt-0">{block.get('title', article.get('title'), '')}</td>
                </tr>
                <tr>
                    <th colSpan={2} className="nowrap ps-2" scope="row">
                        <Badge color="dark" className={`align-self-end status-${status}`}>{status}</Badge>
                        <a href={nodeUrl(article, 'view')} className="ms-3" target="_blank">
                            <Button color="hover" tag="span" size="sm" className="mb-0 me-0 p-0" style={{ minHeight: 'initial' }}>
                                <Icon imgSrc="external" alt="view" />
                            </Button>
                        </a>
                    </th>
                </tr>
            </tbody>
          </Table>
        </Col>
    </Row>
  );
}

export default withBlockPreview(ArticleBlockPreview);
