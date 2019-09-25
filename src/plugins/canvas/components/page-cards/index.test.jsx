import 'jsdom-global/register';
import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import PageV1Mixin from '@triniti/schemas/triniti/canvas/mixin/page/PageV1Mixin';
import {
  Card,
  CardBody,
  Row,
  Col,
} from '@triniti/admin-ui-plugin/components';
import PageCards from './index';

const pageSchema = PageV1Mixin.findOne();

const page = pageSchema.createMessage()
  .set('title', 'test')
  .set('description', 'test')
  .set('slug', 'test')
  .set('seo_title', 'test');


const wrapper = shallow(<PageCards nodes={[page]} />);

test('PageCards render', (t) => {
  t.equal(wrapper.find(Card).length, 1, 'it should render all Card components');
  t.equal(wrapper.find(CardBody).length, 1, 'it should render CardBody component');
  t.equal(wrapper.find(Row).length, 1, 'it should render Row component');
  t.equal(wrapper.find(Row).find(Col).length, 2, 'it should render all Cols components');
  t.end();
});
