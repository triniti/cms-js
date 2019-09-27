import React from 'react';
import test from 'tape';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import {
  Button,
  Col,
  Icon,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Progress,
  Row,
} from '@triniti/admin-ui-plugin/components';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

import { BatchOperationModal } from './index';
import { batchOperationMessageTypes, batchOperationStatuses } from '../../constants';

const {
  DESTROYED,
  PAUSED,
  PENDING,
  STARTED,
} = batchOperationStatuses;

const {
  CONFIRMATION,
  ERROR,
} = batchOperationMessageTypes;

const handleDestroyBatchOperation = sinon.spy();
const handlePauseBatchOperation = sinon.spy();
const handleResumeBatchOperation = sinon.spy();

const fakeBatchOpsMessage = {
  message: 'test message',
  messageId: 'Test Id',
  nodeRef: NodeRef.fromString('acme:news:111'),
  title: 'Test Title',
  type: CONFIRMATION,
};

const fakeBatchOperation = {
  status: PENDING,
  messages: [fakeBatchOpsMessage],
  progress: 50,
  operation: 'Test Batch Operation',
};

const wrapper = shallow(<BatchOperationModal
  delegate={{
    handleDestroyBatchOperation,
    handlePauseBatchOperation,
    handleResumeBatchOperation,
  }}
/>);

test('BatchOperationModal render[no batchOperation prop]', (t) => {
  t.equal(wrapper.find(Modal).length, 0, 'it should not render the Modal component');
  t.end();
});

test('BatchOperationModal render[set batchOperation prop]', (t) => {
  wrapper.setProps({ batchOperation: fakeBatchOperation });
  wrapper.update();

  const modalHeader = wrapper.find(ModalHeader);
  const modalBody = wrapper.find(ModalBody);
  const modalFooter = wrapper.find(ModalFooter);
  const progress = modalBody.find(Row).at(0).find(Col)
    .find(Progress)
    .at(1);
  let icon = modalBody.find(Row).at(1).find(Col).find('ul')
    .find('li')
    .at(0)
    .find(Icon);

  t.equal(wrapper.find(Modal).length, 1, 'it should render the Modal component');
  t.equal(modalHeader.length, 1, 'it should render the ModalHeader component');
  t.equal(modalHeader.props().children[1].props.children, fakeBatchOperation.operation, 'it should render correct modalHeader Title');

  t.equal(modalBody.length, 1, 'it should render the ModalBody component');
  t.equal(modalFooter.length, 1, 'it should render the ModalFooter component');

  t.equal(progress.length, 1, 'it should render the progress component');
  t.equal(progress.props().value, fakeBatchOperation.progress, 'it should render the correct progress value');

  t.equal(icon.length, 1, 'it should render the Icon element');
  t.equal(icon.props().color, 'success', 'it should render the correct Icon\'s color prop value');

  // update the type of message to test for update on Icon's prop
  fakeBatchOpsMessage.type = ERROR;
  fakeBatchOperation.messages = [fakeBatchOpsMessage];
  wrapper.setProps({ batchOperation: fakeBatchOperation });
  wrapper.update();
  // requery since we made an update
  icon = wrapper.find(ModalBody).find(Row).at(1).find(Col)
    .find('ul')
    .find('li')
    .at(0)
    .find(Icon);
  t.equal(icon.props().color, 'danger', 'it should render the correct Icon\'s color prop value');
  t.end();
});

test('BatchOperationModal render[set batchOperation prop with DESTROYED status]', (t) => {
  fakeBatchOperation.status = DESTROYED;
  wrapper.setProps({ batchOperation: fakeBatchOperation });
  wrapper.update();

  t.equal(wrapper.find(Modal).length, 0, 'it should not render the Modal component if in DESTROYED status');
  t.end();
});

test('BatchOperationModal click Pause BatchOperation', (t) => {
  // update status to STARTED so we can access the PAUSED Button
  fakeBatchOperation.status = STARTED;
  wrapper.setProps({ batchOperation: fakeBatchOperation });

  const pauseBtn = wrapper.find(ModalBody)
    .find(Row).at(1)
    .find(Col)
    .find(Button);
  pauseBtn.simulate('click');
  t.equal(handlePauseBatchOperation.calledOnce, true, 'it should call the handlePauseBatchOperation function');
  t.end();
});

test('BatchOperationModal click Resume BatchOperation', (t) => {
  // update status to PAUSED so we can access the Resume Button
  fakeBatchOperation.status = PAUSED;
  wrapper.setProps({ batchOperation: fakeBatchOperation });
  wrapper.update();

  const modalFooter = wrapper.find(ModalFooter);
  const resumeBtn = modalFooter.find(Button).at(0);
  resumeBtn.simulate('click');
  t.equal(handleResumeBatchOperation.calledOnce, true, 'it should call the handleResumeBatchOperation function');
  t.end();
});

test('BatchOperationModal click Destroy BatchOperation[ModalHeader]', (t) => {
  const modalHeader = wrapper.find(ModalHeader);
  modalHeader.props().toggle();
  t.equal(handleDestroyBatchOperation.callCount, 1, 'it should call the handleDestroyBatchOperation function');
  t.end();
});


test('BatchOperationModal click Destroy BatchOperation[ModalFooter]', (t) => {
  const modalFooter = wrapper.find(ModalFooter);
  const destroyBtn = modalFooter.find(Button).at(1);
  destroyBtn.simulate('click');
  // second time to call
  t.equal(handleDestroyBatchOperation.callCount, 2, 'it should call the handleDestroyBatchOperation function');
  t.end();
});
