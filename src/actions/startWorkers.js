import { actionTypes } from '@triniti/cms/constants.js';

export default app => {
  return { type: actionTypes.WORKERS_STARTED, app };
};
