import Plugin from '@triniti/app/Plugin';
import { serviceIds } from './constants';
import AdvertisingSubscriber from './services/AdvertisingSubscriber';
import CustomCodeSubscriber from './services/CustomCodeSubscriber';
import SeoSubscriber from './services/SeoSubscriber';
import SwipeableSubscriber from './services/SwipeableSubscriber';
import TaggableSubscriber from './services/TaggableSubscriber';
import ThemeableSubscriber from './services/ThemeableSubscriber';

export default class CommonPlugin extends Plugin {
  constructor() {
    super('triniti', 'common', '0.2.15');
  }

  configure(app, bottle) {
    bottle.service(serviceIds.CUSTOM_CODE_SUBSCRIBER, CustomCodeSubscriber);
    bottle.service(serviceIds.ADVERTISING_SUBSCRIBER, AdvertisingSubscriber);
    bottle.service(serviceIds.SEO_SUBSCRIBER, SeoSubscriber);
    bottle.service(serviceIds.SWIPEABLE_SUBSCRIBER, SwipeableSubscriber);
    bottle.service(serviceIds.TAGGABLE_SUBSCRIBER, TaggableSubscriber);
    bottle.service(serviceIds.THEMEABLE_SUBSCRIBER, ThemeableSubscriber);
  }

  /**
   * @returns {string[]}
   */
  getSubscriberServices() {
    return [
      serviceIds.ADVERTISING_SUBSCRIBER,
      serviceIds.CUSTOM_CODE_SUBSCRIBER,
      serviceIds.SEO_SUBSCRIBER,
      serviceIds.SWIPEABLE_SUBSCRIBER,
      serviceIds.TAGGABLE_SUBSCRIBER,
      serviceIds.THEMEABLE_SUBSCRIBER,
    ];
  }
}
