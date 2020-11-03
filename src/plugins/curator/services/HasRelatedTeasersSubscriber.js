import isUndefined from 'lodash/isUndefined';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class HasRelatedTeasersSubscriber extends EventSubscriber {
  constructor() {
    super();
    this.onInitForm = this.onInitForm.bind(this);
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

    data.relatedTeasersHeading = node.get('related_teasers_heading');
    data.relatedTeaserRefs = node.has('related_teaser_refs') ? node.get('related_teaser_refs') : [];
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

    node.set('related_teasers_heading', isUndefined(data.relatedTeasersHeading) ? null : data.relatedTeasersHeading);
    node.clear('related_teaser_refs');
    if (typeof data.relatedTeaserRefs !== 'undefined') {
      node.addToSet('related_teaser_refs', data.relatedTeaserRefs);
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:curator:mixin:has-related-teasers.init_form': this.onInitForm,
      'triniti:curator:mixin:has-related-teasers.submit_form': this.onSubmitForm,
    };
  }
}
