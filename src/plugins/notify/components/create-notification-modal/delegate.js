import AbstractDelegate
from '@triniti/cms/plugins/ncr/components/create-node-modal/AbstractDelegate';
import { formNames } from '@triniti/cms/plugins/notify/constants';
import schemas from './schemas';

class Delegate extends AbstractDelegate {
  constructor(dependencies) {
    super({
      formName: formNames.CREATE_NOTIFICATION,
      schemas,
    }, dependencies);
  }

  handleGetAllApps() {
    this.dispatch(schemas.getAllApps.createMessage());
  }
}

export { Delegate }; // to allow for site level customization
export default (dispatch, ownProps, dependencies) => new Delegate(dependencies);
