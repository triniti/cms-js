import React, { lazy } from 'react';
import classNames from 'classnames';
import { Badge, Button, FormText, Label, Media } from 'reactstrap';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import { ActionButton, CreateModalButton, Icon, useField, useFormContext } from '@triniti/cms/components/index.js';
import { expand } from '@gdbots/pbjx/pbjUrl.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';

const ImagePickerModal = lazy(() => import('@triniti/cms/plugins/dam/components/image-picker-field/ImagePickerModal.js'));

const validate = async (value) => {
  if (!value) {
    return undefined;
  }

  try {
    NodeRef.fromString(value);
    return undefined;
  } catch (e) {
    return value;
  }
};

export default function ImagePickerField(props) {
  const {
    name,
    label,
    description,
    nestedPbj,
    pbjName,
    required = false,
    readOnly = false,
    groupClassName = '',
    ...rest
  } = props;
  const formContext = useFormContext();
  const { editMode, nodeRef, pbj } = formContext;
  const { input, meta } = useField({ ...props, validate }, formContext);

  const rootClassName = classNames(groupClassName, 'form-group');

  const handleChange = (ref) => {
    input.onChange(`${ref || ''}` || undefined);
    input.onBlur();
  };

  const handleClear = () => {
    input.onChange(undefined);
    input.onBlur();
  };

  const handleRevert = () => {
    input.onChange(`${pbj.get(pbjName || name, '')}` || undefined);
    input.onBlur();
  };

  let imageRef;
  let imageUrl;
  try {
    imageRef = input.value ? NodeRef.fromString(input.value) : null;
    if (imageRef) {
      imageUrl = expand('node.view', { label: imageRef.getLabel(), _id: imageRef.getId() });
    }
  } catch (e) {
    imageRef = null;
  }

  const downloadUrl = imageRef && damUrl(imageRef);
  const previewUrl = imageRef && damUrl(imageRef, '1by1', 'sm');

  return (
    <div className={rootClassName} id={`form-group-${pbjName || name}`}>
      {label && (
        <>
          <Label className="d-inline-block w-auto me-1" htmlFor={name}>
            {label}{required && <Badge className="ms-1" color="light" pill>required</Badge>}
          </Label>
          {imageRef && (
            <a className="d-inline-block" href={imageUrl} target="_blank" rel="noopener noreferrer">
              <Button color="hover" tag="span">
                <Icon imgSrc="external" alt="view" />
              </Button>
            </a>
          )}
        </>
      )}

      {imageRef && (
        <div className="d-block">
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
            <Media src={previewUrl} alt="" width="200" height="auto" object />
          </a>
        </div>
      )}

      {!imageRef && (!editMode || readOnly) && (
        <input className="form-control" readOnly value={`No ${label} selected`} />
      )}

      {editMode && !readOnly && (
        <div className="d-block">
          <CreateModalButton
            text={`Select ${label}`}
            icon="photo"
            color="light"
            modal={ImagePickerModal}
            modalProps={{
              onClose: handleChange,
              linkedRef: nodeRef,
              label: label,
              accept: ['image/gif', 'image/jpeg', 'image/png'],
            }}
          />
          {imageRef && (
            <ActionButton
              icon="delete"
              color="light"
              onClick={handleClear}
              text={`Clear ${label}`}
              outline
            />
          )}
          {`${pbj.get(pbjName || name)}` !== `${imageRef}` && (
            <ActionButton
              icon="revert"
              color="light"
              onClick={handleRevert}
              text={`Revert ${label}`}
              outline
            />
          )}
        </div>
      )}

      <div className="d-block">
        {description && <FormText color="dark">{description}</FormText>}
        {meta.touched && !meta.valid && <FormText color="danger">{meta.error}</FormText>}
      </div>
    </div>
  );
}
