/* eslint-disable class-methods-use-this */
import TrinitiApp from '@triniti/app/App';
// import AdminUiPlugin from '@triniti/admin-ui-plugin';
// import ApolloPlugin from '@triniti/cms/plugins/apollo';
// import BlocksmithPlugin from '@triniti/cms/plugins/blocksmith';
// import BoostPlugin from '@triniti/cms/plugins/boost';
// import CanvasPlugin from '@triniti/cms/plugins/canvas';
// import CommonPlugin from '@triniti/cms/plugins/common';
// import CuratorPlugin from '@triniti/cms/plugins/curator';
// import DamPlugin from '@triniti/cms/plugins/dam';
// import IamPlugin from '@triniti/cms/plugins/iam';
// import NewsPlugin from '@triniti/cms/plugins/news';
// import NotifyPlugin from '@triniti/cms/plugins/notify';
// import OvpPlugin from '@triniti/cms/plugins/ovp';
// import PeoplePlugin from '@triniti/cms/plugins/people';
// import PbjxPlugin from '@triniti/cms/plugins/pbjx';
// import RavenPlugin from '@triniti/cms/plugins/raven';
// import SysPlugin from '@triniti/cms/plugins/sys';
// import TaxonomyPlugin from '@triniti/cms/plugins/taxonomy';
// import UtilsPlugin from '@triniti/cms/plugins/utils';
// import { serviceIds as appServiceIds } from '@triniti/app/constants';
// import { actionTypes as ravenActionTypes } from '@triniti/cms/plugins/raven/constants';
// import { configure as configureLocalization } from '@triniti/cms/plugins/utils/services/Localization';

// import DashboardPlugin from 'plugins/dashboard';
// import NcrPlugin from 'plugins/ncr';
// import localizationMap from './config/localizationMap';

export default class App extends TrinitiApp {
  constructor(preloadedState = {}) {
    super(
      [
        // new AdminUiPlugin(),
        // new ApolloPlugin(),
        // new BlocksmithPlugin(),
        // new BoostPlugin(),
        // new CanvasPlugin(),
        // new CommonPlugin(),
        // new CuratorPlugin(),
        // new DamPlugin(),
        // new DashboardPlugin(),
        // new IamPlugin(),
        // new NcrPlugin(),
        // new NewsPlugin(),
        // new NotifyPlugin(),
        // new OvpPlugin(),
        // new PeoplePlugin(),
        // new PbjxPlugin(),
        // new RavenPlugin(),
        // new SysPlugin(),
        // new TaxonomyPlugin(),
        // new UtilsPlugin(),
      ],
      preloadedState,
    );
  }

  configure(bottle) {
    // bottle.factory(appServiceIds.REDUX_LOGGER_PREDICATE, () => (getState, action) => (
    //   !action.type.startsWith(`${ravenActionTypes.PREFIX}rt`)
    //   && !action.type.startsWith(ravenActionTypes.MESSAGE_RECEIVED)
    //   && !action.type.startsWith(ravenActionTypes.PUBLISH_MESSAGE_REQUESTED)
    // ));
    //
    // configureLocalization(localizationMap);
  }
}
