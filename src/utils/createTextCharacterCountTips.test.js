import test from 'tape';
import createTextCharacterCountTips from './createTextCharacterCountTips';

test('createTextCharacterCountTips:: it should return null if no maxCount provided', (t) => {
  const warning = createTextCharacterCountTips('abcdefg', null);
  t.same(null, warning);
  t.end();
});

test('createTextCharacterCountTips:: it should return null if maxCount is not a number', (t) => {
  const warning = createTextCharacterCountTips('abcdefg', '50');
  t.same(null, warning);
  t.end();
});

test('createTextCharacterCountTips:: it should return null if maxCount is not a number', (t) => {
  const warning = createTextCharacterCountTips('abcdefg', {});
  t.same(null, warning);
  t.end();
});

test('createTextCharacterCountTips:: it should show init tips', (t) => {
  const warning = createTextCharacterCountTips('', 10);
  t.same('10 characters remaining.', warning);
  t.end();
});

test('createTextCharacterCountTips:: it should show init tips if value is null', (t) => {
  const warning = createTextCharacterCountTips(null, 10);
  t.same('10 characters remaining.', warning);
  t.end();
});

test('createTextCharacterCountTips:: it should show character remaining tips', (t) => {
  const warning = createTextCharacterCountTips('abc', 10);
  t.same(
    ('7 characters remaining.'),
    warning,
  );
  t.end();
});

test('createTextCharacterCountTips:: it should show warning message if character count exceed warning limit', (t) => {
  const warning = createTextCharacterCountTips('abcdefg', 10, 5);
  t.same(
    ('3 characters remaining. 2 characters exceed recommendation.'),
    warning,
  );
  t.end();
});
