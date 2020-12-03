import test from 'tape';
import normalizeKey from './normalizeKey';

test('Blocksmith:util:normalizeKey', (t) => {
  let actual = normalizeKey('asdf-0-0');
  const expected = 'asdf';
  t.equal(actual, expected, 'It should return an api key when given a dom key');

  actual = normalizeKey('asdf-1-0');
  t.equal(actual, expected, 'It should return an api key when given a dom key');

  actual = normalizeKey('asdf-0-1');
  t.equal(actual, expected, 'It should return an api key when given a dom key');

  actual = normalizeKey('asdf');
  t.equal(actual, expected, 'It should return an api key when given an api key');

  t.end();
});
