import React from 'react';
import { Col, Row, Table } from 'reactstrap';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function InstagramMediaBlockPreview(props) {
  const { block } = props;
  const url = `https://www.instagram.com/p/${block.get('id')}/`;
  return (
        <Row className='gx-2'>
          <Col xs='5'>
            <iframe src={`/block-previewer.html?type=igmedia&width=350&url=${encodeURIComponent(url)}&hidecaption=${block.get('hidecaption')}`} width={"100%"} sandbox></iframe>
          </Col>
          <Col>
            <Table borderless size="sm">
              <tbody>
              <tr>
                <th className="nowrap ps-2 pt-0" scope="row">Media Url:</th>
                <td className="w-100 text-break pt-0">
                  <a href={url} target="_blank" rel="noreferrer noopener">{url}</a>
                </td>
              </tr>
              <tr>
                <th className="nowrap ps-2" scope="row">Hide Caption:</th>
                <td className="w-100 text-break">{block.get('hidecaption') ? 'Yes' : 'No'}</td>
              </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
  );
}

export default withBlockPreview(InstagramMediaBlockPreview);
