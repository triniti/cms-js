import AbstractDelegate from '@triniti/cms/plugins/ncr/screens/node/AbstractDelegate';
import schemas from './schemas';
import { formNames } from '../../constants';

class Delegate extends AbstractDelegate {
  constructor(dependencies) {
    super({
      schemas,
      formName: formNames.TEASER,
    }, dependencies);
  }
}

export { Delegate }; // to allow for site level customization
export default (dispatch, ownProps, dependencies) => new Delegate(dependencies);
