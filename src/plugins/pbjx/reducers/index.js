import createReducer from '@triniti/app/createReducer';
import { actionTypes as pbjxActionTypes } from '@triniti/cms/plugins/pbjx/constants';
import { STATUS_NONE } from '@triniti/app/constants';

/**
 * This reducer currently only establishes the "pbjx"
 * part of the state tree with an empty object.
 *
 * Most of the real reducing is done in the ../pbjx/reducer.js
 * file which uses the observable pbjx root reducer.
 */
export const initialState = {};

const onChannelCleared = (prevState = {}, action) => {
  const state = { ...prevState };
  const { channel } = action;

  if (channel) {
    delete state[channel];
  }

  return state;
};

const onResponseCleared = (prevState = {}, action) => {
  const { channel, curie } = action;
  const slot = (channel && curie && prevState[channel]) ? prevState[channel][`${curie}`] : null;
  if (!slot || !slot.response) {
    return prevState;
  }
  const state = { ...prevState };
  state[channel] = { ...state[channel] };
  state[channel][`${curie}`] = {
    ...state[channel][`${curie}`],
    response: null,
    status: STATUS_NONE,
  };

  return state;
};

export default createReducer(initialState, {
  [pbjxActionTypes.CHANNEL_CLEARED]: onChannelCleared,
  [pbjxActionTypes.RESPONSE_CLEARED]: onResponseCleared,
});
