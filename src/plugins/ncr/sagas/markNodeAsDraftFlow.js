import { call } from 'redux-saga/effects';
import startCase from 'lodash/startCase';
import changeNodeFlow from './changeNodeFlow';

export default function* ({ config, pbj }) {
  yield call(changeNodeFlow, {
    failureMessage: `Mark ${startCase(pbj.get('node_ref').getLabel())} as draft failed: `,
    getNodeRequestSchema: config.schemas.getNodeRequest,
    pbj,
    successMessage: `Success! The ${startCase(pbj.get('node_ref').getLabel())} was marked as draft.`,
  });
}
