import React from 'react';
import test from 'tape';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { registerTemplates } from '@gdbots/pbjx/pbjUrl';
import { ActionButton } from '@triniti/admin-ui-plugin/components';
import ArticleV1Mixin from '@triniti/schemas/triniti/news/mixin/article/ArticleV1Mixin';

import { NodeLock } from './index';

registerTemplates({
  'acme:article.canonical': '/',
});

const handleLock = sinon.spy();
const handleUnlock = sinon.spy();
const handleRedirect = sinon.spy();

const fakeLockedNode = ArticleV1Mixin.findOne().createMessage().set('is_locked', true);
const fakeUnlockedNode = ArticleV1Mixin.findOne().createMessage().set('is_locked', false);

const wrapper = shallow(<NodeLock
  delegate={{
    handleLock,
    handleUnlock,
    handleRedirect,
  }}
  canLock
  canUnlock
/>);

test('NodeLockButton render [node is unlocked & user authorized to lock/unlock]', (t) => {
  wrapper.setProps({ node: fakeUnlockedNode });
  wrapper.update();

  t.equal(wrapper.find(ActionButton).length, 1, 'it should render the ActionButton component');
  t.equal(wrapper.find(ActionButton).props().text, 'Lock', 'it should render the correct text');
  t.end();
});

test('NodeLockButton render [node request is unfulfilled]', (t) => {
  wrapper.setProps({ node: null });
  wrapper.update();

  t.equal(wrapper.find(ActionButton).length, 0, 'it should not render the ActionButton component');
  t.end();
});

test('NodeLockButton render [node is locked & user authorized to lock/unlock]', (t) => {
  wrapper.setProps({ node: fakeLockedNode });
  wrapper.update();

  t.equal(wrapper.find(ActionButton).length, 1, 'it should render the ActionButton component');
  t.equal(wrapper.find(ActionButton).props().text, 'Unlock', 'it should render the correct text');

  wrapper.find(ActionButton).simulate('click');
  t.equal(handleUnlock.callCount, 1, 'it should call the unlock function');
  t.end();
});


test('NodeLockButton render [node is unlocked & user authorized to lock/unlock]', (t) => {
  wrapper.setProps({ node: fakeUnlockedNode });
  wrapper.update();

  t.equal(wrapper.find(ActionButton).length, 1, 'it should render the ActionButton component');
  t.equal(wrapper.find(ActionButton).props().text, 'Lock', 'it should render the correct text');

  wrapper.find(ActionButton).simulate('click');
  t.equal(handleLock.callCount, 1, 'it should call the lock function');
  t.end();
});

test('NodeLockButton render [node is unlocked & user unauthorized to lock/unlock]', (t) => {
  wrapper.setProps({ canLock: false });
  wrapper.update();

  t.equal(wrapper.find(ActionButton).length, 0, 'it should not render the ActionButton component');
  t.end();
});

test('NodeLockButton render [node is unlocked & user unauthorized to lock/unlock]', (t) => {
  wrapper.setProps({ canUnlock: false });
  wrapper.update();

  t.equal(wrapper.find(ActionButton).length, 0, 'it should not render the ActionButton component');
  t.end();
});

test('NodeLockButton render [node is locked & user unauthorized to lock/unlock]', (t) => {
  wrapper.setProps({ node: fakeLockedNode, canUnlock: false });
  wrapper.update();

  t.equal(wrapper.find(ActionButton).length, 0, 'it should not render the ActionButton component');
  t.equal(handleRedirect.callCount, 1, 'it should redirect');
  t.end();
});
