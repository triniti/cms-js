import React, { useEffect, useState } from 'react';
import { Form } from 'reactstrap';
import { Loading, TextField, withForm } from '@triniti/cms/components/index.js';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';
import useDelegate from '@triniti/cms/plugins/dam/components/uploader/useDelegate.js';
import { uploadStatus } from '@triniti/cms/plugins/dam/constants.js';

function AssetDetails(props) {
  useDelegate(props);
  const { batch, formState, handleSubmit, controls } = props;
  const { dirty, hasSubmitErrors, submitErrors, submitting, valid } = formState;
  const submitDisabled = submitting || !dirty || (!valid && !hasSubmitErrors);

  useEffect(() => {
    controls.current.submitDisabled = submitDisabled;
    controls.current.dirty = dirty;
    controls.current.valid = valid;
    batch.refresh();
  }, [submitDisabled]);

  return (
    <Form onSubmit={handleSubmit} autoComplete="off">
      <TextField name="title" label="Title" required />
      <TextField name="display_title" label="Display Title" />
    </Form>
  );
}

const AssetDetailsWithForm = withForm(AssetDetails);

export default function AssetForm(props) {
  const { batch, uploadHash } = props;
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

  if (!node) {
    return <Loading error={upload.error}>Loading {upload.name}...</Loading>;
  }

  if (pbjxError) {
    return <Loading error={pbjxError} />;
  }

  return <AssetDetailsWithForm
    editMode
    pbj={node}
    node={node}
    nodeRef={nodeRef}
    isRefreshing={isRefreshing}
    refreshNode={refreshNode}
    {...props}
  />;
}
