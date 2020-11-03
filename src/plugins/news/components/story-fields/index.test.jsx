import 'jsdom-global/register';
import proxyquire from 'proxyquire';
import React from 'react';
import test from 'tape';
import { Field, FieldArray } from 'redux-form';
import { shallow } from 'enzyme';
import ArticleV1Mixin from '@triniti/schemas/triniti/news/mixin/article/ArticleV1Mixin';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SlugEditor from '@triniti/cms/plugins/ncr/components/slug-editor';
import { Card, CardBody } from '@triniti/admin-ui-plugin/components';

proxyquire.noCallThru();
const mockedConfig = [{ label: 'label', value: 'value' }];
const StoryFields = proxyquire('./index', { 'config/slottingConfig': mockedConfig }).default;

const schemas = {
  getNodeRequest: resolveSchema(ArticleV1Mixin, 'request', 'get-article-request'),
  node: ArticleV1Mixin.findOne(),
  nodeRenamed: resolveSchema(ArticleV1Mixin, 'event', 'article-renamed'),
  renameNode: resolveSchema(ArticleV1Mixin, 'command', 'rename-article'),
};
const wrapper = shallow(<StoryFields
  isEditMode
  nodeRef={NodeRef.fromNode(schemas.node.createMessage())}
  schemas={schemas}
/>);
const wrapper2 = shallow(<StoryFields
  isEditMode={false}
  nodeRef={NodeRef.fromNode(schemas.node.createMessage())}
  schemas={schemas}
/>);
let titleField = wrapper.find(Field).findWhere((n) => n.props().name === 'title');
let classification = wrapper.find(Field).findWhere((n) => n.props().name === 'classification');

test('StoryFields render', (t) => {
  const slottingFieldArray = wrapper2.find(FieldArray).findWhere((n) => n.props().name === 'slotting');
  t.equal(wrapper.find(Field).length, 4, 'it should render correct count Fields components');
  t.equal(wrapper.find(Card).length, 1, 'it should render Card component');
  t.equal(wrapper.find(CardBody).length, 1, 'it should render CardBody component');
  t.equal(classification.length, 1, 'it should render the classification field');
  t.equal(wrapper.find(SlugEditor).length, 1, 'it should render the SlugEditor component');
  t.equal(slottingFieldArray.props().selectFieldOptions, mockedConfig, 'it should render a correct slotting config');
  t.end();
});

test('StoryFields isEditMode equals true props test.', (t) => {
  t.equal(titleField.props().readOnly, false, 'title field readonly prop is false');
  t.true(classification.props().isEditMode, 'classification field id in edit mode');
  t.end();
});

test('StoryFields isEditMode equals false props test.', (t) => {
  titleField = wrapper2.find(Field).findWhere((n) => n.props().name === 'title');
  classification = wrapper2.find(Field).findWhere((n) => n.props().name === 'classification');

  t.equal(titleField.props().readOnly, true, 'title field readonly prop is true');
  t.false(classification.props().isEditMode, 'classification field is not in edit mode');
  t.end();
});
