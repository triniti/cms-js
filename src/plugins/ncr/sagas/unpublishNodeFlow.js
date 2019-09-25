import { call } from 'redux-saga/effects';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import startCase from 'lodash/startCase';
import changeNodeFlow from './changeNodeFlow';

export default function* ({ config, pbj }) {
  yield call(changeNodeFlow, {
    expectedEvent: config.schemas.nodeUnpublished.getCurie().toString(),
    failureMessage: `Unpublish ${startCase(pbj.get('node_ref').getLabel())} failed: `,
    getNodeRequestSchema: config.schemas.getNodeRequest,
    pbj,
    successMessage: `Success! The ${startCase(pbj.get('node_ref').getLabel())} was unpublished.`,
    verify: (response) => {
      if (!response.pbj.has('node')) {
        return false;
      }
      return response.pbj.get('node').get('status') === NodeStatus.DRAFT;
    },
  });
}
