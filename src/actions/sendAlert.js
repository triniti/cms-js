import incrementer from 'utils/incrementer';
import { actionTypes } from 'constants';

const nextId = incrementer();

export default ({ message, type = 'warning' }) => ({
  type: actionTypes.ALERT_SENT,
  alert: {
    id: nextId(),
    message,
    type,
  },
});
