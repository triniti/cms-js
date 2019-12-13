import requestCollaborationNodes from '@triniti/cms/plugins/raven/actions/requestCollaborationNodes';

export default (dispatch) => ({
  handleRequestCollaborationNodes: (accessToken) => dispatch(requestCollaborationNodes(accessToken)),
});
