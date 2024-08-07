import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const AppScreen = lazy(() => import('@triniti/cms/plugins/iam/components/app-screen/index.js'));
const ArticleScreen = lazy(() => import('@triniti/cms/plugins/news/components/article-screen/index.js'));
const AssetScreen = lazy(() => import('@triniti/cms/plugins/dam/components/asset-screen/index.js'));
const CategoryScreen = lazy(() => import('@triniti/cms/plugins/taxonomy/components/category-screen/index.js'));
const ChannelScreen = lazy(() => import('@triniti/cms/plugins/taxonomy/components/channel-screen/index.js'));
const DashboardScreen = lazy(() => import('../plugins/dashboard/components/dashboard-screen/index.js'));
const DemoScreen = lazy(() => import('../plugins/dashboard/components/demo-screen/index.js'));
const FlagsetScreen = lazy(() => import('@triniti/cms/plugins/sys/components/flagset-screen/index.js'));
const GalleryScreen = lazy(() => import('@triniti/cms/plugins/curator/components/gallery-screen/index.js'));
const LivestreamsScreen = lazy(() => import('@triniti/cms/plugins/ovp/components/livestreams-screen/index.js'));
const LoginScreen = lazy(() => import('@triniti/cms/plugins/iam/components/login-screen/index.js'));
const LogoutScreen = lazy(() => import('@triniti/cms/plugins/iam/components/logout-screen/index.js'));
const NotificationScreen = lazy(() => import('@triniti/cms/plugins/notify/components/notification-screen/index.js'));
const PageScreen = lazy(() => import('@triniti/cms/plugins/canvas/components/page-screen/index.js'));
const PersonScreen = lazy(() => import('@triniti/cms/plugins/people/components/person-screen/index.js'));
const PollScreen = lazy(() => import('@triniti/cms/plugins/apollo/components/poll-screen/index.js'));
const PicklistScreen = lazy(() => import('@triniti/cms/plugins/sys/components/picklist-screen/index.js'));
const PromotionScreen = lazy(() => import('@triniti/cms/plugins/curator/components/promotion-screen/index.js'));
const RedirectScreen = lazy(() => import('@triniti/cms/plugins/sys/components/redirect-screen/index.js'));
const RoleScreen = lazy(() => import('@triniti/cms/plugins/iam/components/role-screen/index.js'));
const SearchAppsScreen = lazy(() => import('@triniti/cms/plugins/iam/components/search-apps-screen/index.js'));
const SearchArticlesScreen = lazy(() => import('@triniti/cms/plugins/news/components/search-articles-screen/index.js'));
const SearchAssetsScreen = lazy(() => import('@triniti/cms/plugins/dam/components/search-assets-screen/index.js'));
const SearchCategoriesScreen = lazy(() => import('@triniti/cms/plugins/taxonomy/components/search-categories-screen/index.js'));
const SearchChannelsScreen = lazy(() => import('@triniti/cms/plugins/taxonomy/components/search-channels-screen/index.js'));
const SearchFlagsetsScreen = lazy(() => import('@triniti/cms/plugins/sys/components/search-flagsets-screen/index.js'));
const SearchGalleriesScreen = lazy(() => import('@triniti/cms/plugins/curator/components/search-galleries-screen/index.js'));
const SearchNotificationsScreen = lazy(() => import('@triniti/cms/plugins/notify/components/search-notifications-screen/index.js'));
const SearchPagesScreen = lazy(() => import('@triniti/cms/plugins/canvas/components/search-pages-screen/index.js'));
const SearchPeopleScreen = lazy(() => import('@triniti/cms/plugins/people/components/search-people-screen/index.js'));
const SearchPollsScreen = lazy(() => import('@triniti/cms/plugins/apollo/components/search-polls-screen/index.js'));
const SearchPicklistsScreen = lazy(() => import('@triniti/cms/plugins/sys/components/search-picklists-screen/index.js'));
const SearchPromotionsScreen = lazy(() => import('@triniti/cms/plugins/curator/components/search-promotions-screen/index.js'));
const SearchRedirectsScreen = lazy(() => import('@triniti/cms/plugins/sys/components/search-redirects-screen/index.js'));
const SearchRolesScreen = lazy(() => import('@triniti/cms/plugins/iam/components/search-roles-screen/index.js'));
const SearchSponsorsScreen = lazy(() => import('@triniti/cms/plugins/boost/components/search-sponsors-screen/index.js'));
const SearchTeasersScreen = lazy(() => import('@triniti/cms/plugins/curator/components/search-teasers-screen/index.js'));
const SearchTimelinesScreen = lazy(() => import('@triniti/cms/plugins/curator/components/search-timelines-screen/index.js'));
const SearchUsersScreen = lazy(() => import('@triniti/cms/plugins/iam/components/search-users-screen/index.js'));
const SearchVideosScreen = lazy(() => import('@triniti/cms/plugins/ovp/components/search-videos-screen/index.js'));
const SearchWidgetsScreen = lazy(() => import('@triniti/cms/plugins/curator/components/search-widgets-screen/index.js'));
const SponsorScreen = lazy(() => import('@triniti/cms/plugins/boost/components/sponsor-screen/index.js'));
const TeaserScreen = lazy(() => import('@triniti/cms/plugins/curator/components/teaser-screen/index.js'));
const TimelineScreen = lazy(() => import('@triniti/cms/plugins/curator/components/timeline-screen/index.js'));
const UserScreen = lazy(() => import('@triniti/cms/plugins/iam/components/user-screen/index.js'));
const VideoScreen = lazy(() => import('@triniti/cms/plugins/ovp/components/video-screen/index.js'));
const WidgetScreen = lazy(() => import('@triniti/cms/plugins/curator/components/widget-screen/index.js'));

export default () => (
  <Routes>
    <Route path="/" element={<DashboardScreen />} />
    <Route path="/active-edits" element={<DashboardScreen tab="active-edits" />} />
    <Route path="/apollo/polls" element={<SearchPollsScreen />} />
    <Route path="/boost/sponsors" element={<SearchSponsorsScreen />} />
    <Route path="/canvas/pages" element={<SearchPagesScreen />} />
    <Route path="/curator/galleries" element={<SearchGalleriesScreen />} />
    <Route path="/curator/promotions" element={<SearchPromotionsScreen />} />
    <Route path="/curator/teasers" element={<SearchTeasersScreen />} />
    <Route path="/curator/timelines" element={<SearchTimelinesScreen />} />
    <Route path="/curator/widgets" element={<SearchWidgetsScreen />} />
    <Route path="/dam/assets" element={<SearchAssetsScreen />} />
    <Route path="/demo" element={<DemoScreen />} />
    <Route path="/iam/apps" element={<SearchAppsScreen />} />
    <Route path="/iam/roles" element={<SearchRolesScreen />} />
    <Route path="/iam/users" element={<SearchUsersScreen />} />
    <Route path="/login" element={<LoginScreen />} />
    <Route path="/logout" element={<LogoutScreen />} />
    <Route path="/ncr/ad-widget/:id/*" element={<WidgetScreen label="ad-widget" />} />
    <Route path="/ncr/alert-widget/:id/*" element={<WidgetScreen label="alert-widget" />} />
    <Route path="/ncr/alexa-app/:id/*" element={<AppScreen label="alexa-app" />} />
    <Route path="/ncr/alexa-notification/:id/*" element={<NotificationScreen label="alexa-notification" />} />
    <Route path="/ncr/android-app/:id/*" element={<AppScreen label="android-app" />} />
    <Route path="/ncr/android-notification/:id/*" element={<NotificationScreen label="android-notification" />} />
    <Route path="/ncr/apple-news-app/:id/*" element={<AppScreen label="apple-news-app" />} />
    <Route path="/ncr/apple-news-notification/:id/*" element={<NotificationScreen label="apple-news-notification" />} />
    <Route path="/ncr/archive-asset/:id/*" element={<AssetScreen label="archive-asset" />} />
    <Route path="/ncr/article/:id/*" element={<ArticleScreen />} />
    <Route path="/ncr/article-teaser/:id/*" element={<TeaserScreen label="article-teaser" />} />
    <Route path="/ncr/asset-teaser/:id/*" element={<TeaserScreen label="asset-teaser" />} />
    <Route path="/ncr/audio-asset/:id/*" element={<AssetScreen label="audio-asset" />} />
    <Route path="/ncr/blogroll-widget/:id/*" element={<WidgetScreen label="blogroll-widget" />} />
    <Route path="/ncr/browser-app/:id/*" element={<AppScreen label="browser-app" />} />
    <Route path="/ncr/browser-notification/:id/*" element={<NotificationScreen label="browser-notification" />} />
    <Route path="/ncr/carousel-widget/:id/*" element={<WidgetScreen label="carousel-widget" />} />
    <Route path="/ncr/category/:id/*" element={<CategoryScreen />} />
    <Route path="/ncr/category-teaser/:id/*" element={<TeaserScreen label="category-teaser" />} />
    <Route path="/ncr/channel/:id/*" element={<ChannelScreen />} />
    <Route path="/ncr/channel-teaser/:id/*" element={<TeaserScreen label="channel-teaser" />} />
    <Route path="/ncr/code-asset/:id/*" element={<AssetScreen label="code-asset" />} />
    <Route path="/ncr/code-widget/:id/*" element={<WidgetScreen label="code-widget" />} />
    <Route path="/ncr/document-asset/:id/*" element={<AssetScreen label="document-asset" />} />
    <Route path="/ncr/email-app/:id/*" element={<AppScreen label="email-app" />} />
    <Route path="/ncr/email-notification/:id/*" element={<NotificationScreen label="email-notification" />} />
    <Route path="/ncr/flagset/:id/*" element={<FlagsetScreen />} />
    <Route path="/ncr/gallery/:id/*" element={<GalleryScreen />} />
    <Route path="/ncr/gallery-teaser/:id/*" element={<TeaserScreen label="gallery-teaser" />} />
    <Route path="/ncr/gallery-widget/:id/*" element={<WidgetScreen label="gallery-widget" />} />
    <Route path="/ncr/gridler-widget/:id/*" element={<WidgetScreen label="gridler-widget" />} />
    <Route path="/ncr/hero-bar-widget/:id/*" element={<WidgetScreen label="hero-bar-widget" />} />
    <Route path="/ncr/image-asset/:id/*" element={<AssetScreen label="image-asset" />} />
    <Route path="/ncr/ios-app/:id/*" element={<AppScreen label="ios-app" />} />
    <Route path="/ncr/ios-notification/:id/*" element={<NotificationScreen label="ios-notification" />} />
    <Route path="/ncr/link-teaser/:id/*" element={<TeaserScreen label="link-teaser" />} />
    <Route path="/ncr/media-list-widget/:id/*" element={<WidgetScreen label="media-list-widget" />} />
    <Route path="/ncr/page/:id/*" element={<PageScreen />} />
    <Route path="/ncr/page-teaser/:id/*" element={<TeaserScreen label="page-teaser" />} />
    <Route path="/ncr/person/:id/*" element={<PersonScreen />} />
    <Route path="/ncr/person-teaser/:id/*" element={<TeaserScreen label="person-teaser" />} />
    <Route path="/ncr/poll/:id/*" element={<PollScreen />} />
    <Route path="/ncr/picklist/:id/*" element={<PicklistScreen />} />
    <Route path="/ncr/playlist-widget/:id/*" element={<WidgetScreen label="playlist-widget" />} />
    <Route path="/ncr/poll-teaser/:id/*" element={<TeaserScreen label="poll-teaser" />} />
    <Route path="/ncr/promotion/:id/*" element={<PromotionScreen />} />
    <Route path="/ncr/redirect/:id/*" element={<RedirectScreen />} />
    <Route path="/ncr/role/:id/*" element={<RoleScreen />} />
    <Route path="/ncr/showtimes-widget/:id/*" element={<WidgetScreen label="showtimes-widget" />} />
    <Route path="/ncr/slack-app/:id/*" element={<AppScreen label="slack-app" />} />
    <Route path="/ncr/slack-notification/:id/*" element={<NotificationScreen label="slack-notification" />} />
    <Route path="/ncr/slider-widget/:id/*" element={<WidgetScreen label="slider-widget" />} />
    <Route path="/ncr/sms-app/:id/*" element={<AppScreen label="sms-app" />} />
    <Route path="/ncr/sms-notification/:id/*" element={<NotificationScreen label="sms-notification" />} />
    <Route path="/ncr/sponsor/:id/*" element={<SponsorScreen />} />
    <Route path="/ncr/spotlight-widget/:id/*" element={<WidgetScreen label="spotlight-widget" />} />
    <Route path="/ncr/tag-cloud-widget/:id/*" element={<WidgetScreen label="tag-cloud-widget" />} />
    <Route path="/ncr/tetris-widget/:id/*" element={<WidgetScreen label="tetris-widget" />} />
    <Route path="/ncr/timeline/:id/*" element={<TimelineScreen />} />
    <Route path="/ncr/timeline-teaser/:id/*" element={<TeaserScreen label="timeline-teaser" />} />
    <Route path="/ncr/twitter-app/:id/*" element={<AppScreen label="twitter-app" />} />
    <Route path="/ncr/twitter-notification/:id/*" element={<NotificationScreen label="twitter-notification" />} />
    <Route path="/ncr/unknown-asset/:id/*" element={<AssetScreen label="unknown-asset" />} />
    <Route path="/ncr/user/:id/*" element={<UserScreen />} />
    <Route path="/ncr/video/:id/*" element={<VideoScreen />} />
    <Route path="/ncr/video-asset/:id/*" element={<AssetScreen label="video-asset" />} />
    <Route path="/ncr/video-teaser/:id/*" element={<TeaserScreen label="video-teaser" />} />
    <Route path="/ncr/youtube-video-teaser/:id/*" element={<TeaserScreen label="youtube-video-teaser" />} />
    <Route path="/news/articles" element={<SearchArticlesScreen />} />
    <Route path="/notify/notifications" element={<SearchNotificationsScreen />} />
    <Route path="/ovp/livestreams" element={<LivestreamsScreen />} />
    <Route path="/ovp/videos" element={<SearchVideosScreen />} />
    <Route path="/people/people" element={<SearchPeopleScreen />} />
    <Route path="/sys/flagsets" element={<SearchFlagsetsScreen />} />
    <Route path="/sys/picklists" element={<SearchPicklistsScreen />} />
    <Route path="/sys/redirects" element={<SearchRedirectsScreen />} />
    <Route path="/taxonomy/categories" element={<SearchCategoriesScreen />} />
    <Route path="/taxonomy/channels" element={<SearchChannelsScreen />} />
  </Routes>
);
