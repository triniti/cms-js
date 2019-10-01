import 'jsdom-global/register';
import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import { Field, FieldArray } from 'redux-form';
import { Card, CardBody } from '@triniti/admin-ui-plugin/components';
import PageV1Mixin from '@triniti/schemas/triniti/canvas/mixin/page/PageV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SlugEditor from '@triniti/cms/plugins/ncr/components/slug-editor';
import PageFields from './index';

const pageSchema = PageV1Mixin.findOne();
const page = pageSchema.createMessage();
const renamePageSchema = resolveSchema(PageV1Mixin, 'command', 'rename-page');
const pageRenamedSchema = resolveSchema(PageV1Mixin, 'event', 'page-renamed');
const getPageRequestSchema = resolveSchema(PageV1Mixin, 'request', 'get-page-request');
const schemas = {
  renameNode: renamePageSchema,
  nodeRenamed: pageRenamedSchema,
  getNodeRequest: getPageRequestSchema,
  node: pageSchema,
};

const isEditMode = true;
let wrapper = shallow(<PageFields
  isEditMode={isEditMode}
  page={page}
  schemas={schemas}
/>);


let titleField = wrapper.find(Field).findWhere((n) => n.props().name === 'title');
let imageRef = wrapper.find(Field).findWhere((n) => n.props().name === 'imageRef');
let layout = wrapper.find(Field).findWhere((n) => n.props().name === 'layout');
let sponsor = wrapper.find(FieldArray).findWhere((n) => n.props().name === 'sponsorRefs');

test('PageFields render', (t) => {
  t.equal(wrapper.find(Field).length, 5, 'it should render correct count Fields components');
  t.equal(wrapper.find(FieldArray).length, 2, 'it should render correct count FieldArray components');
  t.equal(wrapper.find(Card).length, 1, 'it should render Card component');
  t.equal(wrapper.find(CardBody).length, 1, 'it should render CardBody component');
  t.end();
});

test('PageFields isEditMode equals true props test.', (t) => {
  t.equal(titleField.props().readOnly, false, 'title field readonly prop is false');
  t.equal(imageRef.props().isEditMode, true, 'imageRef field isEditMode prop is true');
  t.equal(layout.props().disabled, false, 'layout field disabled prop is false');
  t.equal(sponsor.props().isEditMode, true, 'sponsor field isEditMode prop is false');
  t.end();
});


test('PageFields isEditMode equals false props test.', (t) => {
  wrapper = shallow(<PageFields
    isEditMode={false}
    page={page}
    schemas={schemas}
  />);

  // re-query components for new update
  titleField = wrapper.find(Field).findWhere((n) => n.props().name === 'title');
  imageRef = wrapper.find(Field).findWhere((n) => n.props().name === 'imageRef');
  layout = wrapper.find(Field).findWhere((n) => n.props().name === 'layout');
  sponsor = wrapper.find(FieldArray).findWhere((n) => n.props().name === 'sponsorRefs');

  t.equal(titleField.props().readOnly, true, 'title field readonly prop is true');
  t.equal(imageRef.props().isEditMode, false, 'imageRef field isEditMode prop is false');
  t.equal(layout.props().disabled, true, 'layout field disabled prop is true');
  t.equal(sponsor.props().isEditMode, false, 'sponsor field isEditMode prop is true');
  t.end();
});


test('SlugEditor should be rendered if page is set', (t) => {
  page
    .set('title', 'test')
    .set('description', 'test')
    .set('slug', 'test');

  wrapper = shallow(<PageFields
    isEditMode={false}
    page={page}
    canRename
    schemas={schemas}
  />);

  t.equal(wrapper.find(SlugEditor).length, 1, 'it should render the SlugEditor component');
  t.end();
});
