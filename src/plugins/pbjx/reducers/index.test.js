import test from 'tape';
import deepFreeze from 'deep-freeze';
import SearchArticlesRequestV1Mixin from '@triniti/schemas/triniti/news/mixin/search-articles-request/SearchArticlesRequestV1Mixin';
import clearResponse from '../actions/clearResponse';
import reducer, { initialState } from './index';

const curie = SearchArticlesRequestV1Mixin.findOne().getCurie();
let fakeState = {
  root: {
    'test-slot': {
      response: ['test'],
    },
  },
};

test('Pbjx:reducer:response:clearResponse', (t) => {
  deepFreeze(initialState);
  t.deepEqual(initialState, reducer(undefined, {}), 'it should return initial state when state is undefined');

  let actual = reducer(fakeState, clearResponse());
  let expected = fakeState;
  t.deepEqual(actual, expected, 'it should return correct state if no provided curie');


  fakeState = {
    test: {
      'whatevs-slot-here': {
        response: ['test'],
      },
    },
  };
  deepFreeze(fakeState);
  actual = reducer(fakeState, clearResponse(curie));
  expected = fakeState;
  t.deepEqual(actual, expected, 'it should return correct state if no channel found');


  fakeState = {
    root: {
      'whatever-slot-here': {
        response: ['test'],
      },
    },
  };
  deepFreeze(fakeState);
  actual = reducer(fakeState, clearResponse(curie));
  expected = fakeState;
  t.deepEqual(actual, expected, 'it should return correct state if no slot found');


  fakeState = {
    root: {
      'acme:news:request:search-articles-request': {
        request: ['test'],
      },
    },
  };
  deepFreeze(fakeState);
  actual = reducer(fakeState, clearResponse(curie));
  expected = fakeState;
  t.deepEqual(actual, expected, 'it should return correct state if no response found');

  fakeState = {
    test: {
      'test-slot': {
        request: ['test'],
      },
    },
  };
  deepFreeze(fakeState);
  actual = reducer(fakeState, clearResponse(curie));
  expected = fakeState;
  t.deepEqual(actual, expected, 'it should return correct state if no channel and slot found');

  fakeState = {
    test: {
      'acme:news:request:search-articles-request': {
        request: [{ a: 'content1' }, { b: 'content2' }],
        response: ['test'],
        status: 'fulfilled',
        exception: { e: 'error' },
      },
    },
  };
  // ensure that we're not mutating the original state
  deepFreeze(fakeState);
  actual = reducer(fakeState, clearResponse(curie, 'test'));
  expected = {
    test: {
      'acme:news:request:search-articles-request': {
        request: [{ a: 'content1' }, { b: 'content2' }],
        response: null,
        status: 'none',
        exception: { e: 'error' },
      },
    },
  };
  t.deepEqual(actual, expected, 'it should return correct state on provided curie');

  fakeState = {
    root: {
      'acme:news:request:search-articles-request': {
        response: ['test'],
        status: 'fulfilled',
      },
    },
  };
  deepFreeze(fakeState);
  actual = reducer(fakeState, clearResponse(curie));
  expected = {
    root: {
      'acme:news:request:search-articles-request': {
        response: null,
        status: 'none',
      },
    },
  };
  t.deepEqual(actual, expected, 'it should return correct state on provided curie with default channel');

  t.end();
});
