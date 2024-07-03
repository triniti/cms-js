import React, { useEffect, useState } from 'react';
import { Alert, Form } from 'reactstrap';
import {
  DatePickerField,
  Loading,
  TextareaField,
  TextField,
  withForm
} from '@triniti/cms/components/index.js';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import useDelegate from '@triniti/cms/plugins/dam/components/uploader/useDelegate.js';
import { uploadStatus } from '@triniti/cms/plugins/dam/constants.js';

function AssetDetails(props) {
  useDelegate(props);
  const { batch, formState, handleSubmit, controls, node } = props;
  const { dirty, hasSubmitErrors, submitErrors, submitting, valid } = formState;
  const submitDisabled = submitting || !dirty || (!valid && !hasSubmitErrors);
  const schema = node.schema();
  const label = schema.getCurie().getMessage();

  useEffect(() => {
    controls.current.submitDisabled = submitDisabled;
    controls.current.dirty = dirty;
    controls.current.valid = valid;
    batch.refresh();
  }, [submitDisabled]);

  return (
    <Form key={label} onSubmit={handleSubmit} autoComplete="off">
      <TextField name="title" label="Title" required />
      <TextField name="display_title" label="Display Title" />
      {schema.hasField('alt_text') && (
        <TextField name="alt_text" label="Alt Text" />
      )}
      <PicklistField name="credit" label="Credit" picklist={`${label}-credits`} />
      {schema.hasMixin('gdbots:ncr:mixin:expirable') && (
        <DatePickerField name="expires_At" label="Expires At" />
      )}
      <TextareaField name="description" label="Description" rows={3} />
    </Form>
  );
}

const AssetDetailsWithForm = withForm(AssetDetails);

export default function AssetForm(props) {
  const { batch, uploadHash, onRemoveUpload } = props;
  const upload = batch.get(uploadHash);
  const [nodeRef, setNodeRef] = useState(null);
  const { node, refreshNode, setNode, isRefreshing, pbjxError } = useNode(nodeRef);
  const status = upload ? upload.status : null;

  useEffect(() => {
    if (!upload || !status || status !== uploadStatus.COMPLETED) {
      setNodeRef(null);
      setNode(null);
      return;
    }

    upload.result.then((asset) => {
      setNodeRef(asset.generateNodeRef());
    }).catch(console.error);
  }, [upload, status]);

  if (!upload) {
    return <Loading error="Upload doesn't exist." />;
  }

  if (upload.error) {
    return (
      <Alert color="danger">
        {upload.name}: {upload.error}
        <a onClick={upload.retry}>Retry</a> -
        <a onClick={onRemoveUpload}>Remove</a>
      </Alert>
    );
  }

  if (!node) {
    return (
      <Loading>
        Uploading {upload.name}... <a onClick={upload.cancel}>Cancel</a>
      </Loading>
    );
  }

  if (pbjxError) {
    return <Loading error={`${upload.name}: ${pbjxError}`} />;
  }

  return (
    <AssetDetailsWithForm
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
