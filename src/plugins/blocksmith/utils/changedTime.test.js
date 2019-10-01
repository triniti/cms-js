import moment from 'moment';
import test from 'tape';
import changedTime from './changedTime';

test('Blocksmith:util:changedTime', (t) => {
  const hours = 10;
  const minutes = 10;
  const expected = moment()
    .set('year', 1)
    .set('month', 2)
    .set('date', 3)
    .set('hours', hours)
    .set('minutes', minutes);

  const actual = changedTime(`${hours}:${minutes}`)({
    updatedDate: expected.clone() // this is the "existing" state that is expected to change
      .set('year', 20)
      .set('month', 3)
      .set('date', 10)
      .set('hours', 0)
      .set('minutes', 0),
  }).updatedDate;

  t.equal(
    actual.get('hours'),
    expected.get('hours'),
    'it should update the hours of the existing value to that of the new value',
  );

  t.equal(
    actual.get('minutes'),
    expected.get('minutes'),
    'it should update the minutes of the existing value to that of the new value',
  );

  t.notEqual(
    actual.get('year'),
    expected.get('year'),
    'it should NOT update the year of the existing value to that of the new value',
  );

  t.notEqual(
    actual.get('month'),
    expected.get('month'),
    'it should NOT update the month of the existing value to that of the new value',
  );

  t.notEqual(
    actual.get('date'),
    expected.get('date'),
    'it should NOT update the date of the existing value to that of the new value',
  );

  t.end();
});
