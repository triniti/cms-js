import AspectRatio from '@triniti/schemas/triniti/common/enums/AspectRatio';
import React, { useState } from 'react';
import {
  FormGroup,
  ModalBody
} from 'reactstrap';
import { Icon, TextField, ScrollableContainer, SelectField, SwitchField } from 'components';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import ImagePickerField from 'plugins/dam/components/image-picker-field';
import withBlockModal from 'components/blocksmith-field/components/with-block-modal';
import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';
import humanizeEnums from 'components/blocksmith-field/utils/humanizeEnums';
import PicklistField from 'plugins/sys/components/picklist-field';
import DateTimePicker from 'components/blocksmith-field/components/date-time-picker';

const aspectRatioOptions = humanizeEnums(AspectRatio, {
  format: 'map',
  shouldStartCase: false,
  except: [AspectRatio.UNKNOWN],
}).map(({ label, value }) => ({
  label,
  value,
}));

const ImageBlockModal = ({
  block,
  form,
  formState,
}) => {
  const [ hasCaption, setHasCaption ] = useState(block.has('caption'));
  const [ hasUpdatedDate, setHasUpdatedDate ] = useState(block.has('updated_date'));
  const [ isLink, setIsLink ] = useState(block.has('url'));
  const [ updatedDate, setUpdatedDate ] = useState(block.get('updated_date', new Date()));
  
  const imageRef = block.has('node_ref') ? `${block.get('node_ref')}` : null;

  const handleUploadedImage = (nodes) => {
    if (!nodes.length) {
      return;
    } 
    
    form.change('node_ref', NodeRef.fromNode(nodes[0]));
  }

  const handleIsLinkToggle = (e) => {
    if (e.target.checked) {
      setIsLink(true);
    } else {
      form.change('url', '');
      setIsLink(false);
    }
  }

  const handleCaptionToggle = (e) => {
    if (e.target.checked) {
      setHasCaption(true);
    } else {
      form.change('caption', '');
      setHasCaption(false);
    }
  }

  return (
  <div className="modal-scrollable">
    <ModalBody className="p-0 bg-gray-400">
      <ScrollableContainer
        style={{ height: 'calc(100vh - 168px)' }}
      >
        <div className="modal-body-blocksmith">
          <div style={{ maxWidth: '350px', margin: '0 auto' }}>
            <ImagePickerField
              label="Image"
              name="node_ref"
              nodeRef={imageRef}
              setSelectedImage={(nodeRef) => form.change('node_ref', nodeRef)}
              selectedImageRef={imageRef}
              aspectRatio={formState?.values?.aspect_ratio}
              caption={hasCaption ? formState?.values?.caption : null}
              launchText={formState?.values?.launch_text}
              onUploadedImageComplete={handleUploadedImage}
              required
              />

            <SelectField
              name="aspect_ratio"
              label="Aspect Ratio"
              options={aspectRatioOptions}
              />

            {block.schema().hasMixin('triniti:common:mixin:themeable')
            && (
              <PicklistField
                name="theme"
                label="Theme"
                picklist="image-block-themes"
              />
            )}
            <TextField
              name="launch_text"
              label="Launch Text"
            />
            <SwitchField
              name="is_nsfw"
              label="Is NSFW"
              />
            <FormGroup className="d-flex align-items-start mb-2">
              <SwitchField
                name="hasCaption"
                label="Caption"
                checked={hasCaption}
                onChange={handleCaptionToggle}
                />
              {hasCaption && (
                <TextField
                  name="caption"
                  placeholder="Enter a caption..."
                  />
              )}
            </FormGroup>
            <FormGroup className="d-flex align-items-start mb-2">
              <SwitchField
                name="isLink"
                label="Is Link"
                checked={isLink}
                onChange={handleIsLinkToggle}
                />
              {isLink && (
                <FormGroup className="mb-0">
                  <TextField
                    name="url"
                    placeholder="https://example.com"
                    />
                </FormGroup>
              )}
            </FormGroup>
            <FormGroup className="mb-4">
              <SwitchField
                name="hasUpdatedDate"
                label="Is Update"
                checked={hasUpdatedDate}
                onChange={(e) => setHasUpdatedDate(e.target.checked)}
                />
              {hasUpdatedDate
                && (
                  <DateTimePicker
                    onChangeDate={date => setUpdatedDate(changedDate(date).updatedDate)}
                    onChangeTime={({ target: { value: time } }) => setUpdatedDate(changedTime(time).updatedDate)}
                    updatedDate={updatedDate}
                  />
                )}
            </FormGroup>
            <SwitchField
              name="aside"
              label="Aside"
              tooltip="Is only indirectly related to the main content."
              />
          </div>
        </div>
      </ScrollableContainer>
    </ModalBody>
  </div>
  );
}

export default withBlockModal(ImageBlockModal, {
  modalProps: {
    size: 'xxl',
  }
});