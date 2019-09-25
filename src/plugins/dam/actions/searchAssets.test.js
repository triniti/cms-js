import test from 'tape';
import SearchAssetsRequestMixin from '@triniti/schemas/triniti/dam/mixin/search-assets-response/SearchAssetsResponseV1Mixin';
import { actionTypes } from '../constants';
import searchAssets from './searchAssets';

test('searchAssets action creator tests', (t) => {
  const request = SearchAssetsRequestMixin.findOne().createMessage();

  const actual = searchAssets(request);
  const expected = {
    type: actionTypes.SEARCH_ASSETS_REQUESTED,
    pbj: request,
  };

  t.same(actual, expected, 'it should create a SEARCH_ASSETS_REQUESTED action with a search request.');

  t.end();
});
