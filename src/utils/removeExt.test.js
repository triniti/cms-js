import test from 'tape';
import removeExt from './removeExt';

test('util:removeExt', (t) => {
  const key = 'daydream.mp4';
  const actual = removeExt(key);
  const expected = 'daydream';
  t.same(actual, expected);

  t.end();
});
