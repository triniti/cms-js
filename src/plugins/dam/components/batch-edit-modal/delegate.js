import { reset } from 'redux-form';
import noop from 'lodash/noop';

import batchEditPatchAssets from '@triniti/cms/plugins/dam/actions/batchEditPatchAssets';
import FormEvent from '@triniti/app/events/FormEvent';

import {
  SUFFIX_VALIDATE_FORM,
  SUFFIX_WARN_FORM,
} from '@triniti/app/constants';

import schemas from './schemas';
import { formNames } from '../../constants';

class Delegate {
  constructor(config) {
    this.config = config;

    /** @type {Pbjx} pbjx */
    this.pbjx = config.pbjx;

    /** @type {Function} */
    this.dispatch = noop;

    this.handleReset = this.handleReset.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleValidate = this.handleValidate.bind(this);
    this.handleWarn = this.handleWarn.bind(this);
  }

  bindToComponent(component) {
    this.component = component;
    this.dispatch = component.props.dispatch;
  }


  createFormEvent(data, formProps) {
    const command = schemas.patchAssets.createMessage({
      expected_etag: null,
      node_ref: this.component.props.nodeRef,
    });
    return new FormEvent(command, formProps.form, data, formProps);
  }

  getFormName() {
    return formNames.BATCH_EDIT;
  }

  handleValidate(values, formProps) {
    const formEvent = this.createFormEvent(values, formProps);
    this.pbjx.trigger(formEvent.getMessage(), SUFFIX_VALIDATE_FORM, formEvent);
    return formEvent.getErrors();
  }

  handleWarn(values, formProps) {
    const formEvent = this.createFormEvent(values, formProps);
    this.pbjx.trigger(formEvent.getMessage(), SUFFIX_WARN_FORM, formEvent);
    return formEvent.getWarnings();
  }

  handleReset() {
    this.dispatch(reset(this.getFormName()));
  }

  handleUpdate(currentValues, assetIds, onToggleBatchEdit) {
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

    this.dispatch(batchEditPatchAssets(data, assetIds, { schemas }));
    onToggleBatchEdit();
  }
}

export { Delegate }; // to allow for site level customization
export default (dispatch, ownProps, dependencies) => new Delegate(dependencies);
