import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import {
  Button,
  Card,
  CardBody,
  Form,
  Icon,
  InputGroup,
  InputGroupAddon,
} from '@triniti/admin-ui-plugin/components';
import LegendSelect from '@triniti/cms/components/legend-select';
import SearchUsersForm from './index';

const q = '';
const inputRef = sinon.spy();
const onSubmit = sinon.spy();
const userStatus = 'published';
const wrapper = shallow(<SearchUsersForm
  q={q}
  inputRef={inputRef}
  onSubmit={onSubmit}
  userStatus={userStatus}
/>);

test('SearchUsersForm render', (t) => {
  t.equal(wrapper.find('.form-control').length, 1);
  t.equal(wrapper.find(Button).length, 1, 'it should have correct count of Button component');
  t.equal(wrapper.find(LegendSelect).length, 1, 'it should have correct count of LegendSelect component');
  t.equal(wrapper.find(Card).length, 1, 'it should have correct count of Card component');
  t.equal(wrapper.find(CardBody).length, 1, 'it should have correct count of CardBody component');
  t.equal(wrapper.find(Form).length, 1, 'it should have correct count of Form component');
  t.equal(wrapper.find(InputGroup).length, 1, 'it should have correct count of InputGroup component');
  t.equal(wrapper.find(InputGroupAddon).length, 2, 'it should have correct count of InputGroupAddon component');
  t.equal(wrapper.find(Icon).length, 1, 'it should have correct count of Icon component');
  t.end();
});


test('SearchUsersForm search', (t) => {
  wrapper.find('.form-control').simulate('change', { target: { value: 'title' } });
  t.equal(onSubmit.callCount, 1, 'it should trigger requestHandler when input change');
  t.end();
});
