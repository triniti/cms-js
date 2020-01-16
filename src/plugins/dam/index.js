/* eslint-disable class-methods-use-this */
import Plugin from '@triniti/app/Plugin';
import routes from './routes';
import reducer from './reducers';
import saga from './sagas';
import { serviceIds } from './constants';
import AssetSubscriber from './services/AssetSubscriber';
import PatchAssetsSubscriber from './services/PatchAssetsSubscriber';
import ImageAssetSubscriber from './services/ImageAssetSubscriber';

export default class DamPlugin extends Plugin {
  constructor() {
    super('triniti', 'dam', '0.3.4');
  }

  configure(app, bottle) {
    this.reducer = reducer;
    this.routes = routes;
    this.saga = saga;

    bottle.service(serviceIds.ASSET_SUBSCRIBER, AssetSubscriber);
    bottle.service(serviceIds.IMAGE_ASSET_SUBSCRIBER, ImageAssetSubscriber);
    bottle.service(serviceIds.PATCH_ASSETS_SUBSCRIBER, PatchAssetsSubscriber);
  }

  getSubscriberServices() {
    return [
      serviceIds.ASSET_SUBSCRIBER,
      serviceIds.IMAGE_ASSET_SUBSCRIBER,
      serviceIds.PATCH_ASSETS_SUBSCRIBER,
    ];
  }
}
