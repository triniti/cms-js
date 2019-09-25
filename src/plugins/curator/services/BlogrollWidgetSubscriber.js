import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class BlogrollWidgetSubscriber extends EventSubscriber {
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

    data.promotionSlotPrefix = node.get('promotion_slot_prefix');
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    if (data.promotionSlotPrefix) {
      try {
        node.set('promotion_slot_prefix', data.promotionSlotPrefix);
      } catch (e) {
        formEvent.addError('promotionSlotPrefix', e.message);
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

    if (data.promotionSlotPrefix) {
      node.set('promotion_slot_prefix', data.promotionSlotPrefix);
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:curator:mixin:blogroll-widget.init_form': this.onInitForm,
      'triniti:curator:mixin:blogroll-widget.validate_form': this.onValidateForm,
      'triniti:curator:mixin:blogroll-widget.submit_form': this.onSubmitForm,
    };
  }
}
