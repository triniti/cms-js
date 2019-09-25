import clearChannel from '@triniti/cms/plugins/pbjx/actions/clearChannel';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort';
import { callPbjx } from '@gdbots/pbjx/redux/actions';
import { pbjxChannelNames } from './constants';
import schemas from './schemas';

export default (dispatch) => ({
  /**
   * @param {string} q - the search input value from select
   * @param {number} page - the request page
   * @param {string} linkedRef - The linked ref of the asset
   * @param {array}  types - The valid asset types
   */
  handleSearch: (q = '', page = 1, linkedRef, types) => {
    const requestData = {
      count: 150,
      linked_ref: linkedRef,
      page,
      q,
      sort: SearchAssetsSort.CREATED_AT_DESC.getValue(),
      types,
    };
    const request = schemas.searchNodesRequest.createMessage(requestData);
    dispatch(callPbjx(request, pbjxChannelNames.LINKED_IMAGES_SEARCH));
  },

  clearPbjxChannel: () => {
    dispatch(clearChannel(pbjxChannelNames.LINKED_IMAGES_SEARCH));
  },

});
