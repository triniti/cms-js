import { call } from 'redux-saga/effects';
import startCase from 'lodash/startCase';
import changeNodeFlow from './changeNodeFlow';

export default function* ({ config, pbj }) {
  const isScheduled = pbj.get('publish_at');
  yield call(changeNodeFlow, {
    failureMessage: `${isScheduled ? 'Schedule' : 'Publish'} ${startCase(pbj.get('node_ref').getLabel())} failed: `,
    getNodeRequestSchema: config.schemas.getNodeRequest,
    pbj,
    successMessage: `Success! The ${startCase(pbj.get('node_ref').getLabel())} was ${isScheduled ? 'scheduled' : 'published'}.`,
  });
}
