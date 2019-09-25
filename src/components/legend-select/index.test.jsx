import 'jsdom-global/register';
import React from 'react';
import test from 'tape';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { Select } from '@triniti/admin-ui-plugin/components';
import LegendSelect from './index';

const onChange = sinon.spy();
const options = [{
  label: 'Label1',
  value: 'value1',
}, {
  label: 'Label2',
  value: 'value2',
}];

const wrapper = shallow(<LegendSelect
  onChange={onChange}
  name="status"
  placeholder="Select"
  options={options}
  value={options[0]}
/>);


test('LegendSelect render', (t) => {
  t.equal(wrapper.props().value.label, 'Label1', 'it should render expected label');
  t.equal(wrapper.props().placeholder, 'Select', 'it should render expected placeholder');
  t.equal(wrapper.props().name, 'status', 'it should render expected name');
  t.equal(wrapper.props().options, options, 'it should render expected options');
  t.equal(wrapper.find(Select).length, 1, 'it should render Select component');
  t.end();
});

test('LegendSelect onChange', (t) => {
  wrapper.simulate('change');
  t.equal(onChange.calledOnce, true, 'it should call the onChange function');
  t.end();
});
