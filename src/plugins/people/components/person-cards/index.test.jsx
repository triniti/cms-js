import 'jsdom-global/register';
import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import PersonV1Mixin from '@triniti/schemas/triniti/people/mixin/person/PersonV1Mixin';
import {
  Card,
  CardBody,
  Row,
  Col,
} from '@triniti/admin-ui-plugin/components';
import PersonCards from './index';

const personSchema = PersonV1Mixin.findOne();

const person = personSchema.createMessage()
  .set('title', 'test')
  .set('slug', 'test')
  .set('seo_title', 'test');


const wrapper = shallow(<PersonCards nodes={[person]} />);

test('PersonCards render', (t) => {
  t.equal(wrapper.find(Card).length, 1, 'it should render all Card components');
  t.equal(wrapper.find(CardBody).length, 1, 'it should render CardBody component');
  t.equal(wrapper.find(Row).length, 1, 'it should render Row component');
  t.equal(wrapper.find(Row).find(Col).length, 2, 'it should render all Cols components');
  t.end();
});
