import 'jsdom-global/register';
import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import CardBody from '@triniti/admin-ui-plugin/components/card-body';
import UserMixin from '@gdbots/schemas/gdbots/iam/mixin/user/UserV1Mixin';
import UserDetails from './index';

const userSchema = UserMixin.findOne();

const user = userSchema.createMessage()
  .set('title', 'user1')
  .set('first_name', 'fn')
  .set('email', 'user1@example.com')
  .set('is_staff', true);

test('UserDetails render with user', (t) => {
  const wrapperWithUser = shallow(<UserDetails user={user} />);
  const s = wrapperWithUser.find(CardBody);

  t.equal(s.length, 1, 'it should render one section');
  t.equal(wrapperWithUser.find('p').length, 7, 'it should render eight rows of user details');
  t.equal(
    s.childAt(0).html(),
    `<p><strong>Email: </strong> ${user.get('email')}</p>`,
    'it render the correct user email',
  );
  t.equal(
    s.childAt(1).html(),
    `<p><strong>First Name: </strong> ${user.get('first_name')}</p>`,
    'it render the correct user first name',
  );
  t.equal(
    s.childAt(2).html(),
    '<p><strong>Last Name: </strong> </p>',
    'it render the correct user last name',
  );
  t.equal(
    s.childAt(3).html(),
    `<p><strong>Is Staff: </strong> ${(user.get('is_staff') ? 'Yes' : 'No')}</p>`,
    'it render the correct user title',
  );
  t.equal(
    s.childAt(4).html(),
    `<p><strong>Is Blocked: </strong> ${(user.get('is_block') ? 'Yes' : 'No')}</p>`,
    'it render the correct user title',
  );

  t.end();
});
