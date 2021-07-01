import { call } from 'redux-saga/effects';
import startCase from 'lodash/startCase';
import changeNodeFlow from './changeNodeFlow';

export default function* ({ config, pbj }) {
  yield call(changeNodeFlow, {
    failureMessage: `Unpublish ${startCase(pbj.get('node_ref').getLabel())} failed: `,
    getNodeRequestSchema: config.schemas.getNodeRequest,
    pbj,
    successMessage: `Success! The ${startCase(pbj.get('node_ref').getLabel())} was unpublished.`,
  });
}
