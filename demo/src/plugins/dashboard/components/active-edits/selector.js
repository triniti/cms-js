import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken';
import getCollaborationNodes from '@triniti/cms/plugins/raven/selectors/getCollaborationNodes';

export default (state) => {
  const accessToken = getAccessToken(state);
  const collaborationNodes = getCollaborationNodes(state).filter((node) => !!node);

  return {
    accessToken,
    collaborationNodes,
  };
};
