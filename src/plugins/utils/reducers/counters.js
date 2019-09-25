import createReducer from '@triniti/app/createReducer';
import { actionTypes } from '../constants';

export const initialState = {};

const { COUNTER_UPDATED } = actionTypes;

const onCounterUpdated = (prevState, { name, counter }) => {
  if (counter !== null) {
    return { ...prevState, [name]: counter };
  }
  const newState = { ...prevState };
  delete newState[name];
  return newState;
};

export default createReducer(initialState, {
  [COUNTER_UPDATED]: onCounterUpdated,
});
