import incrementer from '@triniti/cms/utils/incrementer.js';
import { actionTypes } from '@triniti/cms/constants.js';

const nextId = incrementer();

export default ({ message, type = 'warning' }) => ({
  type: actionTypes.ALERT_SENT,
  alert: {
    id: nextId(),
    message,
    type,
  },
});
