import { call, put, select } from 'redux-saga/effects';
import { blur, getFormValues, reset, SubmissionError } from 'redux-form';
import clearResponse from '@triniti/cms/plugins/pbjx/actions/clearResponse';
import destroyEditor from '@triniti/cms/plugins/blocksmith/actions/destroyEditor';
import formValues from '@triniti/cms/plugins/news/utils/formValues';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import startCase from 'lodash/startCase';
import swal from 'sweetalert2';
import isEqual from 'lodash/isEqual';

import changeNodeFlow from './changeNodeFlow';

export function* onAfterSuccessFlow({ config, history, match, resolve }) {
  yield call(resolve);
  yield put(destroyEditor(config.formName));
  yield put(clearResponse(config.schemas.getNodeRequest.getCurie())); // not sure this is necessary
  const schema = config.schemas.searchNodes || config.schemas.getAllNodesRequest;
  yield put(clearResponse(schema.getCurie()));
  if (config.shouldCloseAfterSave) {
    yield put(reset(config.formName));
    yield call(history.push, match.url.match(/\/.+?\/.+?\//)[0]);
  }

  if (config.shouldForceSave) {
    const localStorageForm = yield formValues.get();
    formValues.clear();

    if (!Object.keys(localStorageForm).length) {
      return;
    }

    const submittedValues = yield select(getFormValues(config.formName));
    const serializedValues = yield JSON.parse(JSON.stringify(submittedValues));
    const localValues = localStorageForm.values;

    const unsavedFields = yield Object.keys(localValues)
      .filter((fieldName) => !isEqual(localValues[fieldName], serializedValues[fieldName]));

    const formErrors = yield Object.assign(
      localStorageForm.asyncErrors || {},
      localStorageForm.submitErrors,
      localStorageForm.syncErrors,
    );
    const invalidFields = yield [].concat(unsavedFields, Object.keys(formErrors))
      .filter((fieldName, index, self) => self.indexOf(fieldName) === index);

    if (!invalidFields.length) {
      return;
    }

    const values = localStorageForm.values;
    const result = yield swal.fire({
      title: 'All updates have been saved, except:',
      html: `<strong>${invalidFields.sort().join(', ')}</strong>`,
      showCancelButton: true,
      confirmButtonText: 'Resolve',
      cancelButtonText: 'Dismiss',
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn btn-secondary',
    });

    if (result.value) {
      let i = 0;
      for (; i < invalidFields.length; i += 1) {
        const fieldName = invalidFields[i];
        const value = values[fieldName];
        yield put(blur(config.formName, fieldName, value));
      }
    }
  }
}

export function* onAfterFailureFlow({ config, reject }, error) {
  const message = typeof error.getMessage === 'function' ? error.getMessage() : error.message;
  yield call(reject, new SubmissionError({ _error: message }));
  if (config.shouldForceSave) {
    formValues.clear();
  }
}

export function* publishAfterUpdateFlow(action) {
  const config = action.config;
  const match = action.match;
  const pbj = action.pbj;
  const nodeSchema = config.schemas.node
    || config.schemas.nodes.find((node) => node.getCurie().getMessage() === match.params.type);

  yield call(changeNodeFlow, {
    expectedEvent: config.schemas.nodePublished.getCurie().toString(),
    failureMessage: `Publish ${startCase(nodeSchema.getCurie().getMessage())} failed: `,
    getNodeRequestSchema: config.schemas.getNodeRequest,
    onAfterFailureFlow: (error) => onAfterFailureFlow(action, error),
    onAfterSuccessFlow: () => onAfterSuccessFlow(action),
    pbj: config.schemas.publishNode.createMessage({ node_ref: pbj.get('node_ref') }),
    successMessage: `Success! The ${startCase(nodeSchema.getCurie().getMessage())} was saved and published.`,
    toastMessage: 'Publishing...',
    verify: (response) => {
      if (!response.pbj.has('node')) {
        return false;
      }
      return response.pbj.get('node').get('status') === NodeStatus.PUBLISHED;
    },
  });
}

export default function* (action) {
  const config = action.config;
  const match = action.match;
  const pbj = action.pbj;
  const nodeSchema = config.schemas.node
    || config.schemas.nodes.find((node) => node.getCurie().getMessage() === match.params.type);
  yield call(changeNodeFlow, {
    expectedEvent: config.schemas.nodeUpdated.getCurie().toString(),
    failureMessage: `Save ${startCase(nodeSchema.getCurie().getMessage())} failed: `,
    getNodeRequestSchema: config.schemas.getNodeRequest,
    onAfterFailureFlow: (error) => onAfterFailureFlow(action, error),
    onAfterSuccessFlow: () => onAfterSuccessFlow(action),
    onContinueFlow: config.shouldPublishAfterSave ? () => publishAfterUpdateFlow(action) : null,
    pbj,
    successMessage: `Success! The ${startCase(nodeSchema.getCurie().getMessage())} was saved.`,
    toastMessage: config.shouldPublishAfterSave ? 'Saving...' : null,
    verify: (response) => {
      if (!response.pbj.has('node')) {
        return false;
      }
      const newNode = response.pbj.get('node');
      if (!newNode.has('updated_at')) {
        return false;
      }
      const node = pbj.get('new_node');
      if (node.get('etag') !== newNode.get('etag')) {
        return true;
      }
      const oldUpdatedAt = node.get('updated_at', node.get('created_at')).toNumber();
      if (oldUpdatedAt < newNode.get('updated_at').toNumber()) {
        return true;
      }
      return false;
    },
  });
}
