import 'jsdom-global/register';
import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import { Field, FieldArray } from 'redux-form';

import { CardBody, CardCollapse } from '@triniti/admin-ui-plugin/components';

import AdvertisingFields from './index';

const isEditMode = true;
const wrapper = shallow(<AdvertisingFields
  isEditMode={isEditMode}
/>);

test('AdvertisingFields render', (t) => {
  let actual = wrapper.find(CardCollapse).length;
  const expected = 1;
  t.equal(actual, expected, 'it should render a CardCollapse component');

  actual = wrapper.find(CardBody).length;
  t.equal(wrapper.find(CardBody).length, 1, 'it should render CardBody component');

  actual = wrapper.find(FieldArray).length;
  t.equal(wrapper.find(FieldArray).length, 1, 'it should render a FieldArray component');

  actual = wrapper.find(Field).length;
  t.equal(wrapper.find(Field).length, 2, 'it should render 2 Field components');
  t.end();
});

test('AdvancedFields isEditMode === true', (t) => {
  t.false(wrapper.find(Field).at(0).props().disabled, 'Field should be editable');
  t.false(wrapper.find(Field).at(1).props().readOnly, 'Field should be editable');
  t.false(wrapper.find(FieldArray).props().readOnly, 'FieldArray should be editable');
  t.end();
});

test('AdvancedFields isEditMode === false', (t) => {
  wrapper.setProps({ isEditMode: false });
  wrapper.update();

  t.true(wrapper.find(Field).at(0).props().disabled, 'Field should be disabled for editing');
  t.true(wrapper.find(Field).at(1).props().readOnly, 'Field should be disabled for editing');
  t.true(wrapper.find(FieldArray).props().readOnly, 'FieldArray should be readOnly');
  t.end();
});
