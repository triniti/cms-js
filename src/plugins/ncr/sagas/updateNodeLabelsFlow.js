import { call } from 'redux-saga/effects';
import some from 'lodash/some';
import includes from 'lodash/includes';
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
      const responseLabels = response.pbj.get('node').get('labels', []).sort();

      // check if add_labels was added
      const addLabels = pbj.get('add_labels', []);
      if (addLabels.length && !some(addLabels, (label) => includes(responseLabels, label))) {
        return false;
      }

      // check if remove_labels were removed
      const removeLabels = pbj.get('remove_labels', []);
      if (removeLabels.length && some(pbj.get('remove_labels', []), (label) => includes(responseLabels, label))) {
        return false;
      }

      return true;
    },
  });
}
