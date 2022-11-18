import React, { lazy } from 'react';
import classNames from 'classnames';
import { Button, Label, Media } from 'reactstrap';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import { CreateModalButton, Icon } from 'components';
import damUrl from 'plugins/dam/damUrl';
import useNode from 'plugins/ncr/components/useNode';
import { useField, useFormContext } from 'components';

// fixme: add uploader.

const ImagePickerModal = lazy(() => import('plugins/dam/components/image-picker-field/ImagePickerModal'));

export default function ImagePickerField(props) {
  const {
    groupClassName = '',
    label,
    name,
    nodeRef,
    readOnly = false,
    selectedImageRef,
    onSelectImage
  } = props;

  const { node } = useNode(nodeRef, false);
  const formContext = useFormContext();
  const { editMode } = formContext;
  const { input } = useField({ ...props, initialValue: selectedImageRef || node.get(name, null) }, formContext);

  let imageRef = input.value;
  if (typeof input.value === 'string' && input.value.length) {
    // Make sure imageRef is a NodeRef
    imageRef = NodeRef.fromString(input.value);
  }

  const clearImage = () => {
    input.onChange('');
    onSelectImage && onSelectImage(null);
  };

  const selectImage = (ref) => {
    input.onChange(ref);
    onSelectImage && onSelectImage(ref);
  };

  const rootClassName = classNames(
    groupClassName,
    'form-group',
  );

  return (
    <div className={rootClassName} id={`form-group-${name}`}>
      <Label htmlFor={name} className="d-inline-block w-auto">{label}</Label>
      {imageRef && (
        <>
          <a href={damUrl(imageRef)} target="_blank" rel="noopener noreferrer">
            <div className="btn btn-hover btn-sm mb-1">
              <Icon imgSrc="external" alt="open" />
            </div>
          </a>
          <Media
            src={damUrl(imageRef, '4by3', 'sm')}
            alt={imageRef.toString()}
            className="d-flex mb-0 mw-100"
          />
          {(editMode && !readOnly) && (
            <>
              <CreateModalButton
                className="mt-2 mb-0"
                text="Select a New Image"
                modal={ImagePickerModal}
                modalProps={{imageRef, nodeRef, selectImage}}
                outline
              />
              <Button className="mt-2 mb-0" color="light" outline name="clear_image" onClick={clearImage}>Clear Image</Button>
            </>
          )}
        </>
      )}
      {!imageRef && (editMode || !readOnly) && (
        <div className="d-block">
          <CreateModalButton text="Select an Image" modal={ImagePickerModal} modalProps={{selectImage}} />
        </div>
      )}
    </div>
  );
}
