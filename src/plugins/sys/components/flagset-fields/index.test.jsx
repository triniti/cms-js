import 'jsdom-global/register';
import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import { Field, FieldArray } from 'redux-form';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';

import FlagsetFields from './index';

const wrapper = shallow(<FlagsetFields
  isEditMode
/>);

const titleField = wrapper.find(Field).findWhere((n) => n.props().name === 'title');
const stringFlagsField = wrapper.find(FieldArray).findWhere((n) => n.props().name === 'strings');
const intFlagsField = wrapper.find(FieldArray).findWhere((n) => n.props().name === 'ints');
const booleanFlagsField = wrapper.find(FieldArray).findWhere((n) => n.props().name === 'booleans');
const trinaryFlagsField = wrapper.find(FieldArray).findWhere((n) => n.props().name === 'trinaries');
const floatFlagsField = wrapper.find(FieldArray).findWhere((n) => n.props().name === 'floats');


test('FlagsetFields render', (t) => {
  t.equal(wrapper.find(Field).length, 1, 'it should render correct count Field components');
  t.equal(wrapper.find(FieldArray).length, 5, 'it should render correct count of field arrays');
  t.equal(wrapper.find(CardBody).length, 1, 'it should render CardBody component');
  t.equal(wrapper.find(Card).length, 1, 'it should render Card component');
  t.equal(wrapper.find(CardHeader).length, 1, 'it should render Card component');
  t.end();
});

test('FlagsetFields isEditMode equals true props test.', (t) => {
  t.equal(titleField.props().readOnly, true, 'title field readonly is always true');
  t.equal(stringFlagsField.props().readOnly, false, 'string_flags field readonly prop is false');
  t.equal(intFlagsField.props().readOnly, false, 'int_flags field readonly prop is false');
  t.equal(booleanFlagsField.props().readOnly, false, 'boolean_flags field readonly prop is false');
  t.equal(trinaryFlagsField.props().readOnly, false, 'trinary_flags field readonly prop is false');
  t.equal(floatFlagsField.props().readOnly, false, 'float_flags field readonly prop is false');
  t.end();
});
