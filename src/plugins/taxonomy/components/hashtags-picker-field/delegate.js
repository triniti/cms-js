import debounce from 'lodash/debounce';
import { callPbjx } from '@gdbots/pbjx/redux/actions';
import schemas from './schemas';

export default (dispatch) => {
  /**
   * Handler for auto-suggesting matched hashtags already created from the server.
   * @param {String} prefix
   */
  const handleSuggestHashtags = (prefix) => {
    const request = schemas.suggestHashtags.createMessage({ prefix });
    dispatch(callPbjx(request));
  };
  return {
    handleSuggestHashtags: debounce(handleSuggestHashtags, 500),
  };
};
