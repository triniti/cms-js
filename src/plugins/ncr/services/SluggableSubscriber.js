import { change, formValueSelector } from 'redux-form';
import addDateToSlug from '@gdbots/common/addDateToSlug';
import createSlug from '@gdbots/common/createSlug';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import isValidSlug from '@gdbots/common/isValidSlug';
import slugContainsDate from '@gdbots/common/slugContainsDate';

export default class SluggableSubscriber extends EventSubscriber {
  constructor(sluggableForms) {
    super();
    this.onInitForm = this.onInitForm.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.onTitleChanged = this.onTitleChanged.bind(this);
    this.sluggableForms = sluggableForms;
  }

  /**
   * Runs when the form is first created and is used to
   * update initial values
   *
   * @param {FormEvent} formEvent
   */
  onInitForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    data.slug = node.get('slug') || '';
  }

  /**
   * Binds data from redux form to the command
   * This happens AFTER the form is submitted
   * but before the command is dispatched.
   *
   * @param {FormEvent} formEvent
   */
  onSubmitForm(formEvent) {
    const { slug: actualSlug, title } = formEvent.getData();
    const isDatedSlug = this.shouldUseDatedSlug(formEvent.getName());
    const node = formEvent.getMessage();
    actualSlug.replace(/\s/g, '-');
    console.log(actualSlug);

    // this ensures a dated slug will always have a date prepended to it
    let slug = isDatedSlug ? addDateToSlug(actualSlug) : actualSlug;

    if (!isValidSlug(actualSlug.trim(), isDatedSlug)) {
      slug = isDatedSlug ? addDateToSlug(createSlug(title)) : createSlug(title);
    }

    try {
      node.set('slug', slug);
    } catch (e) {
      formEvent.addError('slug', e.message);
    }
  }

  /**
   * When title is changed, dispatch redux form change action to create a slug if slug is empty
   *
   * @param {FilterActionEvent} event
   */
  onTitleChanged(event) {
    const { meta: { field, form }, payload } = event.getAction();
    const store = event.getRedux();

    if (field !== 'title' || payload === '' || formValueSelector(form)(store.getState(), 'slug')) {
      return;
    }

    let slug = createSlug(payload.toLowerCase());

    // Add a date to slug if it doesn't have a date and if dated config is true
    if (this.shouldUseDatedSlug(form) && !slugContainsDate(payload)) {
      slug = addDateToSlug(slug);
    }

    store.dispatch(change(form, 'slug', slug));
  }

  shouldUseDatedSlug(formName) {
    return this.sluggableForms[formName] || this.sluggableForms.default;
  }

  getSubscribedEvents() {
    return {
      '@@redux-form/BLUR': this.onTitleChanged,
      'gdbots:ncr:mixin:sluggable.init_form': this.onInitForm,
      'gdbots:ncr:mixin:sluggable.submit_form': this.onSubmitForm,
    };
  }
}
