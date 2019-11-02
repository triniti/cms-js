import { callPbjx } from '@gdbots/pbjx/redux/actions';
import clearChannel from '@triniti/cms/plugins/pbjx/actions/clearChannel';
import debounce from 'lodash/debounce';

export default (dispatch, { constants, schemas }) => ({
  handleClearChannel() {
    dispatch(clearChannel(constants.CHANNEL_NAME));
  },

  handleGetAll() {
    const request = schemas.getAll.createMessage();
    dispatch(callPbjx(request, constants.CHANNEL_NAME));
  },

  /**
   * @param {string} q    - the search input value from select
   * @param {number} page - the request page
   */
  handleSearch: debounce((q = '', page = 1) => {
    const requestData = {
      count: 25,
      page,
      q,
    };

    if (schemas.searchNodesSort) {
      requestData.sort = schemas.searchNodesSort;
    }

    if (schemas.searchNodesStatus) {
      requestData.status = schemas.searchNodesStatus;
    }

    const request = schemas.searchNodes.createMessage(requestData);
    dispatch(callPbjx(request, constants.CHANNEL_NAME));
  }, 500),
});
