import { call } from 'redux-saga/effects';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import startCase from 'lodash/startCase';
import changeNodeFlow from './changeNodeFlow';

export default function* ({ config, pbj }) {
  const isScheduled = pbj.get('publish_at');

  const expectedEvent = isScheduled
    ? config.schemas.nodeScheduled.getCurie().toString()
    : config.schemas.nodePublished.getCurie().toString();

  yield call(changeNodeFlow, {
    expectedEvent,
    failureMessage: `${isScheduled ? 'Schedule' : 'Publish'} ${startCase(pbj.get('node_ref').getLabel())} failed: `,
    getNodeRequestSchema: config.schemas.getNodeRequest,
    pbj,
    successMessage: `Success! The ${startCase(pbj.get('node_ref').getLabel())} was ${isScheduled ? 'scheduled' : 'published'}.`,
    verify: (response) => {
      if (!response.pbj.has('node')) {
        return false;
      }
      return response.pbj.get('node').get('status') === isScheduled ? NodeStatus.SCHEDULED : NodeStatus.PUBLISHED;
    },
  });
}
