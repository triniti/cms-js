import React from 'react';
import test from 'tape';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import {
  Button,
  ButtonGroup,
  Icon,
} from '@triniti/admin-ui-plugin/components';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';

import { SearchViewButtons } from './index';

const view = 'card';
const handleChangeView = sinon.spy();
const wrapper = shallow(<SearchViewButtons
  delegate={{
    handleChangeView,
  }}
  view={view}
/>);

test('SearchViewButtons', (t) => {
  t.equal(wrapper.find(Button).length, 2, 'it should render Buttons component');
  t.equal(wrapper.find(ButtonGroup).length, 1, 'it should render ButtonGroup component');
  t.equal(wrapper.find(Icon).length, 2, 'it should render Icon component');
  t.equal(wrapper.find(UncontrolledTooltip).length, 2, 'it should render UncontrolledTooltip component');
  t.end();
});

test('SearchViewButtons click card view button', (t) => {
  wrapper.find(Button).at(0).simulate('click');
  t.equal(handleChangeView.called, true, 'it should call the handleChangeView function');
  t.end();
});

test('SearchViewButtons click table view button', (t) => {
  wrapper.find(Button).at(1).simulate('click');
  t.equal(handleChangeView.called, true, 'it should call the handleChangeView function');
  t.end();
});
