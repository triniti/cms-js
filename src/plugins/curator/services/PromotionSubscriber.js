import camelCase from 'lodash/camelCase';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import getTextFieldError from '@triniti/cms/components/text-field/getTextFieldError';
import SlotV1 from '@triniti/schemas/triniti/curator/SlotV1';
import SlotRendering from '@triniti/schemas/triniti/curator/enums/SlotRendering';
import isEmpty from 'lodash/isEmpty';
import startCase from 'lodash/startCase';

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

    data.slots = node.get('slots', []).map((slot) => ({
      name: slot.get('name'),
      rendering: {
        label: startCase(slot.get('rendering').toString()),
        value: slot.get('rendering').toString(),
      },
      widgetRef: slot.get('widget_ref') ? [slot.get('widget_ref')] : null,
    }));
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

      if (data.slots && data.slots.length > 0) {
        const slotsErrors = [];

        data.slots.forEach((slotsData, index) => {
          const error = {};

          if (slotsData) {
            if (!slotsData.name) {
              error.name = 'slot name is required';
            }

            if (isEmpty(slotsData.widgetRef)) {
              error.widgetRef = 'slot widget_ref is required';
            }
          }

          if (!isEmpty(error)) {
            slotsErrors[index] = error;
          }
        });

        if (slotsErrors.length > 0) {
          formEvent.addError('slots', slotsErrors);
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
    const slotSchema = SlotV1.schema();

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

      node.clear('slots');
      if (data.slots) {
        const slots = data.slots.map((slotData) => {
          const slotNode = slotSchema.createMessage();
          const { name, rendering, widgetRef } = slotData;

          let ref = widgetRef[0];
          if (typeof ref === 'string') {
            ref = NodeRef.fromString(widgetRef[0]);
          }

          slotNode
            .set('name', name)
            .set('rendering', rendering.value ? SlotRendering.create(rendering.value) : null)
            .set('widget_ref', ref);

          return slotNode;
        });

        node.addToList('slots', slots || []);
      }
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
