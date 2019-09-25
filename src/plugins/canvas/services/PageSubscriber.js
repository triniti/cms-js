import camelCase from 'lodash/camelCase';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

export default class PageSubscriber extends EventSubscriber {
  constructor(layouts) {
    super();
    this.pageLayouts = layouts;
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

    ['title', 'image_ref'].forEach((fieldName) => {
      data[camelCase(fieldName)] = node.has(fieldName) ? node.get(fieldName).toString() : null;
    });

    if (node.has('layout')) {
      data.layout = {
        label: this.pageLayouts.find((layout) => layout.value === node.get('layout')).label,
        value: node.get('layout'),
      };
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

    if (!data.title) {
      formEvent.addError('title', 'Title is required');
    }

    if (data.title) {
      try {
        node.set('title', data.title);
      } catch (e) {
        formEvent.addError('title', e.message);
      }
    }

    if (data.imageRef) {
      try {
        node.set('image_ref', NodeRef.fromString(data.imageRef));
      } catch (e) {
        formEvent.addError('imageRef', e.message);
      }
    }

    if (data.layout) {
      try {
        node.set('layout', data.layout.value);
      } catch (e) {
        formEvent.addError('layout', e.message);
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

    if (data.layout && data.layout.value) {
      node.set('layout', data.layout.value);
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:canvas:mixin:page.init_form': this.onInitForm,
      'triniti:canvas:mixin:page.validate_form': this.onValidateForm,
      'triniti:canvas:mixin:page.submit_form': this.onSubmitForm,
    };
  }
}
