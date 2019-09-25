import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

/* eslint-disable class-methods-use-this */
export default class HashtaggableSubscriber extends EventSubscriber {
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
    data.hashtags = node.get('hashtags', []).map((hashtag) => ({ label: `#${hashtag}`, value: hashtag }));
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();
    if (data.hashtags) {
      try {
        const hashtags = data.hashtags.map((hashtag) => hashtag.value);
        node.clear('hashtags').addToSet('hashtags', hashtags);
      } catch (e) {
        formEvent.addError('hashtags', e.message);
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
    const hashtags = (data.hashtags || []).map((hashtag) => hashtag.value);
    node.clear('hashtags').addToSet('hashtags', hashtags);
  }

  getSubscribedEvents() {
    return {
      'triniti:taxonomy:mixin:hashtaggable.init_form': this.onInitForm,
      'triniti:taxonomy:mixin:hashtaggable.validate_form': this.onValidateForm,
      'triniti:taxonomy:mixin:hashtaggable.submit_form': this.onSubmitForm,
    };
  }
}
