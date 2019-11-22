import test from 'tape';
import { actionTypes } from '../constants';
import startMedialiveChannel from './startMedialiveChannel';

test('Ovp:action:startMedialiveChannel', (t) => {
  const nodeRef = 'sup dawg im a node ref';

  const actual = startMedialiveChannel(nodeRef);
  const expected = {
    type: actionTypes.MEDIALIVE_CHANNEL_STARTED,
    nodeRef,
  };

  t.same(actual, expected, 'it should create a MEDIALIVE_CHANNEL_STARTED action with a command');
  t.end();
});
