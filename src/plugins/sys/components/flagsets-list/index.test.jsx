import 'jsdom-global/register';
import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import { Card, RouterLink, Table } from '@triniti/admin-ui-plugin/components';
import FlagsetV1Mixin from '@triniti/schemas/triniti/sys/mixin/flagset/FlagsetV1Mixin';
import FlagsetId from '@triniti/schemas/triniti/sys/FlagsetId';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

import FlagsetsList from './index';

const nodeRef1 = NodeRef.fromNode(FlagsetV1Mixin.findOne().createMessage().set('_id', FlagsetId.fromString('flag1')));
const nodeRef2 = NodeRef.fromNode(FlagsetV1Mixin.findOne().createMessage().set('_id', FlagsetId.fromString('flag2')));
const nodeRef3 = NodeRef.fromNode(FlagsetV1Mixin.findOne().createMessage().set('_id', FlagsetId.fromString('flag3')));
const nodeRef4 = NodeRef.fromNode(FlagsetV1Mixin.findOne().createMessage().set('_id', FlagsetId.fromString('flag4')));

const flagsetRefs = [
  nodeRef1,
  nodeRef2,
  nodeRef3,
  nodeRef4,
];

const wrapper = shallow(<FlagsetsList
  flagsetRefs={flagsetRefs}
/>);

test('FlagsetsList render', (t) => {
  t.equal(wrapper.find(Card).length, 1, 'it should render correct count of Card');
  t.equal(wrapper.find(Table).length, 1, 'it should render correct count of Table');
  t.equal(wrapper.find(Table).find('tr').length, 5, 'it should render correct tr count');
  t.equal(wrapper.find(Table).find(RouterLink).length, 8, 'it should render correct RouterLink count');
  t.end();
});
