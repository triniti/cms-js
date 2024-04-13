import { actionTypes } from '@triniti/cms/constants';

export default app => {
  return { type: actionTypes.WORKERS_STARTED, app };
};
