import test from 'tape';
import getExt from './getExt';

test('util:getExt', (t) => {
  let key = 'daydream.mp4';
  let actual = getExt(key);
  let expected = 'mp4';
  t.same(actual, expected);

  key = 'daydream.mxf';
  actual = getExt(key);
  expected = 'mxf';
  t.same(actual, expected);

  key = 'daydream.';
  actual = getExt(key);
  expected = undefined;
  t.same(actual, expected);

  key = 'daydream';
  actual = getExt(key);
  expected = undefined;
  t.same(actual, expected);

  t.end();
});
