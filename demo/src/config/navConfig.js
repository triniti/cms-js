/* globals APP_VENDOR */
import { Video } from '../../schemas';

const navConfig = [
  {
    navType: 'item',
    navId: 'Dashboard',
    to: '/dashboard',
    redirect: {
      to: '/dashboard/news',
    },
  },
  {
    navType: 'dropdown',
    navId: 'Content',
    permission: 'cms-view-content',
    dpLinks: [
      {
        to: '/news/articles',
        linkTitle: 'Articles',
        permission: 'cms-view-articles',
      },
      {
        modal: import('../../../src/plugins/news/components/create-article-modal/Modal'),
        linkTitle: 'Create Article',
        permission: `${APP_VENDOR}:news:command:create-article`,
      },
      {
        to: '/curator/galleries',
        linkTitle: 'Galleries',
        permission: 'cms-view-galleries',
      },
      {
        to: '/canvas/pages',
        linkTitle: 'Pages',
        permission: 'cms-view-pages',
      },
      {
        to: '/apollo/polls',
        linkTitle: 'Polls',
        permission: 'cms-view-polls',
      },
      {
        to: '/ovp/videos',
        linkTitle: 'Videos',
        permission: 'cms-view-videos',
      },
    ],
  },
  {
    navType: 'dropdown',
    navId: 'Taxonomy',
    permission: 'cms-view-taxonomy',
    dpLinks: [
      {
        to: '/taxonomy/categories',
        linkTitle: 'Categories',
        permission: 'cms-view-categories',
      },
      {
        to: '/taxonomy/channels',
        linkTitle: 'Channels',
        permission: 'cms-view-channels',
      },
      {
        to: '/people/people',
        linkTitle: 'People',
        permission: 'cms-view-people',
      },
    ],
  },
  {
    navType: 'item',
    navId: 'Assets',
    permission: 'cms-view-assets',
    to: '/dam/assets',
  },
  {
    navType: 'dropdown',
    navId: 'Structure',
    permission: 'cms-view-structure',
    dpLinks: [
      {
        to: '/curator/promotions',
        linkTitle: 'Promotions',
        permission: 'cms-view-promotions',
      },
      {
        to: '/curator/teasers',
        linkTitle: 'Teasers',
        permission: 'cms-view-teasers',
      },
      {
        to: '/curator/timelines',
        linkTitle: 'Timelines',
        permission: 'cms-view-timelines',
      },
      {
        to: '/boost/sponsors',
        linkTitle: 'Sponsors',
        permission: 'cms-view-sponsors',
      },
      {
        to: '/curator/widgets',
        linkTitle: 'Widgets',
        permission: 'cms-view-widgets',
      },
    ],
  },
  {
    navType: 'item',
    navId: 'Notifications',
    permission: 'cms-view-notifications',
    to: '/notify/notifications',
  },
  {
    navType: 'dropdown',
    navId: 'Admin',
    permission: 'cms-view-admin',
    dpLinks: [
      {
        to: '/iam/users',
        linkTitle: 'Users',
        permission: 'cms-view-users',
      },
      {
        to: '/iam/roles',
        linkTitle: 'Roles',
        permission: 'cms-view-roles',
      },
      {
        to: '/iam/apps',
        linkTitle: 'Apps',
        permission: 'cms-view-apps',
      },
      {
        to: '/sys/flagsets',
        linkTitle: 'Flagsets',
        permission: 'cms-view-flagsets',
      },
      {
        to: '/sys/picklists',
        linkTitle: 'Picklists',
        permission: 'cms-view-picklists',
      },
      {
        to: '/sys/redirects',
        linkTitle: 'Redirects',
        permission: 'cms-view-redirects',
      },
    ],
  },
];

if (Video.schema().hasMixin('triniti:ovp.medialive:mixin:has-channel')) {
  navConfig[1].dpLinks.push({
    to: '/ovp/livestreams',
    linkTitle: 'Livestreams',
    permission: 'cms-view-videos',
  });
}

export default navConfig;
