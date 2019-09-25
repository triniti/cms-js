import AssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/asset/AssetV1Mixin';
import { routeIds } from './constants';

const assetTypePattern = AssetV1Mixin.findAll().map((schema) => schema.getCurie().getMessage()).join('|');

export default {

  [routeIds.ASSET]: {
    path: `/dam/assets/:type(${assetTypePattern})/:node_id([a-z]+_[a-z0-9]{3,4}_[0-9]{8}_[a-zA-Z0-9]{32})/:tab(details|taxonomy|variants|history|raw)?/:mode(edit)?`,
    component: import('./screens/asset'),
  },

  [routeIds.SEARCH_ASSETS]: {
    path: '/dam/assets',
    component: import('./screens/search-assets'),
  },

  [routeIds.INDEX]: {
    path: '/dam',
    redirect: {
      to: '/dam/assets',
    },
  },
};
