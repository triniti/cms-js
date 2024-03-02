import { actionTypes } from 'constants';

export default app => {
  return { type: actionTypes.WORKERS_STARTED, app };
};
