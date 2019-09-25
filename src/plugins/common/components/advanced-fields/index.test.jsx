import 'jsdom-global/register';
import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import { FieldArray } from 'redux-form';

import { CardBody, CardCollapse } from '@triniti/admin-ui-plugin/components';

import AdvancedFields from './index';

const isEditMode = true;
const wrapper = shallow(<AdvancedFields
  isEditMode={isEditMode}
/>);

test('AdvancedFields render', (t) => {
  let actual = wrapper.find(CardCollapse).length;
  const expected = 1;
  t.equal(actual, expected, 'it should render a CardCollapse component');

  actual = wrapper.find(CardBody).length;
  t.equal(wrapper.find(CardBody).length, 1, 'it should render CardBody component');

  actual = wrapper.find(FieldArray).length;
  t.equal(wrapper.find(FieldArray).length, 1, 'it should render a FieldArray component');
  t.end();
});

test('AdvancedFields isEditMode === true', (t) => {
  t.false(wrapper.find(FieldArray).props().readOnly, 'FieldArray should be editable');
  t.end();
});

test('AdvancedFields isEditMode === false', (t) => {
  wrapper.setProps({ isEditMode: false });
  wrapper.update();

  t.true(wrapper.find(FieldArray).props().readOnly, 'FieldArray should be readOnly');
  t.end();
});
