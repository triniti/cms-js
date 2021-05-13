import React from 'react';
import noop from 'lodash-es/noop';
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
const initialStubs = {
  'react-redux': { connect: () => (component) => component }, // disconnect from redux store
};

const setUp = (stubs = initialStubs) => {
  test('setUp', (t) => {
    const OuterErrorBoundary = proxyquire('./index', stubs).default;
    wrapper = mount(
      <OuterErrorBoundary
        delegate={{
          handleStoreEditor: noop,
          handleDirtyEditor: noop,
        }}
      >
        <Child />
      </OuterErrorBoundary>,
    );
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

setUp({ ...initialStubs, '../../../utils/validateBlocks': validateBlocksStub });
test('Blocksmith:component:outer-error-boundary:error:errorCount < MAX_ERROR_COUNT', (t) => {
  wrapper.find(Child).simulateError(new Error('a child crash'));

  t.true(global.window.onerror.called, 'it should log error');

  const actual = wrapper.find(Child).length;
  const expected = 1;
  t.equal(actual, expected, 'it should render child');
  t.end();
});
tearDown();

setUp({ ...initialStubs, '../../../utils/validateBlocks': validateBlocksStub });
test('Blocksmith:component:outer-error-boundary:error:errorCount > MAX_ERROR_COUNT', (t) => {
  wrapper.setState({ errorCount: 6 });

  wrapper.find(Child).simulateError(new Error('a child crash'));

  t.true(global.window.onerror.called, 'it should log error');

  let actual = wrapper.find(Child).length;
  let expected = 0;
  t.equal(actual, expected, 'it should NOT render a child');

  actual = wrapper.find('.blocksmith-error-boundary').length;
  expected = 1;
  t.equal(actual, expected, 'it should render fallback');

  const warningText = wrapper.find('.warning').text();
  let expectedWarningText = 'The blocks are valid but some issue is causing it to crash.';
  t.true(warningText.indexOf(expectedWarningText) > -1, 'it should have correct text warning');

  expectedWarningText = 'Press the button below to try to restore the editor.';
  t.true(warningText.indexOf(expectedWarningText) > -1, 'it should have correct text warning');

  t.end();
});
tearDown();

validateBlocksStub = () => ({ blocks: [], isValid: false, validEditorState }); // switch isValid
setUp({ ...initialStubs, '../../../utils/validateBlocks': validateBlocksStub });
test('Blocksmith:component:outer-error-boundary:error:isValid is false', (t) => {
  wrapper.find(Child).simulateError(new Error('a child crash'));

  t.true(global.window.onerror.called, 'it should log error');

  let actual = wrapper.find(Child).length;
  let expected = 0;
  t.equal(actual, expected, 'it should still not render a child');

  actual = wrapper.find('.blocksmith-error-boundary').length;
  expected = 1;
  t.equal(actual, expected, 'it should render fallback');

  const warningText = wrapper.find('.warning').text();
  let expectedWarningText = 'Some of the blocks are invalid and that may be causing it to crash.';
  t.true(warningText.indexOf(expectedWarningText) > -1, 'it should have correct text warning');

  expectedWarningText = 'Press one of the buttons below to try to restore the editor.';
  t.true(warningText.indexOf(expectedWarningText) > -1, 'it should have correct text warning');

  t.end();
});
tearDown();



