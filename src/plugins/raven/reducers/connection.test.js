import test from 'tape';
import deepFreeze from 'deep-freeze';
import { actionTypes } from '../constants';
import reducer, { initialState } from './connection';

const { CONNECTION_REQUESTED, CONNECTION_OPENED, CONNECTION_CLOSED } = actionTypes;

test('connection reducer tests', (assert) => {
  deepFreeze(initialState);
  assert.deepEqual(initialState, reducer(undefined, {}), 'it should return initial state when state is undefined.');

  const requestedState = {
    isConnected: false,
    isConnecting: true,
    wasRejected: false,
  };

  deepFreeze(requestedState);
  assert.deepEqual(
    reducer(initialState, { type: CONNECTION_REQUESTED }),
    requestedState,
    `it should update the connection state with isOpen:${requestedState.isOpen} and isOpening:${requestedState.isOpening}.`,
  );

  const confirmedState = {
    isConnected: true,
    isConnecting: false,
    wasRejected: false,
  };

  deepFreeze(confirmedState);
  assert.deepEqual(
    reducer(initialState, { type: CONNECTION_OPENED }),
    confirmedState,
    `it should update the connection state with isOpen:${confirmedState.isOpen} and isOpening:${confirmedState.isOpening}.`,
  );

  const closedState = {
    isConnected: false,
    isConnecting: false,
    wasRejected: false,
  };

  deepFreeze(closedState);
  assert.deepEqual(
    reducer(initialState, { type: CONNECTION_CLOSED }),
    closedState,
    `it should update the connection state with isOpen:${closedState.isOpen} and isOpening:${closedState.isOpening}.`,
  );

  assert.end();
});
