import { call } from 'redux-saga/effects';
import startCase from 'lodash/startCase';
import changeNodeFlow from './changeNodeFlow';

export default function* ({ config, pbj }) {
  yield call(changeNodeFlow, {
    expectedEvent: config.schemas.nodeUnlocked.getCurie().toString(),
    failureMessage: `Unlock ${startCase(pbj.get('node_ref').getLabel())} failed: `,
    getNodeRequestSchema: config.schemas.getNodeRequest,
    pbj,
    successMessage: `Success! The ${startCase(pbj.get('node_ref').getLabel())} was unlocked.`,
    verify: (response) => {
      if (!response.pbj.has('node')) {
        return false;
      }
      return !response.pbj.get('node').get('is_locked');
    },
  });
}
