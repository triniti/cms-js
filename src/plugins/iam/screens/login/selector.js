import { ACCESS_TOKEN_STORAGE_KEY } from '@gdbots/pbjx/constants';
import isJwtExpired from '../../utils/isJwtExpired';
import isAuthenticated from '../../selectors/isAuthenticated';

export default (state) => ({
  isAuthenticated: !isJwtExpired(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY))
  && isAuthenticated(state),
});
