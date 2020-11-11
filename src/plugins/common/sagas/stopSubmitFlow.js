import { select } from 'redux-saga/effects';
import getAlerts from '@triniti/admin-ui-plugin/selectors/getAlerts';
import swal from 'sweetalert2';

export default function* stopSubmitFlow(action) {
  console.log(action);
  const { payload } = action;
  if (!payload) {
    return; // action is not the result of an error
  }
  const alerts = yield select(getAlerts);
  const hasAlert = !!alerts.find((alert) => alert.message.includes(payload._error)); // eslint-disable-line
  if (hasAlert) {
    return; // being "handled" elsewhere
  }
  yield swal.fire({
    allowOutsideClick: false,
    confirmButtonClass: 'btn btn-danger',
    confirmButtonText: 'I understand.',
    title: 'A form error occurred and this content cannot be saved. Please keep this browser tab open and contact support.',
    type: 'error',
  });
}
