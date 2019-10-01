import test from 'tape';
import { actionTypes } from '../constants';
import markNodeAsDraft from './markNodeAsDraft';

test('markNodeAsDraft action creator tests', (t) => {
  const command = {};
  const config = {};
  const actual = markNodeAsDraft(command, config);

  const expected = {
    type: actionTypes.MARK_NODE_AS_DRAFT_REQUESTED,
    pbj: command,
    config,
  };

  t.same(actual, expected, 'it should create a MARK_NODE_AS_DRAFT_REQUESTED action.');
  t.end();
});
