import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField, TextareaField, TextField } from 'components';
import getYouTubeId from 'utils/getYouTubeId';
import withBlockModal from 'components/blocksmith-field/components/with-block-modal';
import Preview from 'components/blocksmith-field/components/youtube-video-block-modal/Preview';
import ImagePickerField from 'plugins/dam/components/image-picker-field';

function YoutubeVideoBlockModal(props) {
  const { formState } = props;
  const { valid } = formState;
  const { id } = formState.values;

  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField name="id" label="URL" placeholder="enter url or embed code" parse={getYouTubeId} />
        <TextField name="start_at" label="Start At ( In Seconds )" parse={(str) => str ? parseInt(str) : ''} placeholder="Time in seconds" />
        {valid && <Preview {...props} />}
        {id && <ImagePickerField name="poster_image_ref" previewImage={false} width={526} />}
        <SwitchField name="autoplay" label="Autoplay" />
        <SwitchField name="aside" label="Aside" tooltip="Is only indirectly related to the main content." />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(YoutubeVideoBlockModal);
