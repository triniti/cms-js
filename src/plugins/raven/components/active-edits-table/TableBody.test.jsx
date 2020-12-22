import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import { STATUS_FULFILLED, STATUS_PENDING } from '@triniti/app/constants';
import ArticleV1Mixin from '@triniti/schemas/triniti/news/mixin/article/ArticleV1Mixin';

import TableBody from './TableBody';
import TableRow from './TableRow';

const articles = [];
const articleSchema = ArticleV1Mixin.findOne();
const articleCount = 50;
for (let i = 0; i < articleCount; i += 1) {
  articles.push(articleSchema.createMessage().set('title', `article${i}`));
}

const wrapper = shallow(<TableBody
  nodes={articles}
  isHover={false}
  status={null}
/>);

test('TableBody initial render', (t) => {
  const actual = wrapper.find(TableRow).length;
  const expected = articleCount;
  t.equal(actual, expected, 'it should have correct count of rows');

  t.end();
});

// test ensures that if a user is hovering over the table, rows will not refresh
test('TableBody event[onMouseOver]', (t) => {
  // nuke all nodes and update isHover to true
  wrapper.setProps({ isHover: true, nodes: [] });
  wrapper.update();

  const actual = wrapper.find(TableRow).length;
  const expected = articleCount;
  t.equal(actual, expected, 'it should NOT refresh the table rows');

  t.end();
});

// test ensures that if a user is NOT hovering over the table, rows will refresh
test('TableBody event[onMouseLeave]', (t) => {
  wrapper.setProps({ isHover: false });
  wrapper.update();

  const actual = wrapper.find(TableRow).length;
  const expected = 0;
  t.equal(actual, expected, 'it should refresh the table rows');

  t.end();
});

test('TableBody event[status update]', (t) => {
  wrapper.setProps({ status: STATUS_PENDING, nodes: [articles[0]] });
  wrapper.update();

  const actual = wrapper.find(TableRow).length;
  const expected = 1;
  t.equal(actual, expected, 'it should refresh the table rows');

  t.end();
});

test('TableBody event[status update and onMouseOver]', (t) => {
  // remove 2 articles
  const nodes = articles.filter((article) => article.get('title') !== 'article1' && article.get('title') !== 'article4');
  wrapper.setProps({ status: STATUS_FULFILLED, nodes, isHover: true });
  wrapper.update();

  const actual = wrapper.find(TableRow).length;
  const expected = 48;
  t.equal(actual, expected, 'it should refresh the table rows even onMouseOver due to status update');

  t.end();
});


test('TableBody event[nodes update]', (t) => {
  // update to have 2 nodes left
  const nodes = [articles[1], articles[2]];
  wrapper.setProps({ nodes });
  wrapper.update();

  const actual = wrapper.find(TableRow).length;
  const expected = 48;
  t.equal(actual, expected, 'it should NOT refresh the table');

  t.end();
});
