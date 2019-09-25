import { initialCommandState } from '../reducers/pbjx';

/**
 * Returns an object representing the state of a pbjx command.
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
    return { ...initialCommandState };
  }

  return pbjx[channel][curieStr];
};
