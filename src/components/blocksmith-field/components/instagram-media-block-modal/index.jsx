import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField, TextareaField } from 'components';
import withBlockModal from 'components/blocksmith-field/components/with-block-modal';

const getInstagramMediaId = (str) => {
  const regex = RegExp('https://www.instagram.com/(p|tv|reel)/[a-zA-Z0-9-_]+', 'g');
  const isValid = regex.test(str);
  const mediaId = str.match(regex);

  return isValid ? mediaId[0].split('/')[4] : null;
};

function InstagramMediaBlockModal() {
  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField
          name="id"
          label="URL"
          placeholder="enter url or embed code"
          parse={getInstagramMediaId}
          required
        />
        <SwitchField name="hidecaption" label="Hide Caption" />
        <SwitchField name="aside" label="Aside" />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(InstagramMediaBlockModal);
