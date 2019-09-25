import camelCase from 'lodash/camelCase';
import isUndefined from 'lodash/isUndefined';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import createTextCharacterCountTips from '@triniti/cms/utils/createTextCharacterCountTips';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { fieldRules } from '../constants';

const { DESCRIPTION_MAX_CHARACTERS, DESCRIPTION_WARNING_CHARACTERS } = fieldRules;

export default class SeoSubscriber extends EventSubscriber {
  constructor() {
    super();
    this.onInitForm = this.onInitForm.bind(this);
    this.onWarnForm = this.onWarnForm.bind(this);
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

    ['is_unlisted', 'meta_description', 'seo_published_at', 'seo_title'].forEach((fieldName) => {
      if (node.has(fieldName)) {
        data[camelCase(fieldName)] = node.get(fieldName);
      }
    });

    data.seoImageRef = node.has('seo_image_ref') ? node.get('seo_image_ref').toString() : null;
    data.metaKeywords = node.get('meta_keywords', []).map((keyword) => ({ label: keyword, value: keyword }));
  }

  /**
   * Occurs before validation and is used to add warnings.
   *
   * @param {FormEvent} formEvent
   */
  onWarnForm(formEvent) {
    const data = formEvent.getData();
    const { metaDescription } = data;
    const metaDescriptionWarning = createTextCharacterCountTips(
      metaDescription,
      DESCRIPTION_MAX_CHARACTERS,
      DESCRIPTION_WARNING_CHARACTERS,
    );
    if (metaDescriptionWarning) {
      formEvent.addWarning('metaDescription', metaDescriptionWarning);
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

    [
      'is_unlisted',
      'meta_description',
      'seo_published_at',
      'seo_title',
    ].forEach((fieldName) => {
      const value = data[camelCase(fieldName)];
      node.set(fieldName, isUndefined(value) ? null : value);
    });

    node.set('seo_image_ref', data.seoImageRef ? NodeRef.fromString(data.seoImageRef) : null);
    node.clear('meta_keywords').addToSet('meta_keywords', (data.metaKeywords || []).map((keyword) => keyword.value || ''));
  }

  getSubscribedEvents() {
    return {
      'triniti:common:mixin:seo.init_form': this.onInitForm,
      'triniti:common:mixin:seo.warn_form': this.onWarnForm,
      'triniti:common:mixin:seo.submit_form': this.onSubmitForm,
    };
  }
}
