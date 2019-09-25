import React from 'react';
import test from 'tape';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import {
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from '@triniti/admin-ui-plugin/components';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

import { searchViewTypes } from '../../constants';
import { BatchOperationDropdown } from './index';

const { TABLE, CARD } = searchViewTypes;
const handleBatchDelete = sinon.spy();
const handleBatchPublish = sinon.spy();
const handleBatchMarkAsDraft = sinon.spy();
const onUnSelectAllRows = sinon.spy();

const wrapper = shallow(<BatchOperationDropdown
  delegate={{
    handleBatchDelete,
    handleBatchPublish,
    handleBatchMarkAsDraft,
  }}
  view={TABLE}
  disabled={false}
  canDeleteNode={false}
  onUnSelectAllRows={onUnSelectAllRows}
/>);

test('BatchOperationDropdown render[no nodeRefs]', (t) => {
  t.equal(wrapper.find(UncontrolledButtonDropdown).length, 0, 'it should not render the UncontrolledButtonDropdown component');
  t.end();
});

test('BatchOperationDropdown render[with nodeRefs]', (t) => {
  const fakeNodeRef1 = NodeRef.fromString('bachelornation:news:111');
  wrapper.setProps({ nodeRefs: [fakeNodeRef1] });
  wrapper.update();

  t.equal(wrapper.find(UncontrolledButtonDropdown).length, 1, 'it should render the UncontrolledButtonDropdown component');
  t.equal(wrapper.find(DropdownToggle).length, 1, 'it should render the DropdownToggle component');
  t.equal(wrapper.find(DropdownMenu).length, 1, 'it should render the DropdownMenu component');
  t.equal(wrapper.find(DropdownItem).length, 3, 'it should render the correct DropdownItem count');
  t.end();
});

test('BatchOperationDropdown render[view equals to CARD]', (t) => {
  wrapper.setProps({ view: CARD });
  wrapper.update();
  t.equal(wrapper.find(UncontrolledButtonDropdown).length, 0, 'it should not render the UncontrolledButtonDropdown component');
  t.end();
});


test('BatchOperationDropdown render[with full batch operation auth]', (t) => {
  wrapper.setProps({
    canDeleteNode: true,
    canPublishNode: true,
    canMarkNodeAsDraft: true,
    view: TABLE,
  });
  wrapper.update();

  t.equal(wrapper.find(DropdownItem).length, 6, 'it should render the correct DropdownItem count');
  t.end();
});

test('BatchOperationDropdown click unselect all', (t) => {
  wrapper.find(DropdownItem).findWhere((n) => n.props().children === 'Unselect All').simulate('click');
  t.equal(onUnSelectAllRows.calledOnce, true, 'it should call the onUnSelectAllRows function');
  t.end();
});

test('BatchOperationDropdown click Delete', (t) => {
  wrapper.find(DropdownItem).findWhere((n) => n.props().children === 'Delete').simulate('click');
  t.equal(handleBatchDelete.calledOnce, true, 'it should call the handleBatchDelete function');
  t.end();
});

test('BatchOperationDropdown click Publish', (t) => {
  wrapper.find(DropdownItem).findWhere((n) => n.props().children === 'Publish').simulate('click');
  t.equal(handleBatchPublish.calledOnce, true, 'it should call the handleBatchPublish function');
  t.end();
});

test('BatchOperationDropdown click Mark As Draft', (t) => {
  wrapper.find(DropdownItem).findWhere((n) => n.props().children === 'Mark As Draft').simulate('click');
  t.equal(handleBatchMarkAsDraft.calledOnce, true, 'it should call the handleBatchMarkAsDraft function');
  t.end();
});
