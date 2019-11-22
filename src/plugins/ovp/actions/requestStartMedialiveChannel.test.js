import test from 'tape';
import { actionTypes } from '../constants';
import requestStartMedialiveChannel from './requestStartMedialiveChannel';

test('Ovp:action:requestStartMedialiveChannel', (t) => {
  const command = 'request to start the channel bro';

  const actual = requestStartMedialiveChannel(command);
  const expected = {
    type: actionTypes.START_MEDIALIVE_CHANNEL_REQUESTED,
    pbj: command,
  };

  t.same(actual, expected, 'it should create a START_MEDIALIVE_CHANNEL_REQUESTED action with a command');
  t.end();
});
