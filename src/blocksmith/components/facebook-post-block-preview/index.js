import React from 'react';
import { Col, Row, Table } from 'reactstrap';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function FacebookPostBlockPreview(props) {
  const { block } = props;
  return (
    <Row className='gx-2'>
      <Col xs='5'>
        <iframe src={`/block-previewer.html?type=fbpost&width=350&href=${encodeURIComponent(block.get('href'))}&show_text=${block.get('show_text')}`} width={"100%"} sandbox></iframe>
      </Col>
      <Col>
        <Table borderless size="sm">
          <tbody>
          <tr>
            <th className="nowrap ps-2 pt-0" scope="row">Post Url:</th>
            <td className="w-100 text-break pt-0">
              <a href={block.get('href')} target="_blank" rel="noreferrer noopener">{block.get('href')}</a>
            </td>
          </tr>
          <tr>
            <th className="nowrap ps-2" scope="row">Show Text:</th>
            <td className="w-100 text-break">{block.get('show_text') ? 'Yes' : 'No'}</td>
          </tr>
          </tbody>
        </Table>
      </Col>
    </Row>
  );
}

export default withBlockPreview(FacebookPostBlockPreview);
