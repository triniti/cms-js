import React from 'react';
import { ModalBody } from 'reactstrap';
import { TextareaField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/components/blocksmith-field/components/with-block-modal/index.js';
import Preview from '@triniti/cms/components/blocksmith-field/components/code-block-modal/Preview.js';

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
