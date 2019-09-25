import camelCase from 'lodash/camelCase';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import getTextFieldError from '@triniti/cms/components/text-field/getTextFieldError';

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const abbrv = (day) => day.substr(0, 3);
const endAtName = (day) => `${abbrv(day)}EndAt`;
const startAtName = (day) => `${abbrv(day)}StartAt`;

export default class PromotionSubscriber extends EventSubscriber {
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
      'post_render_code',
      'pre_render_code',
      'title',
      'priority',
      'widget_refs',
    ].forEach((fieldName) => {
      data[camelCase(fieldName)] = node.get(fieldName);
    });
    data.slot = node.has('slot') ? {
      label: node.get('slot'),
      value: node.get('slot'),
    } : null;

    days.forEach((day) => {
      data[startAtName(day)] = node.get(`${abbrv(day)}_start_at`);
      data[endAtName(day)] = node.get(`${abbrv(day)}_end_at`);
      data[day] = node.has(`${abbrv(day)}_start_at`) && node.has(`${abbrv(day)}_end_at`);
    });
    data.startAt = '00:00:00';
    data.endAt = '11:59:59';
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    if (data.title) {
      const error = getTextFieldError(data, 'title', node);
      if (error) {
        formEvent.addError('title', error);
      }
    }

    if (!data.title) {
      formEvent.addError('title', 'Title is required');
    }

    if (!formEvent.getProps().isCreateForm) {
      if (data.slot && data.slot.value) {
        try {
          node.set('slot', data.slot.value);
        } catch (e) {
          formEvent.addError('slot', e.getMessage());
        }
      }

      days.forEach((day) => {
        let startAt = data[`${abbrv(day)}StartAt`];
        if (startAt && startAt.length === 5) {
          startAt += ':00';
        }
        let endAt = data[`${abbrv(day)}EndAt`];
        if (endAt && endAt.length === 5) {
          endAt += ':00';
        }
        if (startAt && endAt && +startAt.replace(/:/g, '') > +endAt.replace(/:/g, '')) {
          formEvent.addError(`${abbrv(day)}EndAt`, 'Start at time must be earlier than end at time.');
        }
      });
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

    if (!formEvent.getProps().isCreateForm) {
      [
        'post_render_code',
        'pre_render_code',
      ].forEach((fieldName) => {
        node.set(fieldName, data[camelCase(fieldName)]);
      });

      node.set('slot', data.slot ? data.slot.value : null);
      node.set('priority', +data.priority);
      node.clear('widget_refs');
      if (data.widgetRefs && data.widgetRefs.length > 0) {
        node.addToList('widget_refs', data.widgetRefs);
      }

      let startAt;
      let endAt;
      days.forEach((day) => {
        startAt = data[startAtName(day)];
        if (startAt) {
          if (startAt.length === 5) { // if format is '00:00'
            startAt += ':00'; // change to '00:00:00'
          }
          node.set(`${abbrv(day)}_start_at`, startAt);
        } else {
          node.clear(`${abbrv(day)}_start_at`);
        }

        endAt = data[endAtName(day)];
        if (endAt) {
          if (endAt.length === 5) { // if format is '00:00'
            endAt += ':00'; // change to '00:00:00'
          }
          node.set(`${abbrv(day)}_end_at`, endAt);
        } else {
          node.clear(`${abbrv(day)}_end_at`);
        }
      });
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:curator:mixin:promotion.init_form': this.onInitForm,
      'triniti:curator:mixin:promotion.validate_form': this.onValidateForm,
      'triniti:curator:mixin:promotion.submit_form': this.onSubmitForm,
    };
  }
}
