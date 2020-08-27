import test from 'tape';
import SearchArticlesRequestV1Mixin from '@triniti/schemas/triniti/news/mixin/search-articles-request/SearchArticlesRequestV1Mixin';
import { actionTypes } from '../constants';
import clearResponse from './clearResponse';

test('clearChannelSlot action creator tests', (t) => {
  const curie = SearchArticlesRequestV1Mixin.findOne().getCurie();
  const actual = clearResponse(curie, 'root');
  const expected = {
    type: actionTypes.RESPONSE_CLEARED,
    channel: 'root',
    curie,
  };
  t.same(actual, expected, 'it should create a RESPONSE_CLEARED action.');
  t.end();
});
