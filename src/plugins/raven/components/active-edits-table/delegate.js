import updateCollaborations from '@triniti/cms/plugins/raven/actions/updateCollaborations';

export default (dispatch) => ({
  handleUpdateCollaborations: (accessToken) => dispatch(updateCollaborations(accessToken)),
});
