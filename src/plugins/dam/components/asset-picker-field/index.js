import React, { lazy } from 'react';
import classNames from 'classnames';
import { Badge, Button, FormText, Label } from 'reactstrap';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import { ActionButton, CreateModalButton, Icon, useField, useFormContext } from '@triniti/cms/components/index.js';
import { expand } from '@gdbots/pbjx/pbjUrl.js';

const AssetPickerModal = lazy(() => import('@triniti/cms/plugins/dam/components/asset-picker-field/AssetPickerModal.js'));

const validate = (value) => {
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

function DefaultPreview(props) {
  const { assetRef } = props;
  return (
    <input className="form-control" readOnly value={assetRef.getId()} />
  );
}

export default function AssetPickerField(props) {
  const {
    name,
    label,
    description,
    nestedPbj,
    pbjName,
    required = false,
    readOnly = false,
    groupClassName = '',
    Preview = DefaultPreview,
    icon = 'document',
    ...rest
  } = props;
  const formContext = useFormContext();
  const { editMode, nodeRef, pbj } = formContext;
  const { input, meta } = useField({ ...props, validate }, formContext);

  const rootClassName = classNames(groupClassName, 'form-group');

  const handleSelectAsset = (ref) => {
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

  let assetRef;
  let assetUrl;
  try {
    assetRef = input.value ? NodeRef.fromString(input.value) : null;
    if (assetRef) {
      assetUrl = expand('node.view', { label: assetRef.getLabel(), _id: assetRef.getId() });
    }
  } catch (e) {
    assetRef = null;
  }

  return (
    <div className={rootClassName} id={`form-group-${pbjName || name}`}>
      {label && (
        <>
          <Label className="d-inline-block w-auto" htmlFor={name}>
            {label}{required && <Badge className="ms-1" color="light" pill>required</Badge>}
          </Label>
          {assetRef && (
            <a className="d-inline-block" href={assetUrl} target="_blank" rel="noopener noreferrer">
              <Button color="hover" tag="span" size="sm" className="mb-1">
                <Icon imgSrc="external" alt="view" />
              </Button>
            </a>
          )}
        </>
      )}

      {assetRef && Preview && <Preview key={`${assetRef.getId()}-preview`} assetRef={assetRef} url={assetUrl} />}

      {!assetRef && (!editMode || readOnly) && (
        <input className="form-control" readOnly value={`No ${label} selected`} />
      )}

      {editMode && !readOnly && (
        <div className="d-block">
          <CreateModalButton
            text={`Select ${label}`}
            icon={icon}
            color="light"
            outline
            modal={AssetPickerModal}
            modalProps={{
              onSelectAsset: handleSelectAsset,
              linkedRef: nodeRef,
              header: `Select ${label}`,
              ...rest
            }}
          />
          {assetRef && (
            <ActionButton
              icon="delete"
              color="light"
              onClick={handleClear}
              text={`Clear ${label}`}
              outline
            />
          )}
          {`${pbj.get(pbjName || name)}` !== `${assetRef}` && (
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
