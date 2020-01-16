import Plugin from '@triniti/app/Plugin';

import ExpirableSubscriber from '@triniti/cms/plugins/ncr/services/ExpirableSubscriber';
import SeoSubscriber from '@triniti/cms/plugins/common/services/SeoSubscriber';
import AdWidgetSubscriber from './services/AdWidgetSubscriber';
import AlertWidgetSubscriber from './services/AlertWidgetSubscriber';
import ArticleTeaserSubscriber from './services/ArticleTeaserSubscriber';
import AssetTeaserSubscriber from './services/AssetTeaserSubscriber';
import BlogrollWidgetSubscriber from './services/BlogrollWidgetSubscriber';
import CarouselWidgetSubscriber from './services/CarouselWidgetSubscriber';
import CategoryTeaserSubscriber from './services/CategoryTeaserSubscriber';
import ChannelTeaserSubscriber from './services/ChannelTeaserSubscriber';
import CodeWidgetSubscriber from './services/CodeWidgetSubscriber';
import GallerySubscriber from './services/GallerySubscriber';
import GalleryTeaserSubscriber from './services/GalleryTeaserSubscriber';
import LinkTeaserSubscriber from './services/LinkTeaserSubscriber';
import PageTeaserSubscriber from './services/PageTeaserSubscriber';
import PersonTeaserSubscriber from './services/PersonTeaserSubscriber';
import PollTeaserSubscriber from './services/PollTeaserSubscriber';
import PromotionSubscriber from './services/PromotionSubscriber';
import ShowtimesWidgetSubscriber from './services/ShowtimesWidgetSubscriber';
import TeaserableSubscriber from './services/TeaserableSubscriber';
import TeaserSubscriber from './services/TeaserSubscriber';
import TetrisWidgetSubscriber from './services/TetrisWidgetSubscriber';
import TimelineSubscriber from './services/TimelineSubscriber';
import TimelineTeaserSubscriber from './services/TimelineTeaserSubscriber';
import VideoTeaserSubscriber from './services/VideoTeaserSubscriber';
import WidgetHasSearchRequestSubscriber from './services/WidgetHasSearchRequestSubscriber';
import WidgetSubscriber from './services/WidgetSubscriber';
import YoutubeVideoTeaserSubscriber from './services/YoutubeVideoTeaserSubscriber';

import { serviceIds } from './constants';
import routes from './routes';

export default class CuratorPlugin extends Plugin {
  constructor() {
    super('triniti', 'curator', '0.3.4');
  }

  configure(app, bottle) {
    this.routes = routes;

    bottle.service(serviceIds.AD_WIDGET_SUBSCRIBER, AdWidgetSubscriber);
    bottle.service(serviceIds.ALERT_WIDGET_SUBSCRIBER, AlertWidgetSubscriber);
    bottle.service(serviceIds.ARTICLE_TEASER_SUBSCRIBER, ArticleTeaserSubscriber);
    bottle.service(serviceIds.ASSET_TEASER_SUBSCRIBER, AssetTeaserSubscriber);
    bottle.service(serviceIds.BLOGROLL_WIDGET_SUBSCRIBER, BlogrollWidgetSubscriber);
    bottle.service(serviceIds.CAROUSEL_WIDGET_SUBSCRIBER, CarouselWidgetSubscriber);
    bottle.service(serviceIds.CATEGORY_TEASER_SUBSCRIBER, CategoryTeaserSubscriber);
    bottle.service(serviceIds.CHANNEL_TEASER_SUBSCRIBER, ChannelTeaserSubscriber);
    bottle.service(serviceIds.CODE_WIDGET_SUBSCRIBER, CodeWidgetSubscriber);
    bottle.service(serviceIds.EXPIRABLE_SUBSCRIBER, ExpirableSubscriber);
    bottle.service(serviceIds.GALLERY_SUBSCRIBER, GallerySubscriber);
    bottle.service(serviceIds.GALLERY_TEASER_SUBSCRIBER, GalleryTeaserSubscriber);
    bottle.service(serviceIds.LINK_TEASER_SUBSCRIBER, LinkTeaserSubscriber);
    bottle.service(serviceIds.PAGE_TEASER_SUBSCRIBER, PageTeaserSubscriber);
    bottle.service(serviceIds.PERSON_TEASER_SUBSCRIBER, PersonTeaserSubscriber);
    bottle.service(serviceIds.POLL_TEASER_SUBSCRIBER, PollTeaserSubscriber);
    bottle.service(serviceIds.PROMOTION_SUBSCRIBER, PromotionSubscriber);
    bottle.service(serviceIds.SEO_SUBSCRIBER, SeoSubscriber);
    bottle.service(serviceIds.SHOWTIMES_WIDGET_SUBSCRIBER, ShowtimesWidgetSubscriber);
    bottle.service(serviceIds.TEASER_SUBSCRIBER, TeaserSubscriber);
    bottle.service(serviceIds.TEASERABLE_SUBSCRIBER, TeaserableSubscriber);
    bottle.service(serviceIds.TETRIS_WIDGET_SUBSCRIBER, TetrisWidgetSubscriber);
    bottle.service(serviceIds.TIMELINE_SUBSCRIBER, TimelineSubscriber);
    bottle.service(serviceIds.TIMELINE_TEASER_SUBSCRIBER, TimelineTeaserSubscriber);
    bottle.service(serviceIds.VIDEO_TEASER_SUBSCRIBER, VideoTeaserSubscriber);
    bottle.service(serviceIds.WIDGET_HAS_SEARCH_REQUEST_SUBSCRIBER,
      WidgetHasSearchRequestSubscriber);
    bottle.service(serviceIds.WIDGET_SUBSCRIBER, WidgetSubscriber);
    bottle.service(serviceIds.YOUTUBE_VIDEO_TEASER_SUBSCRIBER, YoutubeVideoTeaserSubscriber);
  }

  /**
   * @returns {string[]}
   */
  getSubscriberServices() {
    return [
      serviceIds.AD_WIDGET_SUBSCRIBER,
      serviceIds.ALERT_WIDGET_SUBSCRIBER,
      serviceIds.ARTICLE_TEASER_SUBSCRIBER,
      serviceIds.ASSET_TEASER_SUBSCRIBER,
      serviceIds.BLOGROLL_WIDGET_SUBSCRIBER,
      serviceIds.CAROUSEL_WIDGET_SUBSCRIBER,
      serviceIds.CATEGORY_TEASER_SUBSCRIBER,
      serviceIds.CHANNEL_TEASER_SUBSCRIBER,
      serviceIds.CODE_WIDGET_SUBSCRIBER,
      serviceIds.EXPIRABLE_SUBSCRIBER,
      serviceIds.GALLERY_SUBSCRIBER,
      serviceIds.GALLERY_TEASER_SUBSCRIBER,
      serviceIds.LINK_TEASER_SUBSCRIBER,
      serviceIds.PAGE_TEASER_SUBSCRIBER,
      serviceIds.PERSON_TEASER_SUBSCRIBER,
      serviceIds.POLL_TEASER_SUBSCRIBER,
      serviceIds.PROMOTION_SUBSCRIBER,
      serviceIds.SEO_SUBSCRIBER,
      serviceIds.SHOWTIMES_WIDGET_SUBSCRIBER,
      serviceIds.TEASER_SUBSCRIBER,
      serviceIds.TEASERABLE_SUBSCRIBER,
      serviceIds.TETRIS_WIDGET_SUBSCRIBER,
      serviceIds.TIMELINE_SUBSCRIBER,
      serviceIds.TIMELINE_TEASER_SUBSCRIBER,
      serviceIds.VIDEO_TEASER_SUBSCRIBER,
      serviceIds.WIDGET_HAS_SEARCH_REQUEST_SUBSCRIBER,
      serviceIds.WIDGET_SUBSCRIBER,
      serviceIds.YOUTUBE_VIDEO_TEASER_SUBSCRIBER,
    ];
  }
}
