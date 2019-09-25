import { callPbjx } from '@gdbots/pbjx/redux/actions';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import clearChannel from '@triniti/cms/plugins/pbjx/actions/clearChannel';

import linkAssets from '../../actions/linkAssets';
import unlinkAssets from '../../actions/unlinkAssets';
import schemas from './schemas';
import { pbjxChannelNames } from './constants';

export default (dispatch, { nodeRef }) => ({
  handleClearChannel: (channel = pbjxChannelNames.MEDIA_SEARCH) => {
    dispatch(clearChannel(channel));
  },

  search: () => {
    const message = schemas.searchNodesRequest.createMessage()
      .set('linked_ref', nodeRef)
      .set('status', NodeStatus.PUBLISHED)
      .addToSet('types', ['image-asset'])
      .set('count', 150);

    dispatch(callPbjx(message, pbjxChannelNames.MEDIA_SEARCH));
  },

  /**
   * dispatch link assets action and wait for result
   * @param assetRefs
   * @returns {Promise<any>}
   */
  handleLinkAssets: (assetRefs) => {
    const config = {
      numAssets: assetRefs.length,
      schemas,
    };

    const command = schemas.linkAssets.createMessage({
      node_ref: nodeRef,
      asset_refs: assetRefs,
    });

    return new Promise((resolve, reject) => {
      dispatch(linkAssets(command, resolve, reject, config));
    });
  },

  /**
   * dispatch unlink assets action
   * @param assetRefs
   * @returns {Promise<any>}
   */
  handleUnlinkAssets: (assetRefs) => {
    const command = schemas.unlinkAssets.createMessage({
      node_ref: nodeRef,
      asset_refs: assetRefs,
    });

    return new Promise((resolve, reject) => {
      dispatch(unlinkAssets(command, resolve, reject, { schemas }));
    });
  },
});
