import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField, TextareaField } from 'components';
import withBlockModal from 'components/blocksmith-field/components/with-block-modal';
import getImgurPostBlockId from 'components/blocksmith-field/components/imgur-post-block-modal/getImgurPostBlockId';

function ImgurPostBlockModal() {
  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField
          name="id"
          label="Post ID"
          placeholder="enter embed code, url, or id"
          parse={getImgurPostBlockId}
          required
        />
        <SwitchField name="aside" label="Aside" />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(ImgurPostBlockModal);