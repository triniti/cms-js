import PollV1Mixin from '@triniti/schemas/triniti/apollo/mixin/poll/PollV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  getPollNodeRequest: resolveSchema(PollV1Mixin, 'request', 'get-poll-request'),
};
