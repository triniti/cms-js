import test from 'tape';
import { actionTypes } from '../constants';
import cleanEditor from './cleanEditor';

test('Blocksmith:action:cleanEditor', (t) => {
  const formName = 'kaleidescope';

  const actual = cleanEditor(formName);
  const expected = {
    type: actionTypes.EDITOR_CLEANED,
    formName,
  };

  t.same(actual, expected, 'it should create an EDITOR_CLEANED action with a formName.');
  t.end();
});
