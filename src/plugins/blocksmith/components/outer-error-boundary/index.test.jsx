import React from 'react';
import { mount } from 'enzyme';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import test from 'tape';
import { EditorState } from 'draft-js';

proxyquire.noCallThru();
global.window.onerror = sinon.spy();

let wrapper;
const validEditorState = EditorState.createEmpty();
let validateBlocksStub = () => ({ blocks: [], isValid: true, validEditorState });
const Child = () => <textarea />;
const initialStub = {
  'react-redux': { connect: () => (component) => component }, // disconnect from redux store
};

const setUp = (stubs = initialStub) => {
  test('setUp', (t) => {
    const OuterErrorBoundary = proxyquire('./index', stubs).default;
    wrapper = mount(<OuterErrorBoundary delegate={{ handleStoreEditor: () => {} }}><Child /></OuterErrorBoundary>);
    t.end();
  });
};

const tearDown = () => {
  test('tearDown', (t) => {
    wrapper.unmount();
    wrapper = null;
    t.end();
  });
};

setUp();
test('Blocksmith:component:outer-error-boundary:render', (t) => {
  const actual = wrapper.find(Child).length;
  const expected = 1;
  t.equal(actual, expected, 'it should render child');

  t.end();
});
tearDown();

setUp({ ...initialStub, '../../utils/validateBlocks': validateBlocksStub });
test('Blocksmith:component:outer-error-boundary:error:errorCount < MAX_ERROR_COUNT', (t) => {
  wrapper.find(Child).simulateError(new Error('a child crash'));

  const actual = wrapper.find(Child).length;
  const expected = 1;
  t.equal(actual, expected, 'it should render child');
  t.end();
});
tearDown();

setUp({ ...initialStub, '../../utils/validateBlocks': validateBlocksStub });
test('Blocksmith:component:outer-error-boundary:error:errorCount > MAX_ERROR_COUNT', (t) => {
  wrapper.setState({ errorCount: 6 });

  wrapper.find(Child).simulateError(new Error('a child crash'));

  let actual = wrapper.find(Child).length;
  let expected = 0;
  t.equal(actual, expected, 'it should NOT render a child');

  actual = wrapper.find('.blocksmith-error-boundary').length;
  expected = 1;
  t.equal(actual, expected, 'it should render fallback');

  const expectedText = 'The blocks are valid but some issue is causing it to crash.';
  t.true(wrapper.find('.warning').text().indexOf(expectedText) > -1, 'it should have correct text warning');

  t.end();
});
tearDown();

validateBlocksStub = () => ({ blocks: [], isValid: false, validEditorState }); // switch isValid
setUp({ ...initialStub, '../../utils/validateBlocks': validateBlocksStub });
test('Blocksmith:component:outer-error-boundary:error:isValid is false', (t) => {
  wrapper.setState({ errorCount: 6 });

  wrapper.find(Child).simulateError(new Error('a child crash'));

  let actual = wrapper.find(Child).length;
  let expected = 0;
  t.equal(actual, expected, 'it should still not render a child');

  actual = wrapper.find('.blocksmith-error-boundary').length;
  expected = 1;
  t.equal(actual, expected, 'it should render fallback');

  const expectedText = 'Some of the blocks are invalid and that may be causing it to crash.';
  t.true(wrapper.find('.warning').text().indexOf(expectedText) > -1, 'it should have correct text warning');

  t.end();
});
tearDown();



