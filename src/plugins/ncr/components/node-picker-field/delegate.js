import { callPbjx } from '@gdbots/pbjx/redux/actions';
import clearChannel from '@triniti/cms/plugins/pbjx/actions/clearChannel';
import debounce from 'lodash/debounce';

let fns = {};
const clearDelegateCache = () => { fns = {}; };
export default (dispatch, { constants, schemas }) => {
  if (!fns[`handleClearChannel${constants.CHANNEL_NAME}`]) {
    fns[`handleClearChannel${constants.CHANNEL_NAME}`] = () => {
      dispatch(clearChannel(constants.CHANNEL_NAME));
    };
  }
  if (!fns[`handleGetAll${constants.CHANNEL_NAME}`]) {
    fns[`handleGetAll${constants.CHANNEL_NAME}`] = () => {
      const request = schemas.getAll.createMessage();
      dispatch(callPbjx(request, constants.CHANNEL_NAME));
    };
  }
  if (!fns[`handleSearch${constants.CHANNEL_NAME}`]) {
    fns[`handleSearch${constants.CHANNEL_NAME}`] = debounce((q = '', page = 1) => {
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
    }, 500);
  }
  return {
    clearDelegateCache,
    handleClearChannel: fns[`handleClearChannel${constants.CHANNEL_NAME}`],
    handleGetAll: fns[`handleGetAll${constants.CHANNEL_NAME}`],
    handleSearch: fns[`handleSearch${constants.CHANNEL_NAME}`],
  };
};
