import 'jsdom-global/register';
import React from 'react';
import test from 'tape';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import {
  Card,
  CardBody,
  Icon,
  Input,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from '@triniti/admin-ui-plugin/components';
import LegendSelect from '@triniti/cms/components/legend-select';

import SearchRedirectForm from './index';

const q = '';
const inputRef = sinon.spy();
const onSubmit = sinon.spy();
const onUnSelectAllRows = sinon.spy();
const statuses = [];
const sort = '';

const wrapper = shallow(<SearchRedirectForm
  currentPage={1}
  inputRef={inputRef}
  q={q}
  onSubmit={onSubmit}
  onUnSelectAllRows={onUnSelectAllRows}
  statuses={statuses}
  sort={sort}
  schemas={{}}
/>);


test('SearchRedirectForm render', (t) => {
  t.equal(wrapper.find(Input).length, 1, 'it should render search field');
  t.equal(wrapper.find(Card).length, 1, 'it should render Card component');
  t.equal(wrapper.find(CardBody).length, 1, 'it should render CardBody component');
  t.equal(wrapper.find(Icon).length, 2, 'it should render Icon component');
  t.equal(wrapper.find(UncontrolledButtonDropdown).length, 1, 'it should render ButtonDropdown component');
  t.equal(wrapper.find(DropdownToggle).length, 1, 'it should render DropdownToggle component');
  t.equal(wrapper.find(DropdownMenu).length, 1, 'it should render DropdownMenu component');
  t.equal(wrapper.find(LegendSelect).length, 1, 'it should render LegendSelect component');
  t.end();
});

test('SearchRedirectForm DropdownItem onClick test', (t) => {
  wrapper.find(DropdownItem).last().simulate('click', { currentTarget: { textContent: 'unknown' } });
  t.equal(onSubmit.calledOnce, true, 'it should call the onSubmit function');
  t.end();
});

test('SearchRedirectForm Field onChange test', (t) => {
  wrapper.find(Input).simulate('click', { target: { value: 'test' } });
  t.equal(onSubmit.calledOnce, true, 'it should call the onSubmit function');
  t.end();
});
