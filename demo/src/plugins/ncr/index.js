import Plugin from '@triniti/cms/plugins/ncr';
import { serviceIds } from '@triniti/cms/plugins/ncr/constants';
import { formNames as curatorFormNames } from '@triniti/cms/plugins/curator/constants';
import { formNames as newsFormNames } from '@triniti/cms/plugins/news/constants';

export default class NcrPlugin extends Plugin {
  configure(app, bottle) {
    super.configure(app, bottle);

    bottle.decorator(
      serviceIds.SLUGGABLE_FORMS,
      (obj) => Object.assign(obj, {
        [curatorFormNames.GALLERY]: true,
        [curatorFormNames.CREATE_GALLERY]: true,
        [newsFormNames.ARTICLE]: true,
        [newsFormNames.CREATE_ARTICLE]: true,
      }),
    );
  }
}
