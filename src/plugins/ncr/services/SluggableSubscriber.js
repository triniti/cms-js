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
    this.onValidateForm = this.onValidateForm.bind(this);
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
    const node = formEvent.getMessage();

    let slug;
    if (actualSlug) {
      slug = actualSlug;
    } else {
      slug = createSlug(title);
    }

    try {
      node.set('slug', this.shouldUseDatedSlug(formEvent.getName()) ? addDateToSlug(slug) : slug);
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

    if (field !== 'title' || payload === '') {
      return;
    }

    const currentSlug = formValueSelector(form)(store.getState(), 'slug');
    if (currentSlug && currentSlug !== undefined) {
      return;
    }

    let slug = createSlug(payload.toLowerCase());

    // Add a date to slug if it doesn't have a date and if dated config is true
    if (this.shouldUseDatedSlug(form) && !slugContainsDate(payload)) {
      slug = addDateToSlug(slug);
    }

    store.dispatch(change(form, 'slug', slug));
  }

  /**
   * This if the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const node = formEvent.getMessage();
    const { slug } = formEvent.getData();
    const isDatedSlug = this.shouldUseDatedSlug(formEvent.getProps().form);

    if (slug) {
      // slug format check
      if (!isValidSlug(slug, isDatedSlug)) {
        let error = '';
        if (isDatedSlug) {
          error = 'Invalid slug format - this slug cannot start or end with a dash or slash and can only contain lowercase alphanumeric characters, dashes, or slashes.';
        } else {
          error = 'Invalid slug format - this slug cannot start or end with a dash and can only contain lowercase alphanumeric characters or dashes.';
        }
        formEvent.addError('slug', error);
        return;
      }

      // check if slug contains date, only if datedSlug config is set to true
      if (isDatedSlug && !slugContainsDate(slug)) {
        formEvent.addError('slug', 'Slug must have a date in YYYY/MM/DD format.');
        return;
      }

      try {
        node.set('slug', slug);
      } catch (e) {
        formEvent.addError('slug', e.message);
      }
    }

    if (!slug) {
      formEvent.addError('slug', 'Please enter a valid slug.');
    }
  }

  shouldUseDatedSlug(formName) {
    return this.sluggableForms[formName] || this.sluggableForms.default;
  }

  getSubscribedEvents() {
    return {
      '@@redux-form/BLUR': this.onTitleChanged,
      'gdbots:ncr:mixin:sluggable.init_form': this.onInitForm,
      'gdbots:ncr:mixin:sluggable.validate_form': this.onValidateForm,
      'gdbots:ncr:mixin:sluggable.submit_form': this.onSubmitForm,
    };
  }
}
