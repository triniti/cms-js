import React from 'react';
import test from 'tape';
import { Field, FieldArray } from 'redux-form';
import { shallow } from 'enzyme';

import ArticleV1Mixin from '@triniti/schemas/triniti/news/mixin/article/ArticleV1Mixin';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';

import TaxonomyFields from './index';

const schemas = {
  node: ArticleV1Mixin.findOne(),
};
const wrapper = shallow(<TaxonomyFields schemas={schemas} />);
let categories = wrapper.find(FieldArray).findWhere((n) => n.props().name === 'categoryRefs');
let channel = wrapper.find(FieldArray).findWhere((n) => n.props().name === 'channelRefs');
let hashtags = wrapper.find(Field).findWhere((n) => n.props().name === 'hashtags');
let relatedPeople = wrapper.find(FieldArray).findWhere((n) => n.props().name === 'personRefs');
let primaryPeople = wrapper.find(FieldArray).findWhere((n) => n.props().name === 'primaryPersonRefs');

test('TaxonomyFields render', (t) => {
  t.equal(wrapper.find(Card).length, 1, 'it should render one Card component');
  t.equal(wrapper.find(CardHeader).length, 1, 'it should render one CardHeader component');
  t.equal(wrapper.find(CardBody).length, 1, 'it should render one CardBody component');
  t.equal(wrapper.find(Field).length, 1, 'correct number of Fields must be rendered');
  t.equal(wrapper.find(FieldArray).length, 4, 'correct number of FieldArrays must be rendered');
  t.end();
});

test('isEditMode is set to true', (t) => {
  t.equal(categories.props().isEditMode, true, 'categoryRefs field isEditMode prop should be true');
  t.equal(channel.props().isEditMode, true, 'channelRefs field isEditMode prop should be true');
  t.equal(hashtags.props().isEditMode, true, 'hashtags field disabled prop should be false');
  t.equal(relatedPeople.props().isEditMode, true, 'relatedPeople field disabled prop should be false');
  t.equal(primaryPeople.props().isEditMode, true, 'primaryPeople field disabled prop should be false');
  t.end();
});

test('isEditMode is set to false', (t) => {
  wrapper.setProps({ isEditMode: false, schemas });

  // get the updated nodes in the tree
  categories = wrapper.find(FieldArray).findWhere((n) => n.props().name === 'categoryRefs');
  channel = wrapper.find(FieldArray).findWhere((n) => n.props().name === 'channelRefs');
  hashtags = wrapper.find(Field).findWhere((n) => n.props().name === 'hashtags');
  relatedPeople = wrapper.find(FieldArray).findWhere((n) => n.props().name === 'personRefs');
  primaryPeople = wrapper.find(FieldArray).findWhere((n) => n.props().name === 'primaryPersonRefs');

  t.equal(categories.props().isEditMode, false, 'categoryRefs field isEditMode prop should be false');
  t.equal(channel.props().isEditMode, false, 'channelRefs field isEditMode prop should be false');
  t.equal(hashtags.props().isEditMode, false, 'hashtags field disabled prop should be true');
  t.equal(relatedPeople.props().isEditMode, false, 'relatedPeople field disabled prop should be true');
  t.equal(primaryPeople.props().isEditMode, false, 'primaryPeople field disabled prop should be true');
  t.end();
});
