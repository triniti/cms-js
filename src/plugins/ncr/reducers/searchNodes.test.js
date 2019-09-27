import test from 'tape';
import deepFreeze from 'deep-freeze';
import SearchArticlesRequestV1Mixin from '@triniti/schemas/triniti/news/mixin/search-articles-request/SearchArticlesRequestV1Mixin';
import searchNodesViewChanged from '../actions/searchNodesViewChanged';
import reducer, { initialState } from './searchNodes';

const curie = SearchArticlesRequestV1Mixin.findOne().getCurie();

test('SearchNodes:reducer:onViewChanged', (t) => {
  deepFreeze(initialState);
  t.deepEqual(initialState, reducer(undefined, {}), 'it should return initial state when state is undefined');

  // test if the slot does exist
  let fakeSearchNode = {
    'acme:news:request:search-articles-request': {
      view: 'table',
    },
  };
  deepFreeze(fakeSearchNode);
  let actual = reducer(fakeSearchNode, searchNodesViewChanged(curie, 'list'));
  let expected = {
    'acme:news:request:search-articles-request': {
      view: 'list',
    },
  };
  t.deepEqual(actual, expected, 'it should return correct state');

  // test if the slot does not exist yet
  fakeSearchNode = {
    'acme:news:request:search-articles-request': {
      view: 'table',
    },
  };
  deepFreeze(fakeSearchNode);
  actual = reducer(fakeSearchNode, searchNodesViewChanged('test-slot', 'list'));
  expected = {
    'acme:news:request:search-articles-request': {
      view: 'table',
    },
    'test-slot': {
      view: 'list',
    },
  };
  t.deepEqual(actual, expected, 'it should return correct state');

  // test if the slot is empty
  fakeSearchNode = {};
  deepFreeze(fakeSearchNode);
  actual = reducer(fakeSearchNode, searchNodesViewChanged('test-slot', 'list'));
  expected = {
    'test-slot': {
      view: 'list',
    },
  };
  t.deepEqual(actual, expected, 'it should return correct state');

  t.end();
});
