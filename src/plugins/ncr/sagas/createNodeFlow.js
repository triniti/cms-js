import { call, put } from 'redux-saga/effects';
import { reset, SubmissionError } from 'redux-form';
import clearResponse from '@triniti/cms/plugins/pbjx/actions/clearResponse';
import destroyEditor from '@triniti/cms/plugins/blocksmith/actions/destroyEditor';
import inflection from 'inflection';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import startCase from 'lodash/startCase';
import changeNodeFlow from './changeNodeFlow';

function getRedirectRoot(schema) { // fixme:: need a better solution for redirect link
  const curie = schema.getCurie();

  if (schema.hasMixin('triniti:curator:mixin:teaser')) {
    return `/${curie.getPackage()}/teasers/${curie.getMessage()}/`;
  }

  if (schema.hasMixin('gdbots:iam:mixin:app')) {
    return `/${curie.getPackage()}/apps/${curie.getMessage()}/`;
  }

  if (schema.hasMixin('triniti:curator:mixin:widget')) {
    return `/${curie.getPackage()}/widgets/${curie.getMessage()}/`;
  }

  if (schema.hasMixin('triniti:notify:mixin:notification')) {
    return `/${curie.getPackage()}/notifications/${curie.getMessage()}/`;
  }

  return `/${curie.getPackage()}/${inflection.pluralize(curie.getMessage())}/`;
}

export function* onAfterSuccessFlow({ config, history, pbj, resolve }) {
  yield call(resolve);
  yield put(reset(config.formName));
  yield put(destroyEditor(config.updateFormName));
  yield put(clearResponse(config.schemas.searchNodes.getCurie())); // not sure this is necessary
  const id = NodeRef.fromNode(pbj.get('node')).getId().toString();
  const url = `${getRedirectRoot(config.schemas.node)}${id}/edit`;
  yield call(history.push, url);
  yield put(clearResponse(config.schemas.getNodeRequest.getCurie())); // not sure this is necessary
}

export function* onAfterFailureFlow({ reject }, error) {
  const message = typeof error.getMessage === 'function' ? error.getMessage() : error.message;
  yield call(reject, new SubmissionError({ _error: message }));
}

export default function* (action) {
  const config = action.config;
  const pbj = action.pbj;
  yield call(changeNodeFlow, {
    expectedEvent: config.schemas.nodeCreated.getCurie().toString(),
    failureMessage: `Create ${startCase(NodeRef.fromNode(pbj.get('node')).getLabel())} failed: `,
    getNodeRequestSchema: config.schemas.getNodeRequest,
    onAfterFailureFlow: (error) => onAfterFailureFlow(action, error),
    onAfterSuccessFlow: () => onAfterSuccessFlow(action),
    pbj,
    successMessage: `Success! The ${startCase(NodeRef.fromNode(pbj.get('node')).getLabel())} was created.`,
    verify: (response) => response.pbj.has('node'),
  });
}
