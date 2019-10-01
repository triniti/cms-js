import AbstractDelegate from '@triniti/cms/plugins/ncr/screens/node/AbstractDelegate';

import { formNames } from '../../constants';
import schemas from './schemas';

class Delegate extends AbstractDelegate {
  constructor(dependencies) {
    super({
      schemas,
      formName: formNames.PERSON,
    }, dependencies);
  }
}

const factory = (dispatch, ownProps, dependencies) => new Delegate(dependencies);

export { Delegate }; // to allow for site level customization
export default factory;
