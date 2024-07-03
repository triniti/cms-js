import React from 'react';
import startCase from 'lodash-es/startCase.js';
import { Card, CardBody, CardHeader, CardText, Col, Row, Table } from 'reactstrap';
import {
  DatePickerField,
  NumberField,
  TextareaField,
  TextField,
  UrlField
} from '@triniti/cms/components/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import PollPickerField from '@triniti/cms/plugins/apollo/components/poll-picker-field/index.js';
import AssetPreview from '@triniti/cms/plugins/dam/components/asset-preview/index.js';
import GalleryCard from '@triniti/cms/plugins/dam/components/asset-screen/GalleryCard.js';
import LinkedNodesCard from '@triniti/cms/plugins/dam/components/asset-screen/LinkedNodesCard.js';
import TranscodeableCard from '@triniti/cms/plugins/dam/components/asset-screen/TranscodeableCard.js';
import TranscribeableCard from '@triniti/cms/plugins/dam/components/asset-screen/TranscribeableCard.js';
import TaggableFields from '@triniti/cms/plugins/common/components/taggable-fields/index.js';
import formatBytes from '@triniti/cms/utils/formatBytes.js';

export default function DetailsTab(props) {
  const { label, node } = props;
  const schema = node.schema();
  const id = node.get('_id');

  return (
    <>
      <Card>
        <CardHeader>{startCase(label)}</CardHeader>
        <CardBody>
          <Row>
            <Col sm={4} xl={4}>
              <AssetPreview asset={node} />
            </Col>
            <Col sm={8} xl={8}>
              <Table className="border-bottom">
                <tbody>
                <tr>
                  <th className="nowrap" scope="row">Asset ID:</th>
                  <td className="w-100 text-break">{`${id}`}</td>
                </tr>
                <tr>
                  <th className="nowrap" scope="row">MIME Type:</th>
                  <td className="w-100">{node.get('mime_type')}</td>
                </tr>
                <tr>
                  <th className="nowrap" scope="row">File Etag:</th>
                  <td className="w-100 text-break">{node.get('file_etag')}</td>
                </tr>
                <tr>
                  <th className="nowrap" scope="row">File Size:</th>
                  <td className="w-100">{formatBytes(node.get('file_size'))}</td>
                </tr>
                {schema.hasField('duration') && (
                  <tr>
                    <th className="nowrap" scope="row">Duration:</th>
                    <td className="w-100">{node.get('duration')} seconds</td>
                  </tr>
                )}
                {schema.hasMixin('triniti:dam:mixin:image-asset') && (
                  <tr>
                    <th className="nowrap" scope="row">Dimensions:</th>
                    <td className="w-100">{node.get('width')}x{node.get('height')}</td>
                  </tr>
                )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody>
          <TextField name="title" label="Title" />
          <TextField name="display_title" label="Display Title" />
          {schema.hasMixin('gdbots:ncr:mixin:expirable') && (
            <DatePickerField name="expires_at" label="Expires At" />
          )}
          <TextareaField name="description" label="Description" rows={3} />
          {schema.hasField('alt_text') && (
            <TextField name="alt_text" label="Alt Text" />
          )}
          {schema.hasField('duration') && (
            <NumberField
              name="duration"
              label="Duration"
              description={`Length of the ${label.replace('-asset', '')} in seconds.`}
            />
          )}
          <PicklistField name="credit" label="Credit" picklist={`${label}-credits`} />
          <UrlField name="credit_url" label="Credit URL" />
          <TextField name="cta_text" label="Call To Action" />
          <UrlField name="cta_url" label="Call To Action URL" />
        </CardBody>
      </Card>

      {schema.hasMixin('triniti:apollo:mixin:has-poll') && (
        <Card>
          <CardHeader>Poll</CardHeader>
          <CardBody>
            <CardText>
              For applications that support it, a poll can be shown along with the
              asset giving the user the ability to cast their vote (e.g. Hot or Not).
            </CardText>
            <PollPickerField name="poll_ref" label="Poll" />
          </CardBody>
        </Card>
      )}

      {schema.hasMixin('triniti:ovp:mixin:transcodeable') && (
        <TranscodeableCard {...props} />
      )}

      {schema.hasMixin('triniti:ovp:mixin:transcribable') && (
        <TranscribeableCard {...props} />
      )}

      {node.has('gallery_ref') && <GalleryCard {...props} />}
      {node.has('linked_refs') && <LinkedNodesCard {...props} />}

      <TaggableFields />
    </>
  );
}
