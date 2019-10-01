import AbstractDelegate from '@triniti/cms/plugins/ncr/screens/search-nodes/AbstractDelegate';
import schemas from './schemas';

class Delegate extends AbstractDelegate {
  constructor(dependencies) {
    super({
      schemas,
    }, dependencies);
  }

  getSearchParams() {
    return {
      isStaff: this.component.props.isStaff,
      status: 'published',
    };
  }
}

export { Delegate }; // to allow for site level customization
export default () => new Delegate();
