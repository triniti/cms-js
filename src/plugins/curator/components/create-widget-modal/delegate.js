import AbstractDelegate from '@triniti/cms/plugins/ncr/components/create-node-modal/AbstractDelegate';
import { formNames } from '../../constants';
import schemas from './schemas';

class Delegate extends AbstractDelegate {
  constructor(dependencies) {
    super({
      formName: formNames.CREATE_WIDGET,
      schemas,
    }, dependencies);
  }
}

export { Delegate }; // to allow for site level customization
export default (dispatch, ownProps, dependencies) => new Delegate(dependencies);
