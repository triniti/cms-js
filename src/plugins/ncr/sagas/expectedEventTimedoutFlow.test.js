import test from 'tape';
import { call, delay, putResolve, select } from 'redux-saga/effects';

import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import MessageRef from '@gdbots/pbj/MessageRef';
import UserV1Mixin from '@gdbots/schemas/gdbots/iam/mixin/user/UserV1Mixin';
import ArticleV1Mixin from '@triniti/schemas/triniti/news/mixin/article/ArticleV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

import getAuthenticatedUserRef from '@triniti/cms/plugins/iam/selectors/getAuthenticatedUserRef';
import expectedEventTimedoutFlow from './expectedEventTimedoutFlow';

const user = UserV1Mixin.findOne().createMessage();
const article = ArticleV1Mixin.findOne().createMessage({ updater_ref: MessageRef.fromString('user'), last_event_ref: MessageRef.fromString('test') });
const articleUpdated = resolveSchema(ArticleV1Mixin, 'event', 'article-updated');
const getArticleRequest = resolveSchema(ArticleV1Mixin, 'request', 'get-article-request');

const fakeNodeRef = NodeRef.fromString('bachelornation:news:123');
const request = getArticleRequest.createMessage({ node_ref: fakeNodeRef });
const expectedEvent = articleUpdated.getCurie().toString();

const response = {
  pbj: {
    get: () => article,
  },
};

test('Ncr:saga:expectedEventTimedoutFlow', (t) => {
  const generator = expectedEventTimedoutFlow(request, expectedEvent);
  let actual = generator.next();

  t.deepEqual(
    actual.value,
    delay(3000),
    'it should sleep for 3 second',
  );
  actual = generator.next();

  t.deepEqual(
    actual.value,
    call([console, 'warn'], 'pbjx operation timed out, initiate node comparision!'),
    'it should call console.warn to print a note in the console',
  );
  actual = generator.next();

  t.deepEqual(
    actual.value,
    putResolve(request),
    'it should put the request, and wait for promise resolved',
  );
  actual = generator.next(response);

  t.deepEqual(
    actual.value,
    select(getAuthenticatedUserRef),
    'it should select the current user from state',
  );
  actual = generator.next(NodeRef.fromNode(user));

  t.true(actual.done, 'it should be done');

  t.end();
});
