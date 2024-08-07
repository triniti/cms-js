import React from 'react';
import startCase from 'lodash-es/startCase.js';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';
import { ActionButton, Icon } from '@triniti/cms/components/index.js';
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
          {config.selector.blocks.map((type, index) => {
            if (!policy.isGranted(`blocksmith:${type}:create`)) {
              return null;
            }

            const icon = config.blocks[type]?.icon || type;
            const title = config.blocks[type]?.title || startCase(type.replace('-block', ''));

            return (
              <a
                key={`${type}${index}`}
                onClick={onInsertBlock}
                data-type={type}
                data-after-node-key={afterNodeKey}
                className="g-col-6 g-col-sm-4 btn btn-sm btn-light btn-list">
                <Icon imgSrc={icon} size="sd" alt="" className="me-2" />
                <span className="text">{title}</span>
              </a>
            );
          })}
        </div>
        <hr/>
        <div className="grid gap-3 row-gap-2">
          {config.selector.externalBlocks.map((type, index) => {
            if (!policy.isGranted(`blocksmith:${type}:create`)) {
              return null;
            }

            const icon = config.blocks[type]?.icon || type;
            const title = config.blocks[type]?.title || startCase(type.replace('-block', ''));

            return (
              <a
                key={`${type}${index}`}
                onClick={onInsertBlock}
                data-type={type}
                data-after-node-key={afterNodeKey}
                className="g-col-6 g-col-sm-4 btn btn-sm btn-light btn-list">
                <Icon imgSrc={icon} alt="" className="me-2" />
                <span className="text">{title}</span>
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
