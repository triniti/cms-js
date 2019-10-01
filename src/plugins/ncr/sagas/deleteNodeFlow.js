import { call, put } from 'redux-saga/effects';
import { reset } from 'redux-form';
import clearResponse from '@triniti/cms/plugins/pbjx/actions/clearResponse';
import inflection from 'inflection';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import startCase from 'lodash/startCase';
import swal from 'sweetalert2';
import changeNodeFlow from './changeNodeFlow';

function getRedirectRoot(schema) { // fixme:: need a better solution for redirect link
  const curie = schema.getCurie();

  if (schema.hasMixin('triniti:curator:mixin:teaser')) {
    return `/${curie.getPackage()}/teasers/`;
  }

  if (schema.hasMixin('triniti:notify:mixin:notification')) {
    return `/${curie.getPackage()}/notifications/`;
  }

  if (schema.hasMixin('triniti:curator:mixin:widget')) {
    return `/${curie.getPackage()}/widgets/`;
  }

  if (schema.hasMixin('gdbots:iam:mixin:app')) {
    return `/${curie.getPackage()}/apps/`;
  }

  if (schema.hasMixin('triniti:dam:mixin:asset')) {
    return `/${curie.getPackage()}/assets/`;
  }

  return `/${curie.getPackage()}/${inflection.pluralize(curie.getMessage())}/`;
}

export function* onAfterSuccessFlow({ config, history }) {
  yield put(reset(config.formName));
  yield put(clearResponse(config.schemas.searchNodes.getCurie()));
  yield call(history.replace, getRedirectRoot(config.schemas.node));
}

export function* doDelete(action) {
  const config = action.config;
  const pbj = action.pbj;
  yield call(changeNodeFlow, {
    expectedEvent: config.schemas.nodeDeleted.getCurie().toString(),
    failureMessage: `Delete ${startCase(pbj.get('node_ref').getLabel())} failed: `,
    getNodeRequestSchema: config.schemas.getNodeRequest,
    onAfterSuccessFlow: () => onAfterSuccessFlow(action),
    pbj,
    successMessage: `Success! The ${startCase(pbj.get('node_ref').getLabel())} was deleted.`,
    verify: (response) => {
      if (!response.pbj.has('node')) {
        return false;
      }
      return response.pbj.get('node').get('status') === NodeStatus.DELETED;
    },
  });
}

export default function* deleteArticleFlow(action) {
  const config = action.config;
  const result = yield call(swal, {
    allowOutsideClick: false,
    confirmButtonClass: 'btn btn-danger',
    cancelButtonClass: 'btn btn-secondary',
    confirmButtonText: 'Delete!',
    showCancelButton: true,
    text: `${startCase(config.schemas.node.getCurie().getMessage())} will be deleted!`,
    title: 'Are you sure?',
    type: 'warning',
    reverseButtons: true,
  });

  if (result.value) {
    yield call(doDelete, action);
  }
}
