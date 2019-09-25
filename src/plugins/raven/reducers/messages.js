import createReducer from '@triniti/app/createReducer';
import { actionTypes } from '../constants';

const { CONNECTION_CLOSED, RT_TEXT } = actionTypes;

export const initialState = {};

const onConnectionClosed = () => initialState;

const addMessage = (prevState, action, message) => {
  const state = { ...prevState };
  const newMessage = { ...message };
  newMessage.rt = action.rt;
  newMessage.ts = action.ts;
  newMessage.userRef = action.userRef;
  newMessage.isMe = action.isMe;
  newMessage.pbj = action.pbj;
  state[action.topic] = (state[action.topic] || []).concat(newMessage).slice(-50);
  return state;
};

const onText = (prevState, action) => addMessage(prevState, action, {
  text: action.text,
});

export default createReducer(initialState, {
  [CONNECTION_CLOSED]: onConnectionClosed,
  [RT_TEXT]: onText,
});
