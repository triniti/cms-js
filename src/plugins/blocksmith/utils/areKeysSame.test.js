import test from 'tape';
import areKeysSame from './areKeysSame';

test('Blocksmith:util:areKeysSame', (t) => {
  let domKey = '8kj7o-0-0';
  let apiKey = '8kj7o';

  let actual = areKeysSame(domKey, apiKey);
  let expected = true;

  t.same(actual, expected, 'it should confirm that the keys are the same');

  domKey = 'f1d95-0-0';
  apiKey = '4skki';

  actual = areKeysSame(domKey, apiKey);
  expected = false;
  t.same(actual, expected, 'it should confirm that the keys are NOT the same');

  t.end();
});
