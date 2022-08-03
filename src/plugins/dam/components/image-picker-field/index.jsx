import React, { lazy, useState } from 'react';
import classNames from 'classnames';
import { Button, Label, Media } from 'reactstrap';
import { CreateModalButton, Icon } from 'components';
import damUrl from 'plugins/dam/damUrl';
import useNode from 'plugins/ncr/components/useNode';

// fixme: add uploader.

const ImagePickerModal = lazy(() => import('plugins/dam/components/image-picker-field/ImagePickerModal'));

export default function ImagePickerField(props) {
  const {
    groupClassName = '',
    label,
    name,
    nodeRef,
    selectedImageRef,
    onSelectImage
  } = props;

  const { node } = useNode(nodeRef, false);
  const [imageRef, setImageRef] = useState(selectedImageRef || node.get('image_ref', null));

  const clearImage = () => {
    setImageRef('');

    if (onSelectImage) {
      onSelectImage(null);
    }
  };

  const selectImage = (ref) => {
    setImageRef(ref);

    if (onSelectImage) {
      onSelectImage(ref);
    }
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
      {!imageRef && (
        <div className="d-block">
          <CreateModalButton text="Select an Image" modal={ImagePickerModal} modalProps={{selectImage}} />
        </div>
      )}
    </div>
  );
}
