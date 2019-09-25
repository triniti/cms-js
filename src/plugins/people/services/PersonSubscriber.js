import camelCase from 'lodash/camelCase';
import isUndefined from 'lodash/isUndefined';
import createTextCharacterCountTips from '@triniti/cms/utils/createTextCharacterCountTips';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import getTextFieldError from '@triniti/cms/components/text-field/getTextFieldError';
import getTextAreaFieldError from '@triniti/cms/components/textarea-field/getTextAreaFieldError';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import isEmpty from 'lodash/isEmpty';

import { fieldRules } from '../constants';

const { DESCRIPTION_MAX_CHARACTERS, DESCRIPTION_WARNING_CHARACTERS } = fieldRules;

/* eslint-disable class-methods-use-this */
export default class PersonSubscriber extends EventSubscriber {
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

    [
      'bio',
      'bio_source',
      'imdb_url',
      'is_celebrity',
      'status',
      'title',
      'twitter_username',
    ].forEach((fieldName) => {
      data[camelCase(fieldName)] = node.get(fieldName);
    });

    data.imageRef = node.has('image_ref') ? node.get('image_ref').toString() : null;
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    // title is currently NOT required by person schema
    // but we need use title as a person name
    // so it is "required" by the busineed logic
    if (!data.title) {
      formEvent.addError('title', 'Title is required');
    }

    let error;
    // fields using TextField component
    [
      'title',
      'bioSource',
      'imdbUrl',
      'twitterUsername',
    ].forEach((fieldName) => {
      if (data[fieldName]) {
        error = getTextFieldError(data, fieldName, node);
        if (error) {
          formEvent.addError(fieldName, error);
        }
      }
    });

    error = getTextAreaFieldError(data, 'bio', node);
    if (error) {
      formEvent.addError('bio', error);
    }

    if (data.imageRef) {
      try {
        node.set('image_ref', NodeRef.fromString(data.imageRef));
      } catch (e) {
        formEvent.addError('imageRef', e.message);
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

    [
      'title',
      'bio',
      'twitter_username',
    ].forEach((fieldName) => {
      const value = data[camelCase(fieldName)];
      node.set(fieldName, isUndefined(value) || isEmpty(value) ? null : value);
    });

    node.set('is_celebrity', data.isCelebrity ? data.isCelebrity : false);
    node.set('bio_source', data.bioSource ? data.bioSource : null);
    node.set('imdb_url', data.imdbUrl ? data.imdbUrl : null);
    node.set('image_ref', data.imageRef ? NodeRef.fromString(data.imageRef) : null);
  }

  /**
   * Occurs before validation and is used to add warnings.
   *
   * @param {FormEvent} formEvent
   */
  onWarnForm(formEvent) {
    const data = formEvent.getData();
    const { bio } = data;
    const bioWarning = createTextCharacterCountTips(
      bio,
      DESCRIPTION_MAX_CHARACTERS,
      DESCRIPTION_WARNING_CHARACTERS,
    );
    if (bioWarning) {
      formEvent.addWarning('bio', bioWarning);
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:people:mixin:person.init_form': this.onInitForm,
      'triniti:people:mixin:person.validate_form': this.onValidateForm,
      'triniti:people:mixin:person.submit_form': this.onSubmitForm,
      'triniti:people:mixin:person.warn_form': this.onWarnForm,
    };
  }
}
