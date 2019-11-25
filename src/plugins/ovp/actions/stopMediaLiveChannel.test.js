import test from 'tape';
import { actionTypes } from '../constants';
import stopMediaLiveChannel from './stopMediaLiveChannel';

test('Ovp:action:stopMediaLiveChannel', (t) => {
  const nodeRef = 'sup dawg im a node ref';

  const actual = stopMediaLiveChannel(nodeRef);
  const expected = {
    type: actionTypes.MEDIALIVE_CHANNEL_STOPPED,
    nodeRef,
  };

  t.same(actual, expected, 'it should create a MEDIALIVE_CHANNEL_STOPPED action with a command');
  t.end();
});
