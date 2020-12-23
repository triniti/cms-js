import React from 'react';
import test from 'tape';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Icon,
  StatusMessage,
  Table,
} from '@triniti/admin-ui-plugin/components';
import ArticleV1Mixin from '@triniti/schemas/triniti/news/mixin/article/ArticleV1Mixin';

import { ActiveEditsTable } from './index';
import TableRow from './TableRow';

const accessToken = 'some_token';
const articles = [];
const articleSchema = ArticleV1Mixin.findOne();
const articleCount = 10;
for (let i = 0; i < articleCount; i += 1) {
  articles.push(articleSchema.createMessage().set('title', `article${i}`));
}

const handleUpdateCollaborations = sinon.stub();
const wrapper = shallow(<ActiveEditsTable
  accessToken={accessToken}
  collaborationNodes={articles}
  handleUpdateCollaborations={handleUpdateCollaborations}
/>);

test('ActiveEditsTable render', (t) => {
  let actual = wrapper.find(Button).length;
  const expected = 1;
  t.equal(actual, expected, 'it should render button');

  actual = wrapper.find(Card).length;
  t.equal(actual, expected, 'it should render card');

  actual = wrapper.find(CardHeader).length;
  t.equal(actual, expected, 'it should render card header');

  actual = wrapper.find(CardBody).length;
  t.equal(actual, expected, 'it should render card body');

  actual = wrapper.find(Table).length;
  t.equal(actual, expected, 'it should render table');

  actual = wrapper.find(TableRow).length;
  t.equal(actual, articleCount, 'it should render correct count of table rows');

  t.end();
});

// ensure that clicking refresh button triggers correct states
test('ActiveEditsTable event[click refresh]', async (t) => {
  wrapper.find(Button).find(Icon).simulate('click');

  let actual = wrapper.find(StatusMessage).length;
  let expected = 1;
  t.equal(actual, expected, 'it should render StatusMessage');

  t.true(handleUpdateCollaborations.calledOnceWithExactly(accessToken), 'it should invoke handleUpdateCollaborations with access token');

  await handleUpdateCollaborations.resolves(); // fake a resolved promise call

  actual = wrapper.find(StatusMessage).length;
  expected = 0;
  t.equal(actual, expected, 'it should remove StatusMessage');

  t.end();
});



