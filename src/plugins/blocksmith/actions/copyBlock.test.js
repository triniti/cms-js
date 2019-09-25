import test from 'tape';
import { actionTypes } from '../constants';
import copyBlock from './copyBlock';

test('Blocksmith:action:copyBlock', (t) => {
  const block = 'slartibartfast';

  const actual = copyBlock(block);
  const expected = {
    type: actionTypes.BLOCK_COPIED,
    block,
  };

  t.same(actual, expected, 'it should create a BLOCK_COPIED action with a block payload.');
  t.end();
});
