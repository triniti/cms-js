import test from 'tape';
import { actionTypes } from '../constants';
import dirtyEditor from './dirtyEditor';

test('Blocksmith:action:dirtyEditor', (t) => {
  const formName = 'sierra';

  const actual = dirtyEditor(formName);
  const expected = {
    type: actionTypes.EDITOR_DIRTIED,
    formName,
  };

  t.same(actual, expected, 'it should create an EDITOR_DIRTIED action with a formName.');
  t.end();
});
