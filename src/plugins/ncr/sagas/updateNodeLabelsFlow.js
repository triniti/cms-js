import { call } from 'redux-saga/effects';
import isEqual from 'lodash/isEqual';
import startCase from 'lodash/startCase';
import changeNodeFlow from './changeNodeFlow';

export default function* ({ config, pbj }) {
  const expectedEvent = config.schemas.nodeUpdated.getCurie().toString();

  yield call(changeNodeFlow, {
    expectedEvent,
    failureMessage: `Labels ${startCase(pbj.get('node_ref').getLabel())} failed: `,
    getNodeRequestSchema: config.schemas.getNodeRequest,
    pbj,
    successMessage: `Success! The ${startCase(pbj.get('node_ref').getLabel())} was updated.`,
    verify: (response) => {
      if (!response.pbj.has('node')) {
        return false;
      }
      const responseLabels = response.pbj.get('node').get('labels', []).sort();
      const pbjLabels = pbj.get('node').get('labels', []).sort();
      return isEqual(responseLabels, pbjLabels);
    },
  });
}
