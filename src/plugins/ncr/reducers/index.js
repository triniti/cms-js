import { combineReducers } from 'redux';
import nodes from './nodes';
import batchOperation from './batchOperation';
import searchNodes from './searchNodes';

export default combineReducers({
  nodes,
  batchOperation,
  searchNodes,
});
