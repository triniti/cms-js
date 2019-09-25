import React from 'react';
import test from 'tape';
import { mount } from 'enzyme';
import { configure, localize, withLocalize } from './Localization';

test('Utils:services:Localization:localize[unconfigured]', (t) => {
  const actual = localize('whatever');
  const expected = 'whatever';
  t.equal(actual, expected, 'when unconfigured it should not translate');

  t.end();
});

test('Utils:services:Localization:localize[configured]', (t) => {
  const localizationMap = new Map([
    ['triniti', '3neety'],
  ]);

  configure(localizationMap);

  let actual = localize('triniti');
  let expected = '3neety';
  t.equal(actual, expected, 'when configured it should translate words it is configured for');

  actual = localize('whatever');
  expected = 'whatever';
  t.equal(actual, expected, 'when configured it should not translate words it is not configured for');

  t.end();
});

test('Utils:services:Localization:withLocalize', (t) => {
  const localizationMap = new Map([
    ['triniti', '3neety'],
  ]);

  configure(localizationMap);

  const ComponentA = () => <div />;
  const ComponentB = (props) => <ComponentA {...props} />;
  const WithLocalize = withLocalize(ComponentB);
  const wrapper = mount(<WithLocalize />);

  let actual = wrapper.children().props().localize;
  let expected = localize;
  t.equal(
    actual,
    expected,
    'component wrapped with withLocalize should have localize function',
  );

  actual = wrapper.children().props().localize('triniti');
  expected = '3neety';
  t.equal(
    actual,
    expected,
    'component wrapped with withLocalize should have localize function that translates "triniti" to "3neety"',
  );

  actual = wrapper.children().props().localize('3neety');
  expected = '3neety';
  t.equal(
    actual,
    expected,
    'component wrapped with withLocalize should have localize function that does not translate "3neety"',
  );

  t.end();
});
