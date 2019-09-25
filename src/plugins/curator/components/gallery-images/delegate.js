import ImageAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/image-asset/ImageAssetV1Mixin';
import clearChannel from '@triniti/cms/plugins/pbjx/actions/clearChannel';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort';
import { callPbjx } from '@gdbots/pbjx/redux/actions';
import schemas from './schemas';
import { pbjxChannelNames } from '../../constants';

export default (dispatch) => ({
  /**
   * @param {NodeRef} nodeRef - A node ref to a gallery that an asset must be in
   * @param {string} q
   * @param {number} page
   */
  handleSearch: (nodeRef, q = '', page = 1) => {
    const message = schemas.searchNodesRequest.createMessage({
      count: 150,
      gallery_ref: nodeRef,
      page,
      q,
      sort: SearchAssetsSort.CREATED_AT_DESC.getValue(),
      types: [ImageAssetV1Mixin.findOne().getCurie().getMessage()],
    });

    dispatch(callPbjx(message, pbjxChannelNames.GALLERY_MEDIA_SEARCH));
  },

  handleClearChannel: () => {
    dispatch(clearChannel(pbjxChannelNames.GALLERY_MEDIA_SEARCH));
  },

});
