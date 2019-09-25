import 'jsdom-global/register';
import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import { Card, CardBody } from '@triniti/admin-ui-plugin/components';
import { Field } from 'redux-form';
import Seo from './index';

const isEditMode = true; // default to edit mode
// eslint-disable-next-line function-paren-newline
const wrapper = shallow(
  <Seo
    isEditMode={isEditMode}
  />,
);

let seoTitle = wrapper.find(Field).findWhere((n) => n.props().name === 'seoTitle');
let metaDescription = wrapper.find(Field).findWhere((n) => n.props().name === 'metaDescription');
let metaKeywords = wrapper.find(Field).findWhere((n) => n.props().name === 'metaKeywords');
let isUnlisted = wrapper.find(Field).findWhere((n) => n.props().name === 'isUnlisted');


test('Details render', (t) => {
  t.equal(wrapper.find(Field).length, 6, 'it should render all Fields components');
  t.equal(wrapper.find(Card).length, 1, 'it should render Card component');
  t.equal(wrapper.find(CardBody).length, 1, 'it should render CardBody component');
  t.end();
});

test('SeoFields isEditMode equals true props test.', (t) => {
  t.equal(seoTitle.props().readOnly, false, 'seoTitle field readonly prop is false');
  t.equal(metaDescription.props().readOnly, false, 'metaDescription field readonly prop is false');
  t.equal(metaKeywords.props().disabled, false, 'metaKeywords field readonly prop is false');
  t.equal(isUnlisted.props().disabled, false, 'isUnlisted field readonly prop is false');
  t.end();
});


test('SeoFields isEditMode equals false props test.', (t) => {
  wrapper.setProps({ isEditMode: false });
  wrapper.update();

  // re-query components for new update
  seoTitle = wrapper.find(Field).findWhere((n) => n.props().name === 'seoTitle');
  metaDescription = wrapper.find(Field).findWhere((n) => n.props().name === 'metaDescription');
  metaKeywords = wrapper.find(Field).findWhere((n) => n.props().name === 'metaKeywords');
  isUnlisted = wrapper.find(Field).findWhere((n) => n.props().name === 'isUnlisted');

  t.equal(seoTitle.props().readOnly, true, 'seoTitle field readonly prop is true');
  t.equal(metaDescription.props().readOnly, true, 'metaDescription field readonly prop is true');
  t.equal(metaKeywords.props().disabled, true, 'metaKeywords field readonly prop is true');
  t.equal(isUnlisted.props().disabled, true, 'isUnlisted field readonly prop is true');
  t.end();
});
