import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import PersonV1Mixin from '@triniti/schemas/triniti/people/mixin/person/PersonV1Mixin';
import PeopleTable from './index';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

const personSchema = PersonV1Mixin.findOne();

const people = [];
const peopleCount = 3;
for (let i = 0; i < peopleCount; i += 1) {
  people.push(personSchema.createMessage().set('title', `person${i}`));
}

const onSelectRow = sinon.spy();
const onChangeAllRows = sinon.spy();
const onSort = sinon.spy();
const sort = 'fake-sort';

test('PeopleTable', (t) => {
  const wrapper = shallow(<PeopleTable
    onSelectRow={onSelectRow}
    onSort={onSort}
    onChangeAllRows={onChangeAllRows}
    nodes={people}
    sort={sort}
  />);

  t.equal(wrapper.find(TableHeader).length, 1, 'it should have 1 TableHeader component');
  t.equal(wrapper.find(TableBody).length, 1, 'it should have 1 TableBody component');
  t.equal(wrapper.find(TableBody).props().people.length, peopleCount, 'it should have correct count of people');

  t.end();
});

test('TableHeader', (t) => {
  const wrapper = shallow(<TableHeader
    onChangeAllRows={onChangeAllRows}
    onSort={onSort}
    sort={sort}
  />);

  t.equal(wrapper.find('th').length, 7, 'it should have 7 head columns in the header');
  t.end();
});
