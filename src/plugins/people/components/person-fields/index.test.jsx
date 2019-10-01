import 'jsdom-global/register';
import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import { Field } from 'redux-form';

import { Card, CardBody } from '@triniti/admin-ui-plugin/components';
import PersonV1Mixin from '@triniti/schemas/triniti/people/mixin/person/PersonV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SlugEditor from '@triniti/cms/plugins/ncr/components/slug-editor';

import PersonFields from './index';


const personSchema = PersonV1Mixin.findOne();
const renamePersonSchema = resolveSchema(PersonV1Mixin, 'command', 'rename-person');
const personRenamedSchema = resolveSchema(PersonV1Mixin, 'event', 'person-renamed');
const getPersonRequestSchema = resolveSchema(PersonV1Mixin, 'request', 'get-person-request');

const schemas = {
  renameNode: renamePersonSchema,
  nodeRenamed: personRenamedSchema,
  getNodeRequest: getPersonRequestSchema,
  node: personSchema,
};

const person = personSchema.createMessage().set('title', 'test person').set('slug', 'test-person');
const isEditMode = true; // make it in view mode
let wrapper = shallow(<PersonFields
  isEditMode={isEditMode}
  person={person}
  schemas={schemas}
/>);

let titleField = wrapper.find(Field).findWhere((n) => n.props().name === 'title');
let imageRef = wrapper.find(Field).findWhere((n) => n.props().name === 'imageRef');
let bio = wrapper.find(Field).findWhere((n) => n.props().name === 'bio');

test('PersonFields render', (t) => {
  t.equal(wrapper.find(Field).length, 8, 'it should render correct count Fields components');
  t.equal(wrapper.find(Card).length, 1, 'it should render Card component');
  t.equal(wrapper.find(CardBody).length, 1, 'it should render CardBody component');
  t.equal(imageRef.length, 1, 'it should render the imageRef field');
  t.equal(bio.length, 1, 'it should render the bio field');
  t.end();
});

test('PersonFields isEditMode equals true props test.', (t) => {
  t.equal(titleField.props().readOnly, false, 'title field readonly prop is false');
  t.equal(imageRef.props().isEditMode, true, 'imageRef\'s isEditMode prop is true');
  t.equal(bio.props().readOnly, false, 'bio field readonly prop is false');
  t.end();
});

test('PersonFields isEditMode equals false props test.', (t) => {
  wrapper = shallow(<PersonFields
    isEditMode={false}
    person={person}
    schemas={schemas}
  />);

  titleField = wrapper.find(Field).findWhere((n) => n.props().name === 'title');
  imageRef = wrapper.find(Field).findWhere((n) => n.props().name === 'imageRef');
  bio = wrapper.find(Field).findWhere((n) => n.props().name === 'bio');

  t.equal(titleField.props().readOnly, true, 'title field readonly prop is true');
  t.equal(bio.props().readOnly, true, 'bio field readonly prop is true');
  t.equal(imageRef.props().isEditMode, false, 'imageRef\'s isEditMode prop is false');
  t.end();
});

test('it should render SlugEditor', (t) => {
  wrapper = shallow(<PersonFields
    isEditMode
    person={person}
    schemas={schemas}
    canRename
  />);

  t.equal(wrapper.find(SlugEditor).length, 1, 'it should render the SlugEditor component');

  t.end();
});
