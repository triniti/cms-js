import AbstractDelegate from '@triniti/cms/plugins/ncr/components/create-node-modal/AbstractDelegate';
import { formNames } from '../../constants';
import schemas from './schemas';

class Delegate extends AbstractDelegate {
  constructor(dependencies) {
    super({
      schemas,
      formName: formNames.CREATE_USER,
    }, dependencies);
  }
}

export { Delegate }; // to allow for site level customization
export default (dispatch, ownProps, dependencies) => new Delegate(dependencies);
