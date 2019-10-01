import { actionTypes } from '../constants';

export default (error) => ({
  type: actionTypes.SESSION_RENEWAL_REJECTED,
  error,
});
