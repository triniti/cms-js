import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import UserMixin from '@gdbots/schemas/gdbots/iam/mixin/user/UserV1Mixin';
import UsersTable from './index';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableRow from './TableRow';

const userSchema = UserMixin.findOne();

const users = [];
for (let i = 0; i < 3; i += 1) {
  users.push(userSchema
    .createMessage()
    .set('title', `user${i}`)
    .set('email', `user${i}@example.com`)
    .set('is_staff', i % 2 === 0));
}

test('UsersTable', (t) => {
  const mockSelectUserHandler = sinon.spy();
  const wrapper = shallow(<UsersTable onUserSelect={mockSelectUserHandler} />);

  t.equal(wrapper.find(TableHeader).length, 1, 'it should have 1 TableHeader component');
  t.equal(wrapper.find(TableBody).length, 1, 'it should have 1 TableBody component');

  t.end();
});

test('UsersTable:TableHeader', (t) => {
  const wrapper = shallow(<TableHeader />);

  t.equal(wrapper.find('th').length, 8, 'it should have 8 head columns in the header');

  t.end();
});

test('UsersTable:TableBody', (t) => {
  const selectUserHandler = sinon.spy();
  const wrapper = shallow(<TableBody users={users} onUserSelect={selectUserHandler} />);

  t.equal(wrapper.find('tbody').length, 1, 'it should have one tbody in the jsx');
  t.equal(wrapper.find(TableRow).length, users.length, `it should have ${users.length} rows in the table body`);

  t.end();
});

test('UsersTable:TableRow', (t) => {
  const userIndex = Math.floor(Math.random() * users.length);
  const user = users[userIndex];
  const wrapper = shallow(<TableRow user={user} rowIndex={userIndex + 1} />);

  t.equal(wrapper.find('tr').length, 1, 'it should render one row for tbody');
  t.equal(wrapper.find('th').length, 1, 'it should render one header cell in a row');
  t.equal(wrapper.find('td').length, 7, 'it should render seven table data cell in a row');

  t.end();
});
