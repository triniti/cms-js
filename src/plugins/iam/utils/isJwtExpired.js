import { jwtDecode as decode } from "jwt-decode"

/**
 * @param {string} jwt
 *
 * @returns {?Date}
 */
const getExpirationDate = (jwt) => {
  const decoded = decode(jwt);
  if (!decoded.exp) {
    return null;
  }

  // The 0 here is the key, which sets the date to the epoch
  const date = new Date(0);
  date.setUTCSeconds(decoded.exp);

  return date;
};

/**
 * @param {string} jwt
 *
 * @returns {boolean}
 */
export default (jwt) => {
  if (typeof jwt !== 'string' || !jwt.length) {
    return true;
  }

  const expirationDate = getExpirationDate(jwt);
  if (expirationDate === null) {
    return false;
  }

  return (new Date()).valueOf() > expirationDate.valueOf();
};
