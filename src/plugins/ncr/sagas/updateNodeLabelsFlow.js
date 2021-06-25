import { call } from 'redux-saga/effects';
import startCase from 'lodash/startCase';
import changeNodeFlow from './changeNodeFlow';

export default function* ({ config, pbj }) {
  yield call(changeNodeFlow, {
    failureMessage: `Failed. The ${startCase(pbj.get('node_ref').getLabel())} failed to update.`,
    getNodeRequestSchema: config.schemas.getNodeRequest,
    pbj,
    successMessage: `Success! The ${startCase(pbj.get('node_ref').getLabel())} was updated.`,
  });
}
