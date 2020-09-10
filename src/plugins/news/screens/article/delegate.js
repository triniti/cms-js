import AbstractDelegate from '@triniti/cms/plugins/ncr/screens/node/AbstractDelegate';
import { formKeys, formNames } from '../../constants';
import schemas from './schemas';

class Delegate extends AbstractDelegate {
  constructor(dependencies) {
    super({
      formDataKey: formKeys.ARTICLE_FORM_DATA_KEY,
      formName: formNames.ARTICLE,
      schemas,
    }, dependencies);
  }
}

export { Delegate }; // to allow for site level customization
export default (dispatch, ownProps, dependencies) => new Delegate(dependencies);
