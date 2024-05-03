import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Badge, FormText, InputGroup, InputGroupText, Label } from 'reactstrap';
import { useField } from 'react-final-form';
import FileId from '@gdbots/schemas/gdbots/common/FileId';
import { ActionButton, Icon, useFormContext } from 'components';
import getFriendlyErrorMessage from 'plugins/pbjx/utils/getFriendlyErrorMessage';
import uploadFile from 'plugins/collector/utils/uploadFile';
import Preview from './Preview';

const validate = async (value) => {
  if (!value) {
    return undefined;
  }

  try {
    FileId.fromString(value);
    return undefined;
  } catch (e) {
    return value;
  }
};

export default function ImageField(props) {
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
  const { input, meta } = useField(name, { validate });
  const [uploading, setUploading] = useState(false);
  const [controller, setController] = useState(null);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      if (controller) {
        controller.abort();
      }
      isMounted.current = false;
    };
  }, []);

  const rootClassName = classNames(groupClassName, 'form-group');
  const className = classNames(
    'form-control',
    'bg-white',
    'input-type-file',
    meta.touched && !meta.valid && 'is-invalid',
    //meta.touched && meta.valid && 'is-valid',
  );

  const handleChange = async (event) => {
    setUploading(true);
    const myController = new AbortController;
    setController(myController);
    input.onChange(undefined);

    try {
      const id = await uploadFile(nodeRef, name, event.target.files.item(0), myController);
      if (!isMounted.current) {
        return;
      }
      input.onChange(`${id}`);
    } catch (e) {
      input.onChange(getFriendlyErrorMessage(e));
    }

    event.target.value = '';
    input.onBlur();
    setController(null);
    setUploading(false);
  };

  const handleCancel = () => {
    if (controller) {
      controller.abort();
    }
    setUploading(false);
  };

  const handleClear = () => {
    input.onChange(undefined);
    input.onBlur();
  };

  const handleRevert = () => {
    input.onChange(`${pbj.get(pbjName || name)}` || undefined);
    input.onBlur();
  };

  let fileId;
  try {
    fileId = input.value ? FileId.fromString(input.value) : null;
  } catch (e) {
    fileId = null;
  }

  return (
    <div className={rootClassName} id={`form-group-${pbjName || name}`}>
      {label &&
        <Label htmlFor={name}>{label}{required && <Badge className="ms-1" color="light" pill>required</Badge>}</Label>}
      <InputGroup>
        <InputGroupText className="px-2 text-black-50">
          <Icon imgSrc="photo" size="sd" />
        </InputGroupText>
        {fileId && (
          <div className="d-flex flex-column h-100 rounded-end overflow-hidden">
            <Preview fileId={fileId} />
            {editMode && !readOnly && (
              <ActionButton
                icon="delete"
                color="light"
                onClick={handleClear}
                text="Clear Image"
                outline
                className="rounded-0"
              />
            )}
          </div>
        )}
        {!fileId && (
          <input
            key={name}
            id={name}
            name={name}
            className={className}
            disabled={!editMode || readOnly || uploading}
            readOnly={!editMode || readOnly || uploading}
            style={{ backgroundColor: 'white' }}
            type="file"
            accept="image/gif,image/jpeg,image/png"
            required={required}
            {...rest}
            onChange={handleChange}
          />
        )}
        {!uploading && !fileId && pbj.has(pbjName || name) && (
          <ActionButton
            icon="revert"
            color="light"
            onClick={handleRevert}
            text="Revert Image"
            outline
          />
        )}
        {uploading && !fileId && (
          <>
            <Badge
              className="position-absolute rounded-pill"
              style={{ top: '10px', right: '155px', zIndex: 3 }}
              color="light">
              <span className="badge-animated">Uploading...</span>
            </Badge>
            <ActionButton
              icon="warning-outline-alt"
              color="danger"
              onClick={handleCancel}
              text="Cancel Upload"
            />
          </>
        )}
        {!fileId && !uploading && !meta.valid && (
          <ActionButton icon="delete" color="light" onClick={handleClear} text="Clear" />
        )}
      </InputGroup>
      {description && <FormText color="dark">{description}</FormText>}
      {meta.touched && !meta.valid && <FormText color="danger">{meta.error}</FormText>}
    </div>
  );
}