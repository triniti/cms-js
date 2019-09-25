import joinCollaboration from '../../actions/joinCollaboration';
import leaveCollaboration from '../../actions/leaveCollaboration';

export default (dispatch) => ({
  handleContinueInEditMode: (nodeRef) => {
    dispatch(joinCollaboration(nodeRef));
  },

  handleContinueInViewMode: (nodeRef) => {
    dispatch(leaveCollaboration(nodeRef));
  },
});
