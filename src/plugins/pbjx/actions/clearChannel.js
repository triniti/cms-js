import { actionTypes } from '../constants';

export default (channel) => ({
  type: actionTypes.CHANNEL_CLEARED,
  channel,
});
