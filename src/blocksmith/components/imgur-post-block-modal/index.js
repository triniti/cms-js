import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField, TextareaField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';
import getImgurPostBlockId from '@triniti/cms/blocksmith/components/imgur-post-block-modal/getImgurPostBlockId.js';
import Preview from '@triniti/cms/blocksmith/components/imgur-post-block-modal/Preview.js';

function ImgurPostBlockModal(props) {
  const { formState } = props;
  const { valid } = formState;

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
        <SwitchField name="show_context" label="Show Title" />
        <SwitchField name="aside" label="Aside" tooltip="Is only indirectly related to the main content." />
        {valid && <Preview {...props} />}
      </ModalBody>
    </div>
  );
}

export default withBlockModal(ImgurPostBlockModal);
