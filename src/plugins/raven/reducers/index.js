import { combineReducers } from 'redux';
import collaboration from './collaboration';
import connection from './connection';
import messages from './messages';

export default combineReducers({
  collaboration,
  connection,
  messages,
});
