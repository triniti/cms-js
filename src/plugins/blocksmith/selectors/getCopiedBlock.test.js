import test from 'tape';
import deepFreeze from 'deep-freeze';
import getCopiedBlock from './getCopiedBlock';

test('Blocksmith:selector:getCopiedBlock', (t) => {
  const initState = {
    blocksmith: {},
  };
  const block = 'bananarama';

  const testState1 = {
    blocksmith: {
      copiedBlock: block,
    },
  };

  deepFreeze(initState);
  let actual = getCopiedBlock(initState);
  let expected = null;
  t.deepEqual(actual, expected, 'it should return null if there is no copied block.');

  deepFreeze(testState1);
  actual = getCopiedBlock(testState1);
  expected = block;
  t.deepEqual(actual, expected, 'it should return the copied block.');

  t.end();
});
