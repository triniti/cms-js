import { call, put } from 'redux-saga/effects';
import { reset, SubmissionError } from 'redux-form';
import clearResponse from '@triniti/cms/plugins/pbjx/actions/clearResponse';
import destroyEditor from '@triniti/cms/plugins/blocksmith/actions/destroyEditor';
import startCase from 'lodash/startCase';
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
}

export function* onAfterFailureFlow({ reject }, error) {
  const message = typeof error.getMessage === 'function' ? error.getMessage() : error.message;
  yield call(reject, new SubmissionError({ _error: message }));
}

export function* publishAfterUpdateFlow(action) {
  const config = action.config;
  const match = action.match;
  const pbj = action.pbj;
  const nodeSchema = config.schemas.node
    || config.schemas.nodes.find((node) => node.getCurie().getMessage() === match.params.type);

  yield call(changeNodeFlow, {
    failureMessage: `Publish ${startCase(nodeSchema.getCurie().getMessage())} failed: `,
    getNodeRequestSchema: config.schemas.getNodeRequest,
    onAfterFailureFlow: (error) => onAfterFailureFlow(action, error),
    onAfterSuccessFlow: () => onAfterSuccessFlow(action),
    pbj: config.schemas.publishNode.createMessage({ node_ref: pbj.get('node_ref') }),
    successMessage: `Success! The ${startCase(nodeSchema.getCurie().getMessage())} was saved and published.`,
    toastMessage: 'Publishing...',
  });
}

export default function* (action) {
  const config = action.config;
  const match = action.match;
  const pbj = action.pbj;
  const nodeSchema = config.schemas.node
    || config.schemas.nodes.find((node) => node.getCurie().getMessage() === match.params.type);
  yield call(changeNodeFlow, {
    failureMessage: `Save ${startCase(nodeSchema.getCurie().getMessage())} failed: `,
    getNodeRequestSchema: config.schemas.getNodeRequest,
    onAfterFailureFlow: (error) => onAfterFailureFlow(action, error),
    onAfterSuccessFlow: () => onAfterSuccessFlow(action),
    onContinueFlow: config.shouldPublishAfterSave ? () => publishAfterUpdateFlow(action) : null,
    pbj,
    successMessage: `Success! The ${startCase(nodeSchema.getCurie().getMessage())} was saved.`,
    toastMessage: config.shouldPublishAfterSave ? 'Saving...' : null,
  });
}
