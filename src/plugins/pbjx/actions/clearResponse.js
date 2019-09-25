import { actionTypes } from '../constants';

/**
 * This action will set the response value to null
 * and the status' value to 'none' of a channel's slot
 * using the provided curie ( SchemaCurie ).
 *
 * @param {SchemaCurie} curie
 * @param {String} channel
 */
export default (curie, channel = 'root') => ({
  type: actionTypes.RESPONSE_CLEARED,
  channel,
  curie,
});
