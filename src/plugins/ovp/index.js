/* eslint-disable class-methods-use-this */
import Plugin from '@triniti/app/Plugin';
import JwplayerHasMediaSubscriber from './services/JwplayerHasMediaSubscriber';
import KalturaEntrySubscriber from './services/KalturaEntrySubscriber';
import MediaLiveChannelSubscriber from './services/MediaLiveChannelSubscriber';
import VideoSubscriber from './services/VideoSubscriber';
import reducer from './reducers';
import routes from './routes';
import saga from './sagas';
import { serviceIds } from './constants';

export default class OvpPlugin extends Plugin {
  constructor() {
    super('triniti', 'ovp', '0.6.3');
  }

  configure(app, bottle) {
    this.reducer = reducer;
    this.routes = routes;
    this.saga = saga;

    bottle.service(serviceIds.JWPLAYER_HAS_MEDIA_SUBSCRIBER, JwplayerHasMediaSubscriber);
    bottle.service(serviceIds.KALTURA_ENTRY_SUBSCRIBER, KalturaEntrySubscriber);
    bottle.service(serviceIds.MEDIALIVE_CHANNEL_SUBSCRIBER, MediaLiveChannelSubscriber);
    bottle.service(serviceIds.VIDEO_SUBSCRIBER, VideoSubscriber);
  }

  /**
   * @returns {string[]}
   */
  getSubscriberServices() {
    return [
      serviceIds.JWPLAYER_HAS_MEDIA_SUBSCRIBER,
      serviceIds.KALTURA_ENTRY_SUBSCRIBER,
      serviceIds.MEDIALIVE_CHANNEL_SUBSCRIBER,
      serviceIds.VIDEO_SUBSCRIBER,
    ];
  }
}
