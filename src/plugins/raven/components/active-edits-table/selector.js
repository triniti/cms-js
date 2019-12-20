import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken';
import getCollaborationNodes from '@triniti/cms/plugins/raven/selectors/getCollaborationNodes';

export default (state) => ({
  accessToken: getAccessToken(state),
  collaborationNodes: getCollaborationNodes(state),
});
