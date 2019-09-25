import 'jsdom-global/register';
import React from 'react';
import test from 'tape';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import {
  Checkbox,
  FormGroup,
} from '@triniti/admin-ui-plugin/components';
import MasterCheckbox from './index';

const onChange = sinon.spy();
const wrapper = shallow(<MasterCheckbox
  onChange={onChange}
  isSelected
/>);

test('MasterCheckbox render', (t) => {
  t.equal(wrapper.find(Checkbox).length, 1, 'it should render the Checkbox component');
  t.equal(wrapper.find(FormGroup).length, 1, 'it should render FormGroup component');
  t.end();
});

test('MasterCheckbox onChange', (t) => {
  wrapper.find(Checkbox).simulate('change');
  t.equal(onChange.called, true, 'it should call the onChange function');
  t.end();
});
