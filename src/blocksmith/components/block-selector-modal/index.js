import React from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';
import { ActionButton } from '@triniti/cms/components/index.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import config from '@triniti/cms/blocksmith/config.js';

export default function BlockSelectorModal(props) {
  const { onInsertBlock, afterNodeKey = null } = props;
  const policy = usePolicy();

  return (
    <Modal isOpen size="md" backdrop="static" centered>
      <ModalHeader toggle={props.toggle}>Insert Block</ModalHeader>
      <ModalBody>
        <div className="grid gap-3 row-gap-2">
          {config.toolbar.blocks.map((item, index) => {
            if (item === 'separator') {
              return null;
            }

            if (!policy.isGranted(`blocksmith:${item.type}:create`)) {
              return null;
            }

            return (
              <a
                key={`${item.type}${index}`}
                onClick={onInsertBlock}
                data-type={item.type}
                data-after-node-key={afterNodeKey}
                className="g-col-6 g-col-sm-4 btn btn-sm btn-light btn-list">
                <i className={`icon icon-sd me-2 icon-${item.type}`} />
                <span className="text">{item.text}</span>
              </a>
            );
          })}
        </div>
        <hr/>
        <div className="grid gap-3 row-gap-2">
          {config.toolbar.externalBlocks.map((item, index) => {
            if (item === 'separator') {
              return null;
            }

            if (!policy.isGranted(`blocksmith:${item.type}:create`)) {
              return null;
            }

            return (
              <a
                key={`${item.type}${index}`}
                onClick={onInsertBlock}
                data-type={item.type}
                data-after-node-key={afterNodeKey}
                className="g-col-6 g-col-sm-4 btn btn-sm btn-light btn-list">
                <i className={`icon icon me-2 icon-${item.type}`} />
                <span className="text">{item.text}</span>
              </a>
            );
          })}
        </div>
      </ModalBody>
      <ModalFooter>
        <ActionButton
          text="Cancel"
          onClick={props.toggle}
          icon="close-sm"
          color="light"
          tabIndex="-1"
        />
      </ModalFooter>
    </Modal>
  );
}
