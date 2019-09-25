import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import Card from '@triniti/admin-ui-plugin/components/card';
import UserV1Mixin from '@gdbots/schemas/gdbots/iam/mixin/user/UserV1Mixin';
import RawContent from '.';

const UserSchema = UserV1Mixin.findOne();
const node = UserSchema.createMessage({ first_name: 'test', last_name: 'last_name_test' });

test('RawContent:: default render', (t) => {
  const wrapper = shallow(<RawContent pbj={node} />);

  t.equal(wrapper.find(Card).length, 1, 'it should be in its own Card');
  t.equal(wrapper.find('pre').text(), JSON.stringify(node, null, 2), 'it should render correct raw data');

  t.end();
});
