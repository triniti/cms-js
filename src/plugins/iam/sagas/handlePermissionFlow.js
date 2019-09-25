import { put } from 'redux-saga/effects';
import Code from '@gdbots/schemas/gdbots/pbjx/enums/Code';
import sendAlert from '@triniti/admin-ui-plugin/actions/sendAlert';

// fixme: handle the different permission issues:
// authentication required, permission denied, chupacabra
export default function* handlePermissionFlow(action) {
  const { code, exception } = action.ctx;
  if (code === Code.INTERNAL.getValue()) {
    yield put(sendAlert({
      type: 'danger',
      isDismissible: true,
      delay: 5000,
      message: `Command failed with error: ${exception.getMessage()}`,
    }));
  }
}
