import get from 'lodash/get';

import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import getKeyValuesFieldErrors from '@triniti/cms/components/key-values-field/getKeyValuesFieldErrors';

export default class AdvertisingSubscriber extends EventSubscriber {
  constructor() {
    super();
    this.onInitForm = this.onInitForm.bind(this);
    this.onValidateForm = this.onValidateForm.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
  }

  /**
   * Runs when the form is first created and is used to
   * update initial values.
   *
   * @param {FormEvent} formEvent
   */
  onInitForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    data.dfpAdUnitPath = node.get('dfp_ad_unit_path');
    data.adsEnabled = node.get('ads_enabled');

    data.dfpCustParams = [];
    Object.entries(node.get('dfp_cust_params') || {})
      .forEach((param) => data.dfpCustParams.push({ key: param[0], value: param[1] }));
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    try {
      node.set('ads_enabled', data.adsEnabled);
    } catch (e) {
      formEvent.addError('adsEnabled', e.message);
    }

    const { errors, hasError } = getKeyValuesFieldErrors(data, 'dfpCustParams', node);
    if (hasError) {
      formEvent.addError('dfpCustParams', errors);
    }

    if (get(data, 'dfpAdUnitPath')) {
      try {
        node.set('dfp_ad_unit_path', data.dfpAdUnitPath);
      } catch (e) {
        formEvent.addError('dfpAdUnitPath', e.message);
      }
    }
  }

  /**
   * Binds data from the redux form to the command.
   * This occurs AFTER a form has been submitted
   * but before the command is dispatched.
   *
   * @param {FormEvent} formEvent
   */
  onSubmitForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    if (node.isFrozen()) {
      return;
    }

    node.set('ads_enabled', data.adsEnabled);
    node.set('dfp_ad_unit_path', data.dfpAdUnitPath || null);

    node.clear('dfp_cust_params');
    (data.dfpCustParams || []).forEach(({ key, value }) => node.addToMap('dfp_cust_params', key, value));
  }

  getSubscribedEvents() {
    return {
      'triniti:common:mixin:advertising.init_form': this.onInitForm,
      'triniti:common:mixin:advertising.validate_form': this.onValidateForm,
      'triniti:common:mixin:advertising.submit_form': this.onSubmitForm,
    };
  }
}
