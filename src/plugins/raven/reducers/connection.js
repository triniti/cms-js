import createReducer from '@triniti/app/createReducer';
import { actionTypes } from '../constants';

const {
  CONNECTION_REQUESTED,
  CONNECTION_OPENED,
  CONNECTION_CLOSED,
  CONNECTION_REJECTED,
} = actionTypes;

export const initialState = {
  isConnected: false,
  isConnecting: false,
  wasRejected: false,
};

const onConnectionRequested = (prevState) => ({
  ...prevState,
  isConnected: false,
  isConnecting: true,
  wasRejected: false,
});

const onConnectionOpened = (prevState) => ({
  ...prevState,
  isConnected: true,
  isConnecting: false,
  wasRejected: false,
});

const onConnectionClosed = () => initialState;

const onConnectionRejected = (prevState) => ({
  ...prevState,
  isConnected: false,
  isConnecting: false,
  wasRejected: true,
});

export default createReducer(initialState, {
  [CONNECTION_REQUESTED]: onConnectionRequested,
  [CONNECTION_OPENED]: onConnectionOpened,
  [CONNECTION_CLOSED]: onConnectionClosed,
  [CONNECTION_REJECTED]: onConnectionRejected,
});
