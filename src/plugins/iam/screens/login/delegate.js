import requestLogin from '../../actions/requestLogin';
import requestTemporaryLogin from '../../actions/requestTemporaryLogin';

export default (dispatch) => ({
  requestLogin: () => dispatch(requestLogin()),
  requestTemporaryLogin: (accessToken) => new Promise((resolve, reject) => {
    dispatch(requestTemporaryLogin(accessToken, resolve, reject));
  }),
});
