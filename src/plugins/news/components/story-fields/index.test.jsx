import 'jsdom-global/register';
import React from 'react';
import test from 'tape';
import { Field } from 'redux-form';
import { shallow } from 'enzyme';

import ArticleV1Mixin from '@triniti/schemas/triniti/news/mixin/article/ArticleV1Mixin';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SlugEditor from '@triniti/cms/plugins/ncr/components/slug-editor';
import { Card, CardBody } from '@triniti/admin-ui-plugin/components';
import StoryFields from './index';

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
  t.equal(wrapper.find(Field).length, 3, 'it should render correct count Fields components');
  t.equal(wrapper.find(Card).length, 1, 'it should render Card component');
  t.equal(wrapper.find(CardBody).length, 1, 'it should render CardBody component');
  t.equal(classification.length, 1, 'it should render the classification field');
  t.equal(wrapper.find(SlugEditor).length, 1, 'it should render the SlugEditor component');
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
