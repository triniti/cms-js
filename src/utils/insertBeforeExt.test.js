import test from 'tape';
import insertBeforeExt from './insertBeforeExt';

test('util:insertBeforeExt', (t) => {
  const key = 'daydream.mp4';
  const actual = insertBeforeExt(key, '-nation');
  const expected = 'daydream-nation.mp4';
  t.same(actual, expected);

  t.end();
});
