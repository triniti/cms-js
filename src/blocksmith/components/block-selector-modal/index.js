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
    <Modal isOpen size="xl" backdrop="static" centered>
      <ModalHeader toggle={props.toggle}>Insert Block</ModalHeader>
      <ModalBody>
        <div>
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
                data-after-node-key={afterNodeKey}>
                <i className={`icon icon-sd me-2 icon-${item.type}`} />
                <span className="text">{item.text}</span>
              </a>
            );
          })}
        </div>

        <div>
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
                data-after-node-key={afterNodeKey}>
                <i className={`icon icon-sd me-2 icon-${item.type}`} />
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
