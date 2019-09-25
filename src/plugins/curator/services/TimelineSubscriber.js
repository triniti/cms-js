import camelCase from 'lodash/camelCase';
import get from 'lodash/get';
import { getFormMeta } from 'redux-form';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import getDatePickerFieldError from '@triniti/cms/components/date-picker-field/getDatePickerFieldError';
import getTextAreaFieldError from '@triniti/cms/components/textarea-field/getTextAreaFieldError';
import getTextFieldError from '@triniti/cms/components/text-field/getTextFieldError';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

export default class TimelineSubscriber extends EventSubscriber {
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
      'allow_comments',
      'description',
      'title',
    ].forEach((fieldName) => {
      data[camelCase(fieldName)] = node.get(fieldName);
    });

    data.imageRef = node.has('image_ref') ? node.get('image_ref').toString() : null;
    data.relatedTimelineRefs = node.get('related_timeline_refs', []);
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    ['title'].forEach((fieldName) => { // field using TextField component
      const error = getTextFieldError(data, fieldName, node);
      if (error) {
        formEvent.addError(fieldName, error);
      }
    });

    if (!data.title) {
      formEvent.addError('title', 'Title is required');
    }

    if (data.imageRef) {
      try {
        node.set('image_ref', NodeRef.fromString(data.imageRef));
      } catch (e) {
        formEvent.addError('imageRef', e.message);
      }
    }

    if (!formEvent.getProps().isCreateForm) {
      let error;
      ['description'].forEach((fieldName) => { // field using TextareaField component
        error = getTextAreaFieldError(data, fieldName, node);
        if (error) {
          formEvent.addError(fieldName, error);
        }
      });

      const redux = formEvent.getRedux();
      if (redux) {
        const fieldsMeta = getFormMeta(formEvent.getName())(redux.getState());
        if (get(fieldsMeta, 'expiresAt.touched')) {
          error = getDatePickerFieldError(data, 'expiresAt', node);
          if (error) {
            formEvent.addError('expiresAt', error);
          }
        }
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

    node.set('title', data.title);
    node.set('image_ref', data.imageRef ? NodeRef.fromString(data.imageRef) : null);

    node.clear('related_timeline_refs');
    if (get(data, 'relatedTimelineRefs.length')) {
      node.addToList('related_timeline_refs', get(data, 'relatedTimelineRefs'));
    }

    node.set('allow_comments', data.allowComments);
    node.set('description', data.description);
  }

  getSubscribedEvents() {
    return {
      'triniti:curator:mixin:timeline.init_form': this.onInitForm,
      'triniti:curator:mixin:timeline.validate_form': this.onValidateForm,
      'triniti:curator:mixin:timeline.submit_form': this.onSubmitForm,
    };
  }
}
