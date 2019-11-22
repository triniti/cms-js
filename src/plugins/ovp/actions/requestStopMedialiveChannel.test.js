import test from 'tape';
import { actionTypes } from '../constants';
import requestStopMedialiveChannel from './requestStopMedialiveChannel';

test('Ovp:action:requestStopMedialiveChannel', (t) => {
  const command = 'request to stop the channel bro';

  const actual = requestStopMedialiveChannel(command);
  const expected = {
    type: actionTypes.STOP_MEDIALIVE_CHANNEL_REQUESTED,
    pbj: command,
  };

  t.same(actual, expected, 'it should create a STOP_MEDIALIVE_CHANNEL_REQUESTED action with a command');
  t.end();
});
