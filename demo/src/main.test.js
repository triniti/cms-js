import test from 'tape';

test('Hello World tests', (t) => {
  const actual = 'ehlo';
  const expected = 'ehlo';
  t.same(actual, expected, 'it should say ehlo');
  t.end();
});
