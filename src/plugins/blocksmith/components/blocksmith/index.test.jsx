import React from 'react';
import { mount } from 'enzyme';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import test from 'tape';

import { ErrorBoundary } from './error-boundary';

proxyquire.noCallThru();
global.setTimeout = () => {};
global.window.onerror = sinon.spy();

const Blocksmith = () => <textarea />; // mock blocksmith for simplicity
const dependencies = {
  './error-boundary': ErrorBoundary, // a detached from store version
  './Blocksmith': Blocksmith,
};
const SafeBlocksmith = proxyquire('./index', dependencies).default;

const wrapper = mount(<SafeBlocksmith />);

test('Blocksmith:component:blocksmith:index - normal render', (t) => {
  let actual = wrapper.find(ErrorBoundary).length;
  let expected = 1;
  t.equal(actual, expected, 'it should render an error boundary');

  actual = wrapper.find(ErrorBoundary).find('.blocksmith-error-boundary').length;
  expected = 0;
  t.equal(actual, expected, 'it should NOT render a fallback');

  actual = wrapper.find(ErrorBoundary).find(Blocksmith).length;
  expected = 1;
  t.equal(actual, expected, 'it should render a blocksmith');

  t.end();
});

// test ensures that blocksmith render error is caught to NOT bubble-up
// and crash the app ( ex. white blank screen )
test('Blocksmith:component:blocksmith:index - render error', (t) => {
  wrapper.find(Blocksmith).simulateError(new Error('a huge blocksmith crash!'));

  t.true(global.window.onerror.calledOnce, 'it should log error');

  const expected = wrapper.find(ErrorBoundary).find('.blocksmith-error-boundary').length;
  const actual = 1;
  t.equal(actual, expected, 'it should render fallback');

  t.end();
});


