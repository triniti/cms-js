import AbstractDelegate from '@triniti/cms/plugins/ncr/screens/search-nodes/AbstractDelegate';
import SearchPollsSort from '@triniti/schemas/triniti/apollo/enums/SearchPollsSort';
import schemas from './schemas';

class Delegate extends AbstractDelegate {
  constructor(dependencies) {
    super({
      schemas,
    }, dependencies);
  }

  getSearchParams() {
    const { statuses } = this.component.props;

    return { sort: SearchPollsSort.ORDER_DATE_DESC.getValue(), statuses };
  }
}

export { Delegate }; // to allow for site level customization
export default (dispatch, ownProps, dependencies) => new Delegate(dependencies);
