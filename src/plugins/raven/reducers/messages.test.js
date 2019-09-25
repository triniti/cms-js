import test from 'tape';
import deepFreeze from 'deep-freeze';
import reducer, { initialState } from './messages';
import { actionTypes } from '../constants';

const { RT_TEXT, CONNECTION_CLOSED } = actionTypes;

test('Raven:reducer:messages', (assert) => {
  deepFreeze(initialState);
  assert.deepEqual(initialState, reducer(undefined, {}), 'it should return initial state when state is undefined.');

  const internalTopic = 'reducer/topic';
  const internalMessage = 'hello';

  const updatedinternalState = {
    'reducer/topic': [{
      text: internalMessage,
      rt: '',
      ts: '',
      userRef: '',
      isMe: true,
      pbj: null,
    }],
  };

  deepFreeze(updatedinternalState);
  assert.deepEqual(
    reducer(
      initialState,
      {
        type: RT_TEXT,
        topic: internalTopic,
        text: internalMessage,
        rt: '',
        ts: '',
        userRef: '',
        isMe: true,
        pbj: null,
      },
    ),
    updatedinternalState,
    `it should update the internal message state with the new message: "${internalMessage}" on topic: "${internalTopic}".`,
  );

  const fakeInitState = {};
  deepFreeze(fakeInitState);
  assert.deepEqual(
    reducer(
      initialState,
      {
        type: CONNECTION_CLOSED,
      },
    ),
    fakeInitState,
    'it should not change the initial state when connection closed',
  );

  assert.end();
});
