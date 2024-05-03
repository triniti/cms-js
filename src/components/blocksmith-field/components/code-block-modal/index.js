import React from 'react';
import { ModalBody } from 'reactstrap';
import { TextareaField } from 'components';
import withBlockModal from '@triniti/cms/components/blocksmith-field/components/with-block-modal';
import Preview from '@triniti/cms/components/blocksmith-field/components/code-block-modal/Preview';

function CodeBlockModal(props) {
  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField name="code" label="Code" />
        <Preview {...props} />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(CodeBlockModal);
