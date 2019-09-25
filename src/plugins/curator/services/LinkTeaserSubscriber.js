import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import getTextFieldError from '@triniti/cms/components/text-field/getTextFieldError';

export default class LinkTeaserSubscriber extends EventSubscriber {
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

    data.linkUrl = node.get('link_url');
    data.partnerUrl = node.get('partner_url');
    data.partnerText = node.get('partner_text');
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    if (!data.linkUrl) {
      formEvent.addError('linkUrl', 'Link URL is required.');
    } else {
      const error = getTextFieldError(data, 'linkUrl', node);
      if (error) {
        formEvent.addError('linkUrl', error);
      }
    }

    if (data.partnerUrl) {
      const error = getTextFieldError(data, 'partnerUrl', node);
      if (error) {
        formEvent.addError('partnerUrl', error);
      }
    }

    if (data.partnerText) {
      const error = getTextFieldError(data, 'partnerText', node);
      if (error) {
        formEvent.addError('partnerText', error);
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

    node.set('link_url', data.linkUrl)
      .set('partner_url', data.partnerUrl ? data.partnerUrl : null)
      .set('partner_text', data.partnerText);
  }

  getSubscribedEvents() {
    return {
      'triniti:curator:mixin:link-teaser.init_form': this.onInitForm,
      'triniti:curator:mixin:link-teaser.validate_form': this.onValidateForm,
      'triniti:curator:mixin:link-teaser.submit_form': this.onSubmitForm,
    };
  }
}
