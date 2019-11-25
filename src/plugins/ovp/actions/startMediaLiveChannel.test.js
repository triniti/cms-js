import test from 'tape';
import { actionTypes } from '../constants';
import startMediaLiveChannel from './startMediaLiveChannel';

test('Ovp:action:startMediaLiveChannel', (t) => {
  const nodeRef = 'sup dawg im a node ref';

  const actual = startMediaLiveChannel(nodeRef);
  const expected = {
    type: actionTypes.MEDIALIVE_CHANNEL_STARTED,
    nodeRef,
  };

  t.same(actual, expected, 'it should create a MEDIALIVE_CHANNEL_STARTED action with a command');
  t.end();
});
