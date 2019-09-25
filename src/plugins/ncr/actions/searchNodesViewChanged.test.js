import test from 'tape';
import { actionTypes } from '../constants';
import searchNodesViewChanged from './searchNodesViewChanged';

test('searchNodesViewChanged action creator tests', (t) => {
  const curie = 'test-curie';
  const view = 'test-view';
  const actual = searchNodesViewChanged(curie, view);

  const expected = {
    type: actionTypes.SEARCH_NODES_VIEW_CHANGED,
    curie,
    view,
  };

  t.same(actual, expected, 'it should create a SEARCH_NODES_VIEW_CHANGED action.');
  t.end();
});
