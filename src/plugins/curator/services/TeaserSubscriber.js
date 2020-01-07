import get from 'lodash/get';
import isBoolean from 'lodash/isBoolean';
import camelCase from 'lodash/camelCase';
import { getFormMeta } from 'redux-form';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import getDatePickerFieldError from '@triniti/cms/components/date-picker-field/getDatePickerFieldError';
import getKeyValuesFieldErrors from '@triniti/cms/components/key-values-field/getKeyValuesFieldErrors';
import getTextAreaFieldError from '@triniti/cms/components/textarea-field/getTextAreaFieldError';
import getTextFieldError from '@triniti/cms/components/text-field/getTextFieldError';
import LinkTeaserV1Mixin from '@triniti/schemas/triniti/curator/mixin/link-teaser/LinkTeaserV1Mixin';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import YoutubeVideoTeaserV1Mixin from '@triniti/schemas/triniti/curator/mixin/youtube-video-teaser/YoutubeVideoTeaserV1Mixin';
import { formNames } from '../constants';

export default class TeaserSubscriber extends EventSubscriber {
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

    ['cta_text', 'description', 'order_date', 'sync_with_target', 'title'].forEach((fieldName) => {
      if (node.has(fieldName)) {
        data[camelCase(fieldName)] = node.get(fieldName);
      }
    });

    data.imageRef = node.has('image_ref') ? node.get('image_ref').toString() : null;
    data.slotting = !node.has('slotting') ? null : Object.entries(node.get('slotting')).map(([name, value]) => ({
      key: {
        label: name,
        value: name,
      },
      value,
    }));
    data.timelineRefs = [];
    if (node.has('timeline_ref')) {
      data.timelineRefs.push(node.get('timeline_ref'));
    }
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    let error;
    // fields using TextField component
    ['title', 'ctaText'].forEach((fieldName) => {
      if (data[fieldName]) {
        error = getTextFieldError(data, fieldName, node);
        if (error) {
          formEvent.addError(fieldName, error);
        }
      }
    });

    error = getTextAreaFieldError(data, 'description', node);
    if (error) {
      formEvent.addError('description', error);
    }

    const redux = formEvent.getRedux();
    if (redux) {
      const fieldsMeta = getFormMeta(formEvent.getName())(redux.getState());
      ['expiresAt', 'orderDate'].forEach((fieldName) => {
        if (get(fieldsMeta, `${fieldName}.touched`)) {
          error = getDatePickerFieldError(data, fieldName, node);
          if (error) {
            formEvent.addError(fieldName, error);
          }
        }
      });
      if ((fieldsMeta.slotting || []).some((slot) => get(slot, 'key.touched') || get(slot, 'value.touched'))) {
        const { errors, hasError } = getKeyValuesFieldErrors(data, 'slotting', node);
        if (hasError) {
          formEvent.addError('slotting', errors);
        }
      }
    }

    if (!data.title) {
      if (formEvent.getName() !== formNames.CREATE_TEASER) {
        formEvent.addError('title', 'Title is required');
      } else {
        switch (node.schema().getCurie().getMessage()) {
          case LinkTeaserV1Mixin.findOne().getCurie().getMessage():
          case YoutubeVideoTeaserV1Mixin.findOne().getCurie().getMessage():
            formEvent.addError('title', 'Title is required');
            break;
          default:
            break;
        }
      }
    }

    if (data.imageRef) {
      try {
        node.set('image_ref', NodeRef.fromString(data.imageRef));
      } catch (e) {
        formEvent.addError('imageRef', e.message);
      }
    }

    if (data.timelineRef) {
      try {
        node.set('timeline_ref', NodeRef.fromString(data.timelineRef.value));
      } catch (e) {
        formEvent.addError('timelineRef', e.message);
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
    const { isCreateForm, schemas } = formEvent.getProps();

    if (node.isFrozen()) {
      return;
    }

    ['cta_text', 'description', 'title'].forEach((fieldName) => {
      if (data[camelCase(fieldName)]) {
        node.set(fieldName, data[camelCase(fieldName)]);
      } else {
        node.clear(fieldName);
      }
    });

    node.set('image_ref', data.imageRef ? NodeRef.fromString(data.imageRef) : null);

    node.clear('timeline_ref');
    if (data.timelineRefs && data.timelineRefs.length) {
      node.set('timeline_ref', data.timelineRefs[0]);
    }

    if (isCreateForm && schemas.node.hasMixin('triniti:curator:mixin:teaser-has-target')) {
      node.set('sync_with_target', true);
    } else if (isBoolean(data.syncWithTarget)) {
      node.set('sync_with_target', data.syncWithTarget);
    }

    node.set('order_date', data.orderDate || null);

    node.clear('slotting');
    (data.slotting || []).forEach(({ key, value }) => {
      if (key.label && value) {
        node.addToMap('slotting', key.label, +value);
      }
    });
  }

  getSubscribedEvents() {
    return {
      'triniti:curator:mixin:teaser.init_form': this.onInitForm,
      'triniti:curator:mixin:teaser.validate_form': this.onValidateForm,
      'triniti:curator:mixin:teaser.submit_form': this.onSubmitForm,
    };
  }
}
