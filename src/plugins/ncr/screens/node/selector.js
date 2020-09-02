import { isPristine as isFormPristine, isSubmitting as isFormSubmitting } from 'redux-form';
import convertFormErrorsToAlerts from '@triniti/cms/utils/convertFormErrorsToAlerts';
import forceSaveConfig from 'config/forceSaveConfig'; // eslint-disable-line import/no-unresolved
import getAlerts from '@triniti/admin-ui-plugin/selectors/getAlerts';
import getCommand from '@triniti/cms/plugins/pbjx/selectors/getCommand';
import getForm from '@triniti/cms/selectors/getForm';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import hasNode from '@triniti/cms/plugins/ncr/selectors/hasNode';
import isBlocksmithDirty from '@triniti/cms/plugins/blocksmith/selectors/isBlocksmithDirty';
import isCollaborating from '@triniti/cms/plugins/raven/selectors/isCollaborating';
import isGranted from '@triniti/cms/plugins/iam/selectors/isGranted';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { STATUS_PENDING } from '@triniti/app/constants';

/**
 * This is a selector factory to generate generic node screen props.
 * @param {Object} state     - The entire redux state.
 * @param {Object} ownProps  - Props given to the screen.
 * @param {object} schemas
 * @param {string} formName
 * @param {*}      rest
 *
 * @returns {Object}
 */
export default (state, ownProps, { schemas, formName, ...rest }) => {
  const { match } = ownProps;
  const { tab = '', mode = '', type, node_id: nodeId } = match.params;

  const nodeSchema = schemas.nodes
    ? schemas.nodes.find((schema) => schema.getCurie().getMessage() === type) : schemas.node;

  /* pbjx and redux-form */
  const nodeRef = new NodeRef(nodeSchema.getQName(), nodeId);
  const getNodeRequestState = getRequest(state, schemas.getNodeRequest.getCurie());
  const deleteNodeState = getCommand(state, schemas.deleteNode.getCurie());
  const updateNodeState = getCommand(state, schemas.updateNode.getCurie());

  const { response } = getNodeRequestState;
  const nodeStatus = response ? response.get('node').get('status') : '';

  const isDeleteGranted = isGranted(state, `${schemas.deleteNode.getCurie()}`);
  const isForceSaveGranted = isGranted(state, forceSaveConfig.permission);
  const isUpdateGranted = isGranted(state, `${schemas.updateNode.getCurie()}`);

  const isEditMode = (mode === 'edit') && (isDeleteGranted || isUpdateGranted);
  const isPristine = isFormPristine(formName)(state) && !isBlocksmithDirty(state, formName);
  const isSubmitting = isFormSubmitting(formName)(state);
  const isLocked = hasNode(state, nodeRef) && getNode(state, nodeRef).get('is_locked');

  const isPending = isSubmitting
    || deleteNodeState.status === STATUS_PENDING
    || updateNodeState.status === STATUS_PENDING;

  const isDeleteDisabled = !isDeleteGranted || isPending || nodeStatus.toString() === 'deleted';
  const isForceSaveDisabled = isPending;
  const isSaveDisabled = !isUpdateGranted || isPristine || isPending;
  const isToggleDisabled = !isPristine || isBlocksmithDirty(state, formName);

  const isSaveAndPublishDisabled = isSaveDisabled
    || nodeStatus.toString() === 'published'
    || !schemas.publishNode
    || !isGranted(state, schemas.publishNode.getCurie().toString());

  /* alert bar */
  const alerts = getAlerts(state, formName);
  const form = getForm(state, formName);
  // populated thru redux-form validation
  // https://redux-form.com/8.1.0/docs/api/reduxform.md/#-code-validate-values-object-props-object-gt-errors-object-code-optional-
  const formErrorAlerts = convertFormErrorsToAlerts(form);
  const formErrors = {
    ...form.submitErrors,
    ...form.asyncErrors,
    ...form.syncErrors,
  };

  return {
    alerts,
    canCollaborate: isUpdateGranted,
    formErrorAlerts,
    formErrors,
    getNodeRequestState,
    isCollaborating: isCollaborating(state, nodeRef),
    isDeleteDisabled,
    isEditMode,
    isForceSaveDisabled,
    isForceSaveGranted,
    isLocked,
    isPristine,
    isSaveDisabled,
    isSaveAndPublishDisabled,
    isToggleDisabled,
    modePath: isEditMode ? '/edit' : '',
    nodeRef,
    schema: nodeSchema,
    tab,
    ...rest,
  };
};
