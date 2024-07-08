import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Form, Row, Table } from 'reactstrap';
import { useFormState } from 'react-final-form';
import {
  DatePickerField,
  Icon,
  Loading,
  TextareaField,
  TextField,
  withForm
} from '@triniti/cms/components/index.js';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import AssetPreview from '@triniti/cms/plugins/dam/components/asset-preview/index.js';
import formatBytes from '@triniti/cms/utils/formatBytes.js';
import useDelegate from '@triniti/cms/plugins/dam/components/uploader-modal/useDelegate.js';
import { uploadStatus } from '@triniti/cms/plugins/dam/constants.js';

function AssetDetails(props) {
  const delegate = useDelegate(props);
  const { values } = useFormState({ subscription: { values: true } });

  const { batch, formState, handleSubmit, controls, node } = props;
  const { dirty, hasSubmitErrors, submitting, valid } = formState;
  const submitDisabled = submitting || !dirty || (!valid && !hasSubmitErrors);

  const schema = node.schema();
  const label = schema.getCurie().getMessage();
  const id = node.get('_id');

  useEffect(() => {
    controls.current.submitDisabled = submitDisabled;
    controls.current.dirty = dirty;
    controls.current.valid = valid;
    batch.refresh();
  }, [submitDisabled]);

  return (
    <>
      <Row key={`${id}-preview`} className="mb-4">
        <Col sm={4}>
          <div className="ratio ratio-1x1">
            <AssetPreview id={node.get('_id')} />
          </div>
        </Col>
        <Col sm={8}>
          <Table className="border-bottom mt-3" size="sm">
            <tbody>
            <tr>
              <th className="nowrap ps-0" scope="row">MIME Type:</th>
              <td className="w-100">{node.get('mime_type')}</td>
            </tr>
            <tr>
              <th className="nowrap ps-0" scope="row">File Size:</th>
              <td className="w-100">{formatBytes(node.get('file_size'))}</td>
            </tr>
            {schema.hasMixin('triniti:dam:mixin:image-asset') && (
              <tr>
                <th className="nowrap ps-0" scope="row">Dimensions:</th>
                <td className="w-100">{node.get('width')}x{node.get('height')}</td>
              </tr>
            )}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Form key={`${id}-form`} onSubmit={handleSubmit} autoComplete="off">
        <TextField name="title" label="Title" required />
        <TextField name="display_title" label="Display Title" />
        {schema.hasField('alt_text') && (
          <TextField name="alt_text" label="Alt Text" />
        )}

        {batch.completed > 1 && (
          <>
            <Row className="align-items-end">
              <Col sm={8}>
                <PicklistField picklist={`${label}-credits`} name="credit" label="Credit" />
              </Col>
              <Col sm={4}>
                <Button
                  color="light"
                  outline
                  disabled={!values.credit}
                  onClick={() => delegate.handleApplyToAll('credit')}
                  className="mb-4"
                >
                  Apply to All
                </Button>
              </Col>
            </Row>
            {schema.hasMixin('gdbots:ncr:mixin:expirable') && (
              <Row className="align-items-end">
                <Col sm={8}>
                  <DatePickerField name="expires_at" label="Expires At" />
                </Col>
                <Col sm={4}>
                  <Button
                    color="light"
                    outline
                    disabled={!values.expires_at}
                    onClick={() => delegate.handleApplyToAll('expires_at')}
                    className="mb-4"
                  >
                    Apply to All
                  </Button>
                </Col>
              </Row>
            )}
          </>
        )}

        {batch.completed === 1 && (
          <>
            <PicklistField picklist={`${label}-credits`} name="credit" label="Credit" />
            {schema.hasMixin('gdbots:ncr:mixin:expirable') && (
              <DatePickerField name="expires_at" label="Expires At" />
            )}
          </>
        )}

        <TextareaField name="description" label="Description" rows={3} />
      </Form>
    </>
  );
}

const AssetDetailsWithForm = withForm(AssetDetails);

export default function AssetForm(props) {
  const { batch, controls, uploadHash } = props;
  const upload = batch.get(uploadHash);
  const [nodeRef, setNodeRef] = useState(null);
  const { node, refreshNode, setNode, isRefreshing, pbjxError } = useNode(nodeRef);
  const status = upload ? upload.status : null;
  const key = `${uploadHash}-${status || ''}`;

  useEffect(() => {
    if (!upload || !status || status !== uploadStatus.COMPLETED) {
      controls.current.submitDisabled = true;
      controls.current.dirty = false;
      controls.current.valid = false;
      batch.refresh();
      setNodeRef(null);
      setNode(null);
      return;
    }

    upload.result.then((asset) => {
      setNodeRef(asset.generateNodeRef());
    }).catch(console.error);
  }, [upload, status]);

  if (!upload) {
    return <Loading key={key} error="Upload doesn't exist." />;
  }

  if (upload.error) {
    return (
        <>
          <Alert key={key} color="danger">
            {upload.error}
          </Alert>
          <div className="d-flex justify-content-center mt-5">
            <Button color="secondary" onClick={upload.retry} className="rounded-pill"><Icon imgSrc="refresh" className="me-1" />Retry</Button>
            <Button color="danger" onClick={upload.remove} className="rounded-pill"><Icon imgSrc="trash" className="me-1" />Remove</Button>
          </div>
        </>
    );
  }

  if (!node) {
    return (
      <>
        <Loading key={key} color="dark">
          Uploading {upload.name}
        </Loading>
        {upload.cancelable &&
          <div className="d-flex justify-content-center">
            <Button color="danger" onClick={upload.cancel} className="rounded-pill"><Icon imgSrc="pause-outline" className="me-1" />Cancel</Button>
          </div>
        }
      </>
    );
  }

  if (pbjxError) {
    return <Loading key={key} error={`${upload.name}: ${pbjxError}`} />;
  }

  return (
    <AssetDetailsWithForm
      key={key}
      editMode
      pbj={node}
      node={node}
      nodeRef={nodeRef}
      isRefreshing={isRefreshing}
      refreshNode={refreshNode}
      {...props}
    />
  );
}
