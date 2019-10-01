import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import RedirectV1Mixin from '@triniti/schemas/triniti/sys/mixin/redirect/RedirectV1Mixin';
import RedirectsTable from './index';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

const redirectSchema = RedirectV1Mixin.findOne();

const redirects = [];
const redirectsCount = 3;
for (let i = 0; i < redirectsCount; i += 1) {
  redirects.push(redirectSchema.createMessage().set('title', `test/url/${i}`).set('redirect_to', `test/url/${i}`));
}

const onSelectRow = sinon.spy();
const onChangeAllRows = sinon.spy();
const onSort = sinon.spy();
const sort = 'fake-sort';

test('RedirectsTable', (t) => {
  const wrapper = shallow(<RedirectsTable
    onSelectRow={onSelectRow}
    onSort={onSort}
    onChangeAllRows={onChangeAllRows}
    nodes={redirects}
    sort={sort}
  />);

  t.equal(wrapper.find(TableHeader).length, 1, 'it should have 1 TableHeader component');
  t.equal(wrapper.find(TableBody).length, 1, 'it should have 1 TableBody component');
  t.equal(wrapper.find(TableBody).props().redirects.length, redirectsCount, 'it should have correct count of redirects');

  t.end();
});

test('TableHeader', (t) => {
  const wrapper = shallow(<TableHeader
    onChangeAllRows={onChangeAllRows}
    onSort={onSort}
    sort={sort}
  />);

  t.equal(wrapper.find('th').length, 6, 'it should have 6 head columns in the header');
  t.end();
});
