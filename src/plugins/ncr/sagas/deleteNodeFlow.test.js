import { actionChannel, call, delay, fork, put, putResolve, race } from 'redux-saga/effects';
import { channel } from 'redux-saga';
import { reset } from 'redux-form';
import clearResponse from '@triniti/cms/plugins/pbjx/actions/clearResponse';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import OperationTimedOut from '@triniti/cms/plugins/pbjx/exceptions/OperationTimedOut';
import PageV1Mixin from '@triniti/schemas/triniti/canvas/mixin/page/PageV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SearchPagesRequestV1Mixin from '@triniti/schemas/triniti/canvas/mixin/search-pages-request/SearchPagesRequestV1Mixin';
import swal from 'sweetalert2';
import test from 'tape';
import toast from '@triniti/admin-ui-plugin/utils/toast';
import deleteNodeFlow, { doDelete, onAfterSuccessFlow as realOnAfterSuccessFlow } from './deleteNodeFlow';
import changeNodeFlow, { failureFlow, successFlow } from './changeNodeFlow';
import sagaDeepEqual from './sagaDeepEqual';
import waitForFlow from './waitForFlow';
import waitForMyEvent from './waitForMyEvent';

const config = {
  schemas: {
    deleteNode: resolveSchema(PageV1Mixin, 'command', 'delete-page'),
    getNodeRequest: resolveSchema(PageV1Mixin, 'request', 'get-page-request'),
    node: PageV1Mixin.findOne(),
    nodeDeleted: resolveSchema(PageV1Mixin, 'event', 'page-deleted'),
    searchNodes: SearchPagesRequestV1Mixin.findOne(),
  },
};

const fakeNode = PageV1Mixin.findOne().createMessage();
const action = {
  config,
  pbj: config.schemas.deleteNode.createMessage().set('node_ref', NodeRef.fromNode(fakeNode)),
};

function* onAfterSuccessFlow() {
  yield call(() => { console.log('i am inert'); });
}

const verify = () => {};

const failureMessage = 'Delete Page failed: ';
const successMessage = 'Success! The Page was deleted.';
const deleteNodeFlowConfig = {
  expectedEvent: action.config.schemas.nodeDeleted.getCurie().toString(),
  failureMessage,
  getNodeRequestSchema: action.config.schemas.getNodeRequest,
  onAfterSuccessFlow: () => onAfterSuccessFlow(action),
  pbj: action.pbj,
  successMessage,
  verify,
};

test('Ncr:saga:deleteNodeFlow', (t) => {
  const generator = deleteNodeFlow(action);
  let next = generator.next();

  let actual = next.value;
  let expected = call(swal, {
    allowOutsideClick: false,
    cancelButtonClass: 'btn btn-secondary',
    confirmButtonClass: 'btn btn-danger',
    confirmButtonText: 'Delete!',
    showCancelButton: true,
    text: 'Page will be deleted!',
    title: 'Are you sure?',
    type: 'warning',
    reverseButtons: true,
  });
  t.deepEqual(actual, expected, 'it should call sweetalert for a ui confirmation');
  next = generator.next({ value: true });

  actual = next.value;
  expected = call(doDelete, action);
  t.deepEqual(actual, expected, 'it should call doDelete with the correct arguments');
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:deleteNodeFlow:changeNodeFlow[success]', (t) => {
  const generator = changeNodeFlow(deleteNodeFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show']);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = action.config.schemas.nodeDeleted.getCurie().toString();
  actual = next.value;
  expected = actionChannel(expectedEvent);
  t.deepEqual(
    actual,
    expected,
    'it should create expected event action channel.',
  );
  const mockChannel = channel();
  next = generator.next(mockChannel);

  actual = next.value;
  expected = putResolve(action.pbj);
  t.deepEqual(
    actual,
    expected,
    'it should dispatch the pbj.',
  );
  next = generator.next();

  actual = next.value;
  expected = race({
    event: call(waitForMyEvent, mockChannel),
    timeout: delay(1000),
  });
  t.true(sagaDeepEqual(actual, expected), 'a race between incoming event and timeout should be created');
  next = generator.next({ event: true });

  actual = next.value;
  expected = call(
    waitForFlow,
    action.config.schemas.getNodeRequest,
    action.pbj.get('node_ref'),
    verify,
  );
  t.deepEqual(actual, expected, 'it should call the waitForFlow with the correct arguments.');
  next = generator.next(true);

  actual = next.value;
  expected = call(successFlow, successMessage, onAfterSuccessFlow);
  t.true(sagaDeepEqual(actual, expected), 'it should call successFlow with the correct arguments after getting the expected event.');
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:deleteNodeFlow:changeNodeFlow[failure:waitForFlow]', (t) => {
  const generator = changeNodeFlow(deleteNodeFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show']);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = action.config.schemas.nodeDeleted.getCurie().toString();
  actual = next.value;
  expected = actionChannel(expectedEvent);
  t.deepEqual(
    actual,
    expected,
    'it should create expected event action channel.',
  );
  const mockChannel = channel();
  next = generator.next(mockChannel);

  actual = next.value;
  expected = putResolve(action.pbj);
  t.deepEqual(
    actual,
    expected,
    'it should dispatch the pbj.',
  );
  next = generator.next();

  actual = next.value;
  expected = race({
    event: call(waitForMyEvent, mockChannel),
    timeout: delay(1000),
  });
  t.true(sagaDeepEqual(actual, expected), 'a race between incoming event and timeout should be created');
  next = generator.next({ timeout: true });

  actual = next.value;
  expected = call(
    waitForFlow,
    action.config.schemas.getNodeRequest,
    action.pbj.get('node_ref'),
    verify,
  );
  t.deepEqual(actual, expected, 'it should call the waitForFlow with the correct arguments after timing out.');
  next = generator.next(false);

  actual = next.value;
  expected = call(failureFlow, failureMessage, new OperationTimedOut(action.pbj), undefined);
  t.true(sagaDeepEqual(actual, expected), 'it should call the failureFlow after not getting a valid node from waitForFlow');
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:deleteNodeFlow:changeNodeFlow[failure:thrown]', (t) => {
  const generator = changeNodeFlow(deleteNodeFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show']);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = action.config.schemas.nodeDeleted.getCurie().toString();
  actual = next.value;
  expected = actionChannel(expectedEvent);
  t.deepEqual(
    actual,
    expected,
    'it should create expected event action channel.',
  );
  const mockChannel = channel();
  next = generator.next(mockChannel);

  const error = {
    getMessage: () => 'whatever',
  };
  next = generator.throw(error);

  actual = next.value;
  expected = call(failureFlow, failureMessage, error, undefined);
  t.true(sagaDeepEqual(actual, expected), 'it should call failureFlow with the correct arguments when catching an error');
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:deleteNodeFlow:onAfterSuccessFlow', (t) => {
  const history = {
    replace: () => {},
  };
  const theConfig = {
    ...config,
    formName: 'blah',
  };
  const generator = realOnAfterSuccessFlow({
    config: theConfig,
    history,
    pbj: action.pbj,
  });
  let next = generator.next();

  let actual = next.value;
  let expected = put(reset(theConfig.formName));
  t.deepEqual(
    actual,
    expected,
    'it should reset the form',
  );
  next = generator.next();

  actual = next.value;
  expected = put(clearResponse(config.schemas.searchNodes.getCurie()));
  t.deepEqual(
    actual,
    expected,
    'it should dispatch clearResponse for searchNodes',
  );
  next = generator.next();

  actual = next.value;
  expected = call(history.replace, '/canvas/pages/');
  t.deepEqual(
    actual,
    expected,
    'it should redirect to the node\'s search page',
  );
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});
