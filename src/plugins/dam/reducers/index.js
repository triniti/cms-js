import { combineReducers } from 'redux';
import batchEdit from './batchEdit';
import uploader from './uploader';

export default combineReducers({
  batchEdit,
  uploader,
});
