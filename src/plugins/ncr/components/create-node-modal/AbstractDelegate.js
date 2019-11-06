import get from 'lodash/get';
import merge from 'lodash/merge';
import noop from 'lodash/noop';
import { blur, change, reset, SubmissionError, submit } from 'redux-form';

import createNode from '@triniti/cms/plugins/ncr/actions/createNode';
import FormEvent from '@triniti/app/events/FormEvent';
import { SUFFIX_SUBMIT_FORM, SUFFIX_VALIDATE_FORM } from '@triniti/app/constants';

export default class AbstractDelegate {
  /**
   * @param {Object} config
   * @param {Object} dependencies
   */
  constructor(config, { pbjx, sluggableForms }) {
    this.config = merge(
      {
        action: {},
        formName: 'invalid',
      },
      config,
    );

    /** @type {Pbjx} pbjx */
    this.pbjx = pbjx;
    this.sluggableForms = sluggableForms;

    /** @type {Function} */
    this.dispatch = noop;

    /**
     * When the delegate is first created it isn't bound to a component.
     * Binding to a component is an optional feature of a delegate so if
     * that happens the component property will be a reference to a
     * component instance.  For functional components, it's an object.
     *
     * @type {Component|{dispatch: Function, props: {}, state: {}}}
     */
    this.component = {
      dispatch: noop,
      props: {},
      state: {},
    };
    this.handleBlurSlug = this.handleBlurSlug.bind(this);
    this.handleChangeSlug = this.handleChangeSlug.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleValidate = this.handleValidate.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.getSluggableConfig = this.getSluggableConfig.bind(this);
  }

  /**
   * @param {Component} component
   */
  bindToComponent(component) {
    this.component = component;
    this.dispatch = component.props.dispatch;
  }

  /**
   * @param {Object} data
   * @param {Object} formProps
   *
   * @returns {FormEvent}
   */
  createFormEvent(data, formProps) {
    let { schemas } = this.config;
    // for multi-type schema.node comes from formProps.schemas
    if ((!schemas || (schemas.nodes && schemas.nodes.length > 0)) && formProps.schemas.node) {
      schemas = { ...schemas, ...formProps.schemas };
    }
    const node = schemas.node.createMessage();
    const command = schemas.createNode.createMessage({ node });

    return new FormEvent(command, formProps.form, data, {
      ...formProps,
      isCreateForm: true, // for subscriber logic
    });
  }

  /**
   * Gets the formName that should be used for redux form events
   * and action creators that use this delegate's config.
   *
   * This is a method and not a static value to allow for overriding
   * when dynamic form names are used, e.g. dam asset management.
   *
   * @returns {string}
   */
  getFormName() {
    return this.config.formName;
  }

  /**
   * @returns {Object|null} - default SluggableForms config is set in Plugin's index file
   */
  getSluggableConfig(formName) {
    if (!this.sluggableForms) {
      return null;
    }

    return this.sluggableForms[formName] || this.sluggableForms.default;
  }

  handleBlurSlug(slug) {
    const form = this.getFormName();
    this.dispatch(blur(form, 'slug', slug));
  }

  handleChangeSlug(slug) {
    const form = this.getFormName();
    this.dispatch(change(form, 'slug', slug));
  }

  /**
   * @link https://redux-form.com/7.3.0/examples/remotesubmit/
   *
   * When a user clicks the save button we perform a remote
   * submit to the redux form.  The actual form is handled
   * in the "handleSubmit" function.
   */
  handleSave() {
    this.dispatch(submit(this.getFormName()));
  }

  /**
   * @link https://redux-form.com/7.2.3/docs/api/props.md/#-code-handlesubmit-eventorsubmit-function-code-
   *
   * In this method we prepare the command and dispatch an action
   * which is later handled by the createNodeFlow saga.
   *
   * @param {Object}   data
   * @param {Function} formDispatch - same as delegate dispatch, can be ignored
   * @param {Object}   formProps
   *
   * @returns {Promise}
   */
  handleSubmit(data, formDispatch, formProps) {
    return new Promise((resolve, reject) => {
      const formEvent = this.createFormEvent(data, formProps);
      const command = formEvent.getMessage();
      const { history } = this.component.props;

      try {
        this.pbjx.trigger(command, SUFFIX_SUBMIT_FORM, formEvent);
      } catch (e) {
        reject(new SubmissionError({ _error: e.stack.toString() }));
        return;
      }

      if (get(this, 'config.schemas.nodes') && formProps.schemas.node) { // multi-type node schemas come from formProps
        this.config = Object.assign(this.config, {
          // de- and re-structuring here to remove object references, if
          // you don't then when the form is reset the node schema is lost
          schemas: { ...formProps.schemas },
        });
      }

      const actionCreator = this.config.action.creator || createNode;
      this.dispatch(actionCreator(command, resolve, reject, history, {
        ...this.config,
        formName: formProps.form,
      }));
    });
  }

  /**
   * @link https://redux-form.com/7.4.2/docs/api/reduxform.md
   *
   * @param {Object} values
   * @param {Object} formProps
   *
   * @returns {Object}
   */
  handleValidate(values, formProps) {
    if (!get(this.config, 'schemas.node') && !get(formProps, 'schemas.node')) {
      return null;
    }

    const formEvent = this.createFormEvent(values, formProps);
    this.pbjx.trigger(formEvent.getMessage(), SUFFIX_VALIDATE_FORM, formEvent);
    return formEvent.getErrors();
  }

  /**
   * @link https://redux-form.com/7.2.3/docs/api/reduxform.md/#-code-validate-values-object-props-object-gt-errors-object-code-optional-
   *
   * Resets the form to the initialValues.
   */
  handleReset() {
    this.dispatch(reset(this.getFormName()));
  }
}
