import { reset } from 'redux-form';

import AbstractDelegate from '@triniti/cms/plugins/ncr/screens/node/AbstractDelegate';
import displayBatchEdit from '@triniti/cms/plugins/dam/actions/displayBatchEdit';
import patchAssets from '@triniti/cms/plugins/dam/actions/patchAssets';

import schemas from './schemas';
import { formNames } from '../../constants';

class Delegate extends AbstractDelegate {
  constructor(dependencies) {
    super({
      schemas,
      formNamePrefix: formNames.BATCH_EDIT,
    }, dependencies);

    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleToggleBatchEdit(display) {
    return this.dispatch(displayBatchEdit(display));
  }

  createFormEvent() {
    // This doesn't really work on a node since we're patching multiple.
    // return new FormEvent(command, formProps.form, data, formProps);
  }

  /**
   * @inheritDoc
   * @return {*}
   */
  getInitialValues() {
    // Maybe one day we'd like to prefill the form fields with data
    // from assets that are exactly the same.
    return {};
  }

  handleValidate() {}

  handleWarn() {}

  handleReset() {
    this.dispatch(reset(this.getFormName()));
  }

  /**
   * @inheritDoc
   * @return {*}
   */
  getNode() {
    return this.component.props.node;
  }

  componentDidMount() {
    // blank happy face
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    const { onClose, processedFilesAssets } = this.component.props;
    onClose(processedFilesAssets);
  }

  handleUpdate(currentValues, assetIds) {
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

    this.dispatch(patchAssets(data, assetIds, this.config));
  }

  getFormName() {
    return formNames.BATCH_EDIT;
  }

  /**
   * @param {Component} component
   */
  bindToComponent(component) {
    this.component = component;
    this.dispatch = component.props.dispatch;
  }
}

export { Delegate }; // to allow for site level customization
export default (dispatch, ownProps, dependencies) => new Delegate(dependencies);
