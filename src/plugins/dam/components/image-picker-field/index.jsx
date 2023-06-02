import React, { lazy } from 'react';
import classNames from 'classnames';
import { Button, Label, Media, Card, CardImgOverlay, CardTitle } from 'reactstrap';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import { CreateModalButton, Icon, useField, useFormContext } from 'components';
import damUrl from 'plugins/dam/damUrl';
import useNode from 'plugins/ncr/components/useNode';
import noop from 'lodash-es/noop';

const ImagePickerModal = lazy(() => import('plugins/dam/components/image-picker-field/ImagePickerModal'));

const damAspectRatio = (aspectRatio) => {
  let damAspectRatio = null;
  if (`${aspectRatio}` === 'auto' || `${aspectRatio}` === 'original') {
    damAspectRatio = 'o';
  }
  if (!aspectRatio) {
    damAspectRatio = '4by3';
  }
  return damAspectRatio || `${aspectRatio}`;
}

export default function ImagePickerField(props) {
  const {
    groupClassName = '',
    label,
    name,
    nodeRef,
    readOnly = false,
    selectedImageRef,
    onSelectImage,
    aspectRatio = null,
    caption = null,
    launchText = null,
    onUploadedImageComplete: handleUploadedImageComplete = noop,
  } = props;

  const { node } = useNode(nodeRef, false);
  const formContext = useFormContext();
  const { editMode } = formContext;
  const nodeLabel = nodeRef ? NodeRef.fromString(nodeRef).getLabel() : null;

  let initialValue = selectedImageRef;
  if (!selectedImageRef && node) {
    initialValue = node.get(name, null);
  }

  const { input } = useField({
    ...props,
    initialValue,
    format: v => (typeof v === 'string' && v.length) ? NodeRef.fromString(v) : v, // NodeRef required for value or empty string
  }, formContext);
  const imageRef = input.value;

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
          <Card>
            <Media
              src={damUrl(imageRef, damAspectRatio(aspectRatio), 'sm')}
              alt={imageRef.toString()}
              className="d-flex mb-0 mw-100"
            />
            {launchText && (
            <CardImgOverlay>
              <CardTitle className="h5 mb-0 text-white">
                {launchText}
                {nodeLabel === 'video' && <Icon imgSrc="video" alt="Video" className="icon-alert icon-alert-xs m-1 position-absolute end-0 top-0" style={{ display: 'block' }} />}
              </CardTitle>
            </CardImgOverlay>
            )}
          </Card>
          {caption && (<p>
            Caption: {caption}
          </p>)}
          {(editMode && !readOnly) && (
            <>
              <CreateModalButton
                className="mt-2 mb-0"
                text="Select a New Image"
                modal={ImagePickerModal}
                modalProps={{imageRef, nodeRef, selectImage, onUploadedImageComplete: handleUploadedImageComplete}}
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