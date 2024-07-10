import { actionTypes } from '@triniti/cms/constants.js';

export default (primary, secondary) => {
  return { type: actionTypes.NAVBAR_CHANGED, primary, secondary };
};
