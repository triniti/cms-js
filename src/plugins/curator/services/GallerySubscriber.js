import camelCase from 'lodash/camelCase';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import startCase from 'lodash/startCase';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

export default class GallerySubscriber extends EventSubscriber {
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

    data._id = node.get('_id'); // eslint-disable-line no-underscore-dangle
    data.relatedGalleryRefs = node.get('related_gallery_refs', []);

    ['title', 'description', 'allow_comments', 'launch_text', 'credit_url'].forEach((fieldName) => {
      if (node.has(fieldName)) {
        data[camelCase(fieldName)] = node.get(fieldName);
      }
    });

    if (node.has('image_ref')) {
      data.imageRef = node.get('image_ref').toString();
    }

    if (node.has('credit')) {
      const value = node.get('credit');
      data.credit = { label: startCase(value), value };
    }

    if (node.has('layout')) {
      const value = node.get('layout');
      data.layout = { label: value, value };
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

    if (!formEvent.getProps().isCreateForm) {
      ['title', 'description', 'launch_text', 'credit_url'].forEach((schemaFieldName) => {
        const formFieldName = camelCase(schemaFieldName);
        if (data[formFieldName]) {
          try {
            node.set(schemaFieldName, data[formFieldName]);
          } catch (e) {
            formEvent.addError(formFieldName, e.message);
          }
        }
      });

      if (data.imageRef) {
        try {
          node.set('image_ref', NodeRef.fromString(data.imageRef));
        } catch (e) {
          formEvent.addError('imageRef', e.message);
        }
      }

      const layoutValue = get(data, 'layout.value');
      if (layoutValue) {
        try {
          node.set('layout', layoutValue);
        } catch (e) {
          formEvent.addError('layout', e.message);
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

    if (!formEvent.getProps().isCreateForm) {
      ['description', 'allow_comments', 'title', 'launch_text'].forEach((fieldName) => {
        const value = data[camelCase(fieldName)];
        node.set(fieldName, !isUndefined(value) ? value : null);
      });

      node.set('credit_url', data.creditUrl || null);
      node.set('credit', get(data, 'credit.value', null));
      node.set('image_ref', data.imageRef ? NodeRef.fromString(data.imageRef) : null);
      node.set('layout', get(data, 'layout.value', null));

      node.clear('related_gallery_refs');
      if (data.relatedGalleryRefs) {
        node.addToList('related_gallery_refs', data.relatedGalleryRefs);
      }
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:curator:mixin:gallery.init_form': this.onInitForm,
      'triniti:curator:mixin:gallery.validate_form': this.onValidateForm,
      'triniti:curator:mixin:gallery.submit_form': this.onSubmitForm,
    };
  }
}
