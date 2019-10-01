import 'jsdom-global/register';
import React from 'react';
import sinon from 'sinon';
import test from 'tape';
import { shallow } from 'enzyme';
import { Icon } from '@triniti/admin-ui-plugin/components';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import SortButton from './index';

const onSort = sinon.spy();
const wrapper = shallow(
  <SortButton
    currentSort="title-asc"
    onSort={onSort}
    sortFieldAsc="title-asc"
    sortFieldDesc="title-desc"
  />,
);

test('SortButton render', (t) => {
  t.equal(wrapper.find(Icon).length, 1, 'it should render Icon');
  t.equal(wrapper.find(UncontrolledTooltip).length, 1, 'it should render Icon');
  t.equal(wrapper.find(Icon).props().imgSrc, 'caret-down', 'it should render the arrow down Icon');

  wrapper.setProps({ currentSort: 'published-at-asc' });
  wrapper.update();

  t.equal(wrapper.find(Icon).length, 1, 'it should render Icon');
  t.equal(wrapper.find(UncontrolledTooltip).length, 1, 'it should render Icon');
  t.equal(wrapper.find(Icon).props().imgSrc, 'sort', 'it should render the start sort Icon');

  wrapper.setProps({ currentSort: 'title-desc' });
  wrapper.update();

  t.equal(wrapper.find(Icon).length, 1, 'it should render Icon');
  t.equal(wrapper.find(UncontrolledTooltip).length, 1, 'it should render Icon');
  t.equal(wrapper.find(Icon).props().imgSrc, 'caret-up', 'it should render the arrow up Icon');
  t.end();
});


test('SortButton onSort', (t) => {
  wrapper.find(Icon).simulate('click');
  t.equal(onSort.calledOnce, true, 'it should call the onSort function');
  t.end();
});
