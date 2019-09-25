import sendText from '../../actions/sendText';

export default (dispatch, ownProps) => ({
  /**
   * @param {string} text
   */
  handleSendText: (text) => {
    dispatch(sendText(text, `${ownProps.nodeRef}`));
  },
});
