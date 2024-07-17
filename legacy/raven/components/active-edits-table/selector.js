import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken.js';
import getCollaborationNodes from '@triniti/cms/plugins/raven/selectors/getCollaborationNodes.js';

export default (state) => ({
  accessToken: getAccessToken(state),
  collaborationNodes: getCollaborationNodes(state).sort((a, b) => (a.schema().getCurie().getMessage() > b.schema().getCurie().getMessage() ? 1 : -1)),
});
