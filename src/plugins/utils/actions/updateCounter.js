import { actionTypes } from '../constants';

export default (name, counter) => ({
  type: actionTypes.COUNTER_UPDATED,
  name,
  counter,
});
