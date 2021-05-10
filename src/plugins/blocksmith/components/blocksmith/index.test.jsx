import React from 'react';
import { mount } from 'enzyme';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import test from 'tape';

proxyquire.noCallThru();
global.window.onerror = sinon.spy();

const Blocksmith = () => <textarea />;
const OuterErrorBoundary = proxyquire('../outer-error-boundary', {
  'react-redux': { connect: () => (component) => component }, // disconnect from redux store
  '../../utils/validateBlocks': () => ({ blocks: [] }),
}).default;

const stubs = {
  '../outer-error-boundary': OuterErrorBoundary,
  './Blocksmith': Blocksmith,
};

const SafeBlocksmith = proxyquire('./index', stubs).default;

const wrapper = mount(<SafeBlocksmith />);

test('Blocksmith:component:blocksmith:index - normal render', (t) => {
  let actual = wrapper.find(OuterErrorBoundary).length;
  let expected = 1;
  t.equal(actual, expected, 'it should render an error boundary');

  actual = wrapper.find(OuterErrorBoundary).find('.blocksmith-error-boundary').length;
  expected = 0;
  t.equal(actual, expected, 'it should NOT render a fallback');

  actual = wrapper.find(OuterErrorBoundary).find(Blocksmith).length;
  expected = 1;
  t.equal(actual, expected, 'it should render a blocksmith child');

  t.end();
});

// test ensures that blocksmith render error is caught to NOT bubble-up
// and crash the app ( ex. white blank screen )
test('Blocksmith:component:blocksmith:index - render error', (t) => {
  wrapper.find(Blocksmith).simulateError(new Error('a huge blocksmith crash!'));

  t.true(global.window.onerror.calledOnce, 'it should log error');

  let expected = wrapper.find(OuterErrorBoundary).find('.blocksmith-error-boundary').length;
  let actual = 1;
  t.equal(actual, expected, 'it should render fallback');

  actual = wrapper.find(OuterErrorBoundary).find(Blocksmith).length;
  expected = 0;
  t.equal(actual, expected, 'it should NOT render a blocksmith child');

  t.end();
});


