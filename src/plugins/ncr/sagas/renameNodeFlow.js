import { call, put } from 'redux-saga/effects';
import clearResponse from '@triniti/cms/plugins/pbjx/actions/clearResponse';
import startCase from 'lodash/startCase';
import changeNodeFlow from './changeNodeFlow';

export function* onAfterSuccessFlow(config) {
  const schema = config.schemas.searchNodes || config.schemas.getAllNodesRequest;
  yield put(clearResponse(schema.getCurie()));
}

export default function* ({ config, pbj }) {
  yield call(changeNodeFlow, {
    failureMessage: `Rename ${startCase(pbj.get('node_ref').getLabel())} slug failed: `,
    getNodeRequestSchema: config.schemas.getNodeRequest,
    onAfterSuccessFlow: () => onAfterSuccessFlow(config),
    pbj,
    successMessage: `Success! The ${startCase(pbj.get('node_ref').getLabel())}'s slug was renamed.`,
  });
}
