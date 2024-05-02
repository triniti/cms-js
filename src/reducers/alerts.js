import createReducer from '@triniti/cms/utils/createReducer.js';
import { actionTypes } from '@triniti/cms/constants.js';

export const initialState = [];

const onAlertSent = (state, action) => [...state, action.alert];
const onAlertDismissed = (state, { id }) => state.filter(alert => alert.id !== id);
const onAlertsCleared = () => initialState;

export default createReducer(initialState, {
  [actionTypes.ALERT_SENT]: onAlertSent,
  [actionTypes.ALERT_DISMISSED]: onAlertDismissed,
  [actionTypes.ALERTS_CLEARED]: onAlertsCleared,
});
