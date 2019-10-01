import moment from 'moment';
import test from 'tape';
import changedDate from './changedDate';

test('Blocksmith:util:changedDate', (t) => {
  const expected = moment()
    .set('year', 1)
    .set('month', 2)
    .set('date', 3)
    .set('hours', 10)
    .set('minutes', 10);

  const actual = changedDate(expected.toDate())({
    updatedDate: moment() // this is the "existing" state that is expected to change
      .set('year', 20)
      .set('month', 3)
      .set('date', 10)
      .set('hours', 0)
      .set('minutes', 0),
  }).updatedDate;

  t.equal(
    actual.get('year'),
    expected.get('year'),
    'it should update the year of the existing value to that of the new value',
  );

  t.equal(
    actual.get('month'),
    expected.get('month'),
    'it should update the month of the existing value to that of the new value',
  );

  t.equal(
    actual.get('date'),
    expected.get('date'),
    'it should update the date of the existing value to that of the new value',
  );

  t.notEqual(
    actual.get('hours'),
    expected.get('hours'),
    'it should NOT update the hours of the existing value to that of the new value',
  );

  t.notEqual(
    actual.get('minutes'),
    expected.get('minutes'),
    'it should NOT update the minutes of the existing value to that of the new value',
  );

  t.end();
});
