import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField, TextareaField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/components/blocksmith-field/components/with-block-modal/index.js';
import Preview from '@triniti/cms/components/blocksmith-field/components/instagram-media-block-modal/Preview.js';

const getInstagramMediaId = (str) => {
  const regex = RegExp('https://www.instagram.com/(p|tv|reel)/[a-zA-Z0-9-_]+', 'g');
  const isValid = regex.test(str);
  const mediaId = str.match(regex);

  return isValid ? mediaId[0].split('/')[4] : null;
};

function InstagramMediaBlockModal(props) {
  const { formState } = props;
  const { valid } = formState;
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
        <SwitchField name="aside" label="Aside" tooltip="Is only indirectly related to the main content." />
        {valid && <Preview {...props} />}
      </ModalBody>
    </div>
  );
}

export default withBlockModal(InstagramMediaBlockModal);
