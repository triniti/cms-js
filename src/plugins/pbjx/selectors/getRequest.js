import { initialRequestState } from '../reducers/pbjx';

/**
 * Returns an object representing the state of a pbjx request.
 *
 * @param {Object}      state     - The entire redux state.
 * @param {SchemaCurie} curie     - A SchemaCurie instance.
 * @param {string}      [channel] - The pbjx channel (used for concurrent operations)
 *
 * @returns {Object}
 */
export default ({ pbjx }, curie, channel = 'root') => {
  const curieStr = `${curie}`;
  if (!pbjx[channel] || !pbjx[channel][curieStr]) {
    return { ...initialRequestState };
  }

  return pbjx[channel][curieStr];
};
