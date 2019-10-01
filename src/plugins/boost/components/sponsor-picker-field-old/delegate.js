import { callPbjx } from '@gdbots/pbjx/redux/actions';
import SearchSponsorsSort from '@triniti/schemas/triniti/boost/enums/SearchSponsorsSort';
import schemas from './schemas';

export default (dispatch) => ({
  /**
   * @param {string} q - the search input value from select
   */
  handleSearch: (q = '') => {
    const requestData = {
      q,
      sort: SearchSponsorsSort.RELEVANCE,
    };

    const request = schemas.searchSponsors.createMessage(requestData);
    return dispatch(callPbjx(request, 'sponsor-picker'));
  },
});
