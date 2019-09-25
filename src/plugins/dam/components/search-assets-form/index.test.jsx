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
import SearchAssetsRequestV1Mixin from '@triniti/schemas/triniti/dam/mixin/search-assets-request/SearchAssetsRequestV1Mixin';
import LegendSelect from '@triniti/cms/components/legend-select';
import SearchAssetsForm from './index';

const getNode = () => {};
const inputRef = sinon.spy();
const onSubmit = sinon.spy();
const onUnSelectAllRows = sinon.spy();
const q = '';
const request = SearchAssetsRequestV1Mixin.findOne().createMessage();
const sort = '';
const statuses = [];
const types = ['images'];

const wrapper = shallow(<SearchAssetsForm
  currentPage={1}
  getNode={getNode}
  inputRef={inputRef}
  onSubmit={onSubmit}
  onUnSelectAllRows={onUnSelectAllRows}
  q={q}
  request={request}
  schemas={{}}
  sort={sort}
  statuses={statuses}
  types={types}
/>);

test('SearchAssetsForm render', (t) => {
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

test('SearchAssetsForm DropdownItem onClick test', (t) => {
  wrapper.find(DropdownItem).last().simulate('click', { currentTarget: { textContent: 'unknown' } });
  t.equal(onSubmit.calledOnce, true, 'it should call the onSubmit function');
  t.end();
});

test('SearchAssetsForm Field onChange test', (t) => {
  wrapper.find(Input).simulate('click', { target: { value: 'test' } });
  t.equal(onSubmit.calledOnce, true, 'it should call the onSubmit function');
  t.end();
});
