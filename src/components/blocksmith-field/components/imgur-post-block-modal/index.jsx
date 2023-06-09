import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField, TextareaField } from 'components';
import withBlockModal from 'components/blocksmith-field/components/with-block-modal';
import getImgurPostBlockId from 'components/blocksmith-field/components/imgur-post-block-modal/getImgurPostBlockId';
import Preview from './Preview';

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
