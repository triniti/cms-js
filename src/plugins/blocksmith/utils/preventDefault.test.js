import test from 'tape';
import preventDefault from './preventDefault';

const e = {
  preventDefault: () => 'blah',
};

test('Blocksmith:util:preventDefault', (t) => {
  const actual = preventDefault(e);
  const expected = 'blah';
  t.equal(actual, expected, 'It should return the value of the preventDefault fn key.');

  t.end();
});
