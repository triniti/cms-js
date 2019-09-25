import test from 'tape';
import lowerCase from 'lodash/lowerCase';
import startCase from 'lodash/startCase';
import SearchPeopleSort from '@triniti/schemas/triniti/people/enums/SearchPeopleSort';
import humanizeEnums from './humanizeEnums';

test('humanizeEnums enums', (t) => {
  const expected = Object.values(SearchPeopleSort.getValues()).map((value) => startCase(value));
  const actual = humanizeEnums(SearchPeopleSort);

  t.same(actual, expected, 'it should transform all enums in SearchPeopleSort into human readable values');
  t.end();
});

test('humanizeEnums enums:: shouldStartCase false', (t) => {
  const expected = Object.values(SearchPeopleSort.getValues()).map((value) => lowerCase(value));
  const actual = humanizeEnums(SearchPeopleSort, { shouldStartCase: false });

  t.same(actual, expected, 'it should transform all enums in SearchPeopleSort into human readable values');
  t.end();
});

test('humanizeEnums enums:: map format', (t) => {
  const expected = Object
    .entries(SearchPeopleSort.getValues())
    .map((arr) => ({ label: startCase(arr[1]), value: arr[1] }));

  const actual = humanizeEnums(SearchPeopleSort, { format: 'map' });

  t.same(actual, expected, 'it should transform all enums in SearchPeopleSort into human readable map');
  t.end();
});

test('humanizeEnums enums:: exclude options', (t) => {
  const { UNKNOWN, CREATED_AT_ASC, CREATED_AT_DESC } = SearchPeopleSort;

  const expected = Object
    .entries(SearchPeopleSort.getValues())
    .filter((arr) => arr[0]
      !== UNKNOWN.getName() && arr[0]
      !== CREATED_AT_ASC.getName() && arr[0]
      !== CREATED_AT_DESC.getName())
    .map((arr) => ({ label: startCase(arr[1]), value: arr[1] }));

  const actual = humanizeEnums(
    SearchPeopleSort,
    {
      format: 'map',
      except: [UNKNOWN, CREATED_AT_ASC, CREATED_AT_DESC],
    },
  );

  t.same(actual, expected, 'it should exclude the given options');
  t.end();
});

test('humanizeEnums enums:: only options', (t) => {
  const { CREATED_AT_ASC, CREATED_AT_DESC } = SearchPeopleSort;
  const expected = [startCase(CREATED_AT_ASC), startCase(CREATED_AT_DESC)];

  const actual = humanizeEnums(
    SearchPeopleSort,
    {
      only: [CREATED_AT_ASC, CREATED_AT_DESC],
    },
  );

  t.same(actual, expected, 'it should only create the given enums for the only arg');
  t.end();
});

test('humanizeEnums enums:: only options in map', (t) => {
  const { CREATED_AT_ASC, CREATED_AT_DESC } = SearchPeopleSort;
  const expected = [
    { label: startCase(CREATED_AT_ASC), value: CREATED_AT_ASC.toString() },
    { label: startCase(CREATED_AT_DESC), value: CREATED_AT_DESC.toString() },
  ];

  const actual = humanizeEnums(
    SearchPeopleSort,
    {
      format: 'map',
      only: [CREATED_AT_ASC, CREATED_AT_DESC],
    },
  );

  t.same(actual, expected, 'it should only create the given enums for the only arg');
  t.end();
});

test('humanizeEnums enums:: in map provie custom keys', (t) => {
  const expected = Object
    .entries(SearchPeopleSort.getValues())
    .map((arr) => ({ labelTest: startCase(arr[1]), valueTest: arr[1] }));

  const actual = humanizeEnums(
    SearchPeopleSort,
    {
      format: 'map',
      labelKey: 'labelTest',
      valueKey: 'valueTest',
    },
  );

  t.same(actual, expected, 'it should transform all enums in SearchPeopleSort into human readable map with custom map keys');
  t.end();
});

test('humanizeEnums enums:: the only arg shoud take precedence to expect', (t) => {
  const { CREATED_AT_ASC, CREATED_AT_DESC } = SearchPeopleSort;
  const expected = [
    { label: startCase(CREATED_AT_ASC), value: CREATED_AT_ASC.toString() },
    { label: startCase(CREATED_AT_DESC), value: CREATED_AT_DESC.toString() },
  ];

  const actual = humanizeEnums(
    SearchPeopleSort,
    {
      format: 'map',
      except: [CREATED_AT_ASC],
      only: [CREATED_AT_ASC, CREATED_AT_DESC],
    },
  );

  t.same(actual, expected);
  t.end();
});
