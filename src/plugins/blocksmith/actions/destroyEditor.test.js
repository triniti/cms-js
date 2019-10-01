import test from 'tape';
import { actionTypes } from '../constants';
import destroyEditor from './destroyEditor';

test('Blocksmith:action:destroyEditor', (t) => {
  const formName = 'kaleidescope';

  const actual = destroyEditor(formName);
  const expected = {
    type: actionTypes.EDITOR_DESTROYED,
    formName,
  };

  t.same(actual, expected, 'it should create an EDITOR_DESTROYED action with a formName.');
  t.end();
});
