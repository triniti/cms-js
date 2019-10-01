import { INJECT } from '@triniti/app/constants';
import AbstractDelegate from '@triniti/cms/plugins/ncr/screens/node/AbstractDelegate';
import { formNames, serviceIds } from '../../constants';
import schemas from './schemas';

class Delegate extends AbstractDelegate {
  constructor(dependencies) {
    super({
      schemas,
      formName: formNames.PAGE,
    }, dependencies);

    this.layouts = dependencies.layouts;
  }

  getPageLayouts() {
    return this.layouts;
  }
}

const factory = (dispatch, ownProps, dependencies) => new Delegate(dependencies);
factory[INJECT] = {
  [serviceIds.LAYOUTS]: 'layouts',
};

export { Delegate }; // to allow for site level customization
export default factory;
