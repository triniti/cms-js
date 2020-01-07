import test from 'tape';
import getPinterestPinId from './getPinterestPinUrl';

test('PinterestPinBlock', (t) => {
  const id = '811070214128171365';
  const actual = getPinterestPinId(id);
  const expected = 'https://pinterest.com/pin/811070214128171365';
  t.equal(actual, expected, 'it should accept a valid pinterest pin id and return https://pinterest.com/pin/811070214128171365');
  t.end();
});

test('PinterestPinBlock', (t) => {
  const id = 'lkskdouqwgh79-3jkjdfahs';
  const actual = getPinterestPinId(id);
  const expected = '';
  t.equal(actual, expected, 'it should accept an invalid pin id and return empty string');
  t.end();
});

test('PinterestPinBlock', (t) => {
  const url = 'https://www.pinterest.com/pin/811070214128171365/';
  const actual = getPinterestPinId(url);
  const expected = 'https://www.pinterest.com/pin/811070214128171365';
  t.equal(actual, expected, 'it should accept a pinterest pin embed url and return https://www.pinterest.com/pin/811070214128171365');
  t.end();
});

test('PinterestPinBlock', (t) => {
  const url = '<a data-pin-do="embedPin" data-pin-width="large" href="https://www.pinterest.com/pin/811070214128171365/"></a>';
  const actual = getPinterestPinId(url);
  const expected = 'https://www.pinterest.com/pin/811070214128171365';
  t.equal(actual, expected, 'it should accept a pinterest pin embed code and return https://www.pinterest.com/pin/811070214128171365');
  t.end();
});
