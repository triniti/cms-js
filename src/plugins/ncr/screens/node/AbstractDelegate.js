/* globals document, window */
import { change, clearSubmitErrors, destroy, registerField, stopSubmit, SubmissionError, submit, touch } from 'redux-form';
import dismissAlert from '@triniti/admin-ui-plugin/actions/dismissAlert';
import FormEvent from '@triniti/app/events/FormEvent';
import get from 'lodash/get';
import merge from 'lodash/merge';
import noop from 'lodash/noop';
import swal from 'sweetalert2';

import {
  STATUS_NONE,
  STATUS_PENDING,
  SUFFIX_INIT_FORM,
  SUFFIX_SUBMIT_FORM,
  SUFFIX_VALIDATE_FORM,
  SUFFIX_WARN_FORM,
} from '@triniti/app/constants';
import clearResponse from '@triniti/cms/plugins/pbjx/actions/clearResponse';
import destroyEditor from '@triniti/cms/plugins/blocksmith/actions/destroyEditor';
import formData from '@triniti/cms/utils/formData';
import joinCollaboration from '@triniti/cms/plugins/raven/actions/joinCollaboration';
import leaveCollaboration from '@triniti/cms/plugins/raven/actions/leaveCollaboration';
import sendAlert from '@triniti/admin-ui-plugin/actions/sendAlert';
import sendHeartbeat from '@triniti/cms/plugins/raven/actions/sendHeartbeat';

import deleteNode from '../../actions/deleteNode';
import updateNode from '../../actions/updateNode';

/**
 * When the user closes the browser or hits refresh we
 * must ensure they leave the collaboration.  Every
 * time we run startMonitor we create a new listener
 * and bind it to "beforeunload".
 *
 * @Type {Function}
 */
let leaveCollaborationOnUnload;

/**
 * When a user is collaborating on a node we create an
 * interval to send a heartbeat to all other users.
 *
 * A user can only be collaborating on one node at a
 * time within a given browser window so we ensure
 * this with one interval.
 *
 * @see startCollaborationMonitor
 *
 * @type {?number}
 */
let monitor = null;

/**
 * When the user switches between tabs in the browser
 * we must restart the monitor since not doing so
 * may take 20 seconds or more for it to start again.
 *
 * @Type {?Function}
 */
let handleVisibilityChange = null;

/**
 * Flag to keep track of whether or not to return to the
 * search nodes screen after a successful update.
 *
 * @Type {Boolean}
 */
let shouldCloseAfterSave = false;

let shouldForceSave = false;

/**
 * Flag to keep track of whether or not to auto publish node
 * after a successful update.
 *
 * @Type {Boolean}
 */
let shouldPublishAfterSave = false;

export default class AbstractDelegate {
  /**
   * @param {Object} config
   * @param {Object} dependencies
   */
  constructor(config, { pbjx }) {
    this.config = merge(
      {
        actions: {
          deleteNode: {},
          updateNode: {},
        },
        formName: 'invalid',
        nodeKey: 'node',
        enableCollaboration: true,
        enableEtagValidation: false, // fixme: restore etag validation
      },
      config,
    );

    /** @type {Pbjx} pbjx */
    this.pbjx = pbjx;

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

    this.handleDelete = this.handleDelete.bind(this);
    this.handleForceSave = this.handleForceSave.bind(this);
    this.handleForceSubmit = this.handleForceSubmit.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSaveAndClose = this.handleSaveAndClose.bind(this);
    this.handleSaveAndPublish = this.handleSaveAndPublish.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleValidate = this.handleValidate.bind(this);
    this.handleWarn = this.handleWarn.bind(this);
  }

  /**
   * @param {Component} component
   */
  bindToComponent(component) {
    this.component = component;
    this.dispatch = component.props.dispatch;
  }

  /**
   * @link https://reactjs.org/docs/react-component.html#componentdidmount
   *
   * Fetches the node for the screen (if not already available) and ensures
   * an existing form matches the provided NodeRef otherwise it will be
   * destroyed. This is needed because redux form state is not wiped out
   * when components are unmounted (as of 20180331)
   */
  componentDidMount() {
    const {
      canCollaborate = false,
      // @see initialRequestState in '@triniti/cms/plugins/pbjx/reducers/pbjx.js'
      getNodeRequestState,
      isCollaborating = false,
      isEditMode = false,
      nodeRef,
    } = this.component.props;

    this.startCollaborationMonitor();

    if (isEditMode && canCollaborate && !isCollaborating) {
      this.dispatch(joinCollaboration(nodeRef));
    }

    // fixme: redirect when user hits "edit" but can't save/update
    const { request, response } = getNodeRequestState;
    if (request && request.get('node_ref').equals(nodeRef) && response) {
      // same node, do nothing
      return;
    }

    this.dispatch(destroy(this.getFormName()));
    this.dispatch(destroyEditor(this.getFormName()));
    this.dispatch(this.config.schemas.getNodeRequest.createMessage().set('node_ref', nodeRef))
      .then(noop)
      .catch(this.stopCollaborationMonitor);
  }

  /**
   * @link https://reactjs.org/docs/react-component.html#componentdidupdate
   *
   * @param {Object} prevProps
   * @param {Object} prevState
   * @param {Object} snapshot
   */

  /* eslint-disable no-unused-vars */
  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      getNodeRequestState: { status },
      isCollaborating,
      isEditMode,
      nodeRef,
    } = this.component.props;

    if (
      status === STATUS_NONE
      || (status !== STATUS_PENDING && prevProps.nodeRef.getId() !== nodeRef.getId())
      || prevProps.isEditMode !== isEditMode
    ) {
      this.dispatch(this.config.schemas.getNodeRequest.createMessage().set('node_ref', nodeRef));
    }

    if (prevProps.isCollaborating !== isCollaborating) {
      this.startCollaborationMonitor();
    }
  }

  /**
   * @link https://reactjs.org/docs/react-component.html#componentwillunmount
   */
  componentWillUnmount() {
    const {
      nodeRef,
      isEditMode = false,
      canCollaborate = false,
      isCollaborating = false,
    } = this.component.props;

    if (isEditMode && canCollaborate && isCollaborating) {
      this.dispatch(leaveCollaboration(nodeRef));
    }

    this.stopCollaborationMonitor();
    swal.close();
    this.dispatch(clearResponse(this.config.schemas.getNodeRequest.getCurie()));
  }

  /**
   * @param {Object} data
   * @param {Object} formProps
   *
   * @returns {FormEvent}
   */
  createFormEvent(data, formProps) {
    const { schemas } = this.config;
    const node = formProps.node;
    const command = schemas.updateNode.createMessage({
      expected_etag: this.isEtagValidationEnabled()
        ? node.get('etag')
        : null,
      node_ref: this.component.props.nodeRef,
      old_node: node.freeze(),
      new_node: node.clone(),
    });

    return new FormEvent(command, formProps.form, data, formProps);
  }

  /**
   * Get the base route url based on current screen match prop
   *
   * @returns {string} something like /news/articles
   */
  getBaseUrl() {
    const { match: { url } } = this.component.props;
    const urlParts = url.split('/');

    return `/${urlParts[1]}/${urlParts[2]}`;
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
   * Get the node for this edit screen
   *
   * @returns {Message}
   */
  getNode() {
    const { getNodeRequestState: { response }, nodeRef } = this.component.props;

    const nodeId = nodeRef.getId();
    let node = null;
    if (response && response.get('node').get('_id').toString() === nodeId) {
      node = response.get('node');
    }

    return node;
  }

  /**
   * Get all schemas
   * @returns {object}
   */
  getSchemas() {
    return this.config.schemas;
  }

  /**
   * @link https://redux-form.com/7.2.3/docs/api/props.md/#-code-initialvalues-object-code-
   *
   * @returns {Object}
   */
  getInitialValues() {
    const node = this.component.props.getNodeRequestState.response.get('node');
    const formEvent = this.createFormEvent({}, { node, form: this.getFormName() });
    this.pbjx.trigger(formEvent.getMessage(), SUFFIX_INIT_FORM, formEvent);
    return formEvent.getData();
  }

  /**
   * Creates and dispatches a command to delete the node
   * which is later handled by the deleteNodeFlow saga.
   */
  handleDelete() {
    const { actions, schemas } = this.config;
    const { history, nodeRef, match: { params: { type } } } = this.component.props;
    const command = schemas.deleteNode.createMessage({ node_ref: nodeRef });
    const actionCreator = actions.deleteNode.creator || deleteNode;

    if (!get(this, 'config.schemas.node')) {
      this.config = {
        ...this.config,
        schemas: {
          ...schemas,
          node: schemas.nodes.find((node) => node.getCurie().getMessage() === type),
        },
      };
    }

    this.dispatch(actionCreator(
      command,
      history,
      { ...this.config, formName: this.getFormName() },
    ));
  }

  /**
   * @link https://redux-form.com/7.3.0/examples/remotesubmit/
   *
   * force to save the form by reverting invalid values to initial values
   */
  handleForceSave() {
    shouldCloseAfterSave = false;
    shouldForceSave = true;
    shouldPublishAfterSave = false;
    const { alerts, formErrors } = this.component.props;
    alerts.forEach(({ id }) => this.dispatch(dismissAlert(id)));

    const formName = this.getFormName();
    this.dispatch(submit(formName));

    const invalidFields = Object.keys(formErrors);

    // if invalid fields are found, form won't even call `handleSubmit`
    // to force a submit, need to revert those fields to initial values
    if (invalidFields.length) {
      this.dispatch(clearSubmitErrors(formName));
      this.dispatch(stopSubmit(formName));
      const initialValues = this.getInitialValues();
      invalidFields.forEach((field) => {
        this.dispatch(change(formName, field, initialValues[field]));
      });
      setTimeout(() => this.dispatch(submit(formName)));
    }
  }

  handleForceSubmit(data, formDispatch, formProps) {
    return new Promise((resolve, reject) => {
      const formEvent = this.createFormEvent(data, formProps);
      const command = formEvent.getMessage();
      const { history, match } = this.component.props;

      try {
        this.pbjx.trigger(command, SUFFIX_SUBMIT_FORM, formEvent);
      } catch (e) {
        console.error('error: ', e.stack.toString());
      }

      const actionCreator = this.config.actions.updateNode.creator || updateNode;
      this.dispatch(actionCreator(command, resolve, reject, history, match, {
        ...this.config,
        clearFormData: (key) => formData.clear(key),
        formName: formProps.form,
        getFormData: (key) => formData.get(key),
        shouldCloseAfterSave,
        shouldForceSave,
        shouldPublishAfterSave,
      }));
    });
  }

  /**
   * @link https://redux-form.com/7.3.0/examples/remotesubmit/
   *
   * When a user clicks the save button we perform a remote
   * submit to the redux form.  The actual form is handled
   * in the "handleSubmit" function.
   */
  handleSave() {
    shouldCloseAfterSave = false;
    shouldForceSave = false;
    shouldPublishAfterSave = false;
    this.dispatch(submit(this.getFormName()));
    const { formErrorAlerts } = this.component.props;
    (formErrorAlerts || []).forEach((alert) => this.dispatch(sendAlert(alert)));
  }

  /**
   * @link https://redux-form.com/7.3.0/examples/remotesubmit/
   *
   * When a user clicks the save button we perform a remote
   * submit to the redux form.  The actual form is handled
   * in the "handleSubmit" function.
   */
  handleSaveAndClose() {
    shouldCloseAfterSave = true;
    shouldForceSave = false;
    shouldPublishAfterSave = false;
    this.dispatch(submit(this.getFormName()));
    const { formErrorAlerts } = this.component.props;
    (formErrorAlerts || []).forEach((alert) => this.dispatch(sendAlert(alert)));
  }

  /**
   * @link https://redux-form.com/7.3.0/examples/remotesubmit/
   *
   * When a user clicks the save and publish button we perform a remote
   * submit to the redux form.  The actual form is handled
   * in the "handleSubmit" function.
   * This method will also triiger a saga watcher which will trace the saving process
   * and dispatch a publish node action when the saving action success.
   */
  async handleSaveAndPublish() {
    const result = await swal.fire({
      title: 'Are you sure?',
      text: 'Item will be published immediately after updating.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, continue',
      reverseButtons: true,
    });

    if (result.value) {
      shouldCloseAfterSave = false;
      shouldForceSave = false;
      shouldPublishAfterSave = true;
      this.dispatch(submit(this.getFormName()));
      const { formErrorAlerts } = this.component.props;
      (formErrorAlerts || []).forEach((alert) => this.dispatch(sendAlert(alert)));
    }
  }

  /**
   * @link https://redux-form.com/7.2.3/docs/api/props.md/#-code-handlesubmit-eventorsubmit-function-code-
   *
   * In this method we prepare the command and dispatch an action
   * which is later handled by the updateNodeFlow saga.
   *
   * @param {Object}   data
   * @param {Function} formDispatch - same as delegate dispatch, can be ignored
   * @param {Object}   formProps
   *
   * @returns {Promise}
   */
  handleSubmit(data, formDispatch, formProps) {
    if (shouldForceSave) {
      return this.handleForceSubmit(data, formDispatch, formProps);
    }

    return new Promise((resolve, reject) => {
      const formEvent = this.createFormEvent(data, formProps);
      const command = formEvent.getMessage();
      const { history, match } = this.component.props;

      try {
        this.pbjx.trigger(command, SUFFIX_SUBMIT_FORM, formEvent);
        const errors = { ...formProps.asyncErrors, ...formProps.syncErrors };
        Object.entries(errors).forEach(([key, value]) => {
          formEvent.addError(key, value);
        });
        if (formEvent.hasErrors()) {
          Object.keys(formEvent.getErrors()).forEach((key) => {
            if (!formProps.registeredFields[key]) {
              this.dispatch(registerField(formProps.form, key, 'Field'));
              this.dispatch(touch(formProps.form, key));
            }
          });
          reject(new SubmissionError(formEvent.getErrors()));
          return;
        }
      } catch (e) {
        reject(new SubmissionError({ _error: e.stack.toString() }));
        return;
      }

      const actionCreator = this.config.actions.updateNode.creator || updateNode;
      this.dispatch(actionCreator(command, resolve, reject, history, match, {
        ...this.config, formName: formProps.form, shouldCloseAfterSave, shouldPublishAfterSave,
      }));
    });
  }

  /**
   * Toggles EditMode and ViewMode.
   */
  handleToggle() {
    const {
      nodeRef, history, match, canCollaborate = false,
    } = this.component.props;
    const { url, params: { mode } } = match;
    const path = mode === 'edit' ? url.substring(0, url.lastIndexOf('/edit')) : `${url}/edit`;

    if (canCollaborate) {
      if (mode === 'edit') {
        this.dispatch(leaveCollaboration(nodeRef));
      } else {
        this.dispatch(joinCollaboration(nodeRef));
      }
    }

    history.push(path);
  }

  /**
   * @link https://redux-form.com/7.2.3/docs/api/reduxform.md/#-code-validate-values-object-props-object-gt-errors-object-code-optional-
   *
   * @param {Object} values
   * @param {Object} formProps
   *
   * @returns {Object}
   */
  handleValidate(values, formProps) {
    const formEvent = this.createFormEvent(values, formProps);
    this.pbjx.trigger(formEvent.getMessage(), SUFFIX_VALIDATE_FORM, formEvent);
    return formEvent.getErrors();
  }

  /**
   * @link https://redux-form.com/7.2.3/docs/api/reduxform.md/#-code-warn-values-object-props-object-gt-warnings-object-code-optional-
   *
   * @param {Object} values
   * @param {Object} formProps
   *
   * @returns {Object}
   */
  handleWarn(values, formProps) {
    const formEvent = this.createFormEvent(values, formProps);
    this.pbjx.trigger(formEvent.getMessage(), SUFFIX_WARN_FORM, formEvent);
    return formEvent.getWarnings();
  }

  /**
   * @returns {boolean}
   */
  isCollaborationEnabled() {
    return this.config.enableCollaboration;
  }

  /**
   * @returns {boolean}
   */
  isEtagValidationEnabled() {
    return this.config.enableEtagValidation;
  }

  /**
   * When a user opens a screen we'll start a monitor that sends
   * a heartbeat action every 10 seconds to ensure the current
   * presence of the user is kept current.
   */
  startCollaborationMonitor() {
    if (!this.isCollaborationEnabled()) {
      this.stopCollaborationMonitor();
      return;
    }

    const {
      nodeRef,
      isEditMode = false,
      canCollaborate = false,
      isCollaborating = false,
      isPristine,
    } = this.component.props;

    this.stopCollaborationMonitor();
    if (!isEditMode || !canCollaborate || !isCollaborating) {
      return;
    }

    /* eslint-disable no-param-reassign */
    leaveCollaborationOnUnload = (event) => {
      if (isPristine) {
        this.stopCollaborationMonitor();
        return this.dispatch(leaveCollaboration(nodeRef));
      }
      event.preventDefault();
      const start = setTimeout(() => {
        const cancel = setTimeout(() => {
          clearTimeout(cancel);
          // user cancels leaving/closing the page so re-join
          this.dispatch(joinCollaboration(nodeRef));
        }, 0);
        clearTimeout(start);
      }, 0);
      event.returnValue = 'Unsaved changes detected.'; // required to work in Chrome
      this.dispatch(leaveCollaboration(nodeRef));
      return event.returnValue;
    };

    window.addEventListener('beforeunload', leaveCollaborationOnUnload);

    handleVisibilityChange = () => {
      if (!document.hidden) {
        const node = this.getNode();
        this.dispatch(sendHeartbeat(`${nodeRef}`, node ? node.get('etag') : null));
        this.startCollaborationMonitor();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange, false);

    monitor = setInterval(() => {
      const node = this.getNode();
      this.dispatch(sendHeartbeat(`${nodeRef}`, node ? node.get('etag') : null));
    }, 8000);
  }

  /**
   * When a user leaves the screen (component gets unmounted)
   * this should be called.  Even if the user is merely going
   * to a separate tab on the same node screen this still must
   * be called to ensure that the monitor is stopped.
   *
   * This is important because we don't know if the user is
   * leaving the node entirely or just going to a different
   * tab.  This method MUST NOT control the join/leave of
   * the collaboration itself as that creates an infinite
   * loop when all the user was doing was going to a different
   * tab on the same screen.  At some point we'll probably
   * refactor this to use redux based router and control
   * this heartbeat with a saga.  For now, it's in the
   * screen's component lifecycle.
   */
  stopCollaborationMonitor() {
    if (monitor) {
      clearInterval(monitor);
      monitor = null;
    }

    if (handleVisibilityChange) {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      handleVisibilityChange = null;
    }

    if (leaveCollaborationOnUnload) {
      window.removeEventListener('beforeunload', leaveCollaborationOnUnload);
    }
  }
}
