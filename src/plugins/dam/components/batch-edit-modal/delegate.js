import { reset } from 'redux-form';

import batchEditPatchAssets from '@triniti/cms/plugins/dam/actions/batchEditPatchAssets';

import schemas from './schemas';
import { formNames } from '../../constants';

export default (dispatch) => ({
  getFormName() {
    return formNames.BATCH_EDIT;
  },

  onHandleReset() {
    dispatch(reset(this.getFormName()));
  },

  onHandleUpdate(currentValues, assetIds, onToggleBatchEdit) {
    // Rename expiresAt to expires_at if its present
    const { expiresAt, ...fixedKeysCurrentValues } = currentValues;
    if (currentValues.expiresAt) {
      fixedKeysCurrentValues.expires_at = currentValues.expiresAt;
    }
    if (fixedKeysCurrentValues.credit) {
      fixedKeysCurrentValues.credit = fixedKeysCurrentValues.credit.value;
    }

    const data = {
      fields: Object.keys(fixedKeysCurrentValues),
      values: fixedKeysCurrentValues,
    };

    dispatch(batchEditPatchAssets(data, assetIds, { schemas }));
    onToggleBatchEdit();
  },
});
