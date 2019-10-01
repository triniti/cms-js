import 'jsdom-global/register';
import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import { Field } from 'redux-form';

import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import RedirectV1Mixin from '@triniti/schemas/triniti/sys/mixin/redirect/RedirectV1Mixin';

import RedirectFields from './index';

const redirectSchema = RedirectV1Mixin.findOne();
const redirect = redirectSchema.createMessage();

redirect
  .set('title', 'test/url')
  .set('redirect_to', 'test/url');

const isEditMode = true; // make it in view mode
const wrapper = shallow(<RedirectFields
  isEditMode={isEditMode}
/>);

let titleField = wrapper.find(Field).findWhere((n) => n.props().name === 'title');
let redirectToField = wrapper.find(Field).findWhere((n) => n.props().name === 'redirectTo');
let isVanityCheckboxField = wrapper.find(Field).findWhere((n) => n.props().name === 'isVanity');
let isPermanentCheckboxField = wrapper.find(Field).findWhere((n) => n.props().name === 'isPermanent');

test('RedirectFields render[create node]', (t) => {
  t.equal(wrapper.find(Field).length, 2, 'it should render correct count Fields components');
  t.equal(wrapper.find(Card).length, 1, 'it should render Card component');
  t.equal(wrapper.find(CardBody).length, 1, 'it should render CardBody component');
  t.equal(wrapper.find(CardHeader).length, 0, 'it should not render CardHeader component');
  t.equal(titleField.length, 1, 'it should render the title field');
  t.equal(redirectToField.length, 1, 'it should render the redirect to field');
  t.equal(isVanityCheckboxField.length, 0, 'it should not render the is vanity checkbox field');
  t.equal(isPermanentCheckboxField.length, 0, 'it should not render the is permanent checkbox field');
  t.end();
});


test('RedirectFields render[update node]', (t) => {
  wrapper.setProps({ redirect });
  wrapper.update();

  titleField = wrapper.find(Field).findWhere((n) => n.props().name === 'title');
  redirectToField = wrapper.find(Field).findWhere((n) => n.props().name === 'redirectTo');
  isVanityCheckboxField = wrapper.find(Field).findWhere((n) => n.props().name === 'isVanity');
  isPermanentCheckboxField = wrapper.find(Field).findWhere((n) => n.props().name === 'isPermanent');

  t.equal(wrapper.find(Field).length, 4, 'it should render correct count Fields components');
  t.equal(wrapper.find(Card).length, 1, 'it should render Card component');
  t.equal(wrapper.find(CardBody).length, 1, 'it should render CardBody component');
  t.equal(wrapper.find(CardHeader).length, 1, 'it should render CardHeader component');
  t.equal(titleField.length, 1, 'it should render the title field');
  t.equal(redirectToField.length, 1, 'it should render the redirect to field');
  t.equal(isVanityCheckboxField.length, 1, 'it should render the is vanity checkbox field');
  t.equal(isPermanentCheckboxField.length, 1, 'it should render the is permanent checkbox field');
  t.end();
});
