import { call } from 'redux-saga/effects';
import startCase from 'lodash/startCase';
import changeNodeFlow from './changeNodeFlow';

export default function* ({ config, pbj }) {
  const { expectedEvent } = config;

  yield call(changeNodeFlow, {
    expectedEvent,
    failureMessage: `Failed. The ${startCase(pbj.get('node_ref').getLabel())} failed to update.`,
    getNodeRequestSchema: config.schemas.getNodeRequest,
    pbj,
    successMessage: `Success! The ${startCase(pbj.get('node_ref').getLabel())} was updated.`,
    verify: (response) => {
      if (!response.pbj.has('node')) {
        return false;
      }
      const responseLabels = response.pbj.get('node').get('labels', []);

      // check if all add_labels were added
      const addLabels = pbj.get('add_labels', []);
      for (let i = 0; i < addLabels.length; i += 1) {
        if (!responseLabels.includes(addLabels[i])) {
          return false;
        }
      }

      // check if remove_labels were removed
      const removeLabels = pbj.get('remove_labels', []);
      for (let i = 0; i < removeLabels.length; i += 1) {
        if (responseLabels.includes(removeLabels[i])) {
          return false;
        }
      }

      return true;
    },
  });
}
