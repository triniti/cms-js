import incrementer from '@triniti/cms/utils/incrementer';
import { actionTypes } from '@triniti/cms/constants';

const nextId = incrementer();

export default ({ message, type = 'warning' }) => ({
  type: actionTypes.ALERT_SENT,
  alert: {
    id: nextId(),
    message,
    type,
  },
});
