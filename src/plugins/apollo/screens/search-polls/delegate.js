import AbstractDelegate from '@triniti/cms/plugins/ncr/screens/search-nodes/AbstractDelegate';
import SearchPollsSort from '@triniti/schemas/triniti/apollo/enums/SearchPollsSort';

import schemas from './schemas';

class Delegate extends AbstractDelegate {
  constructor(dependencies) {
    super({
      schemas,
    }, dependencies);
  }

  /**
   * fixme: adjust default sort to  to ORDER_DATE_DESC in schema and remove this function
   */
  getSearchParams() {
    const { searchNodesRequestState: { request } } = this.component.props;
    if (request) {
      return super.getSearchParams();
    }
    return {
      sort: SearchPollsSort.ORDER_DATE_DESC.getValue(),
    };
  }
}

export { Delegate }; // to allow for site level customization
export default (dispatch, ownProps, dependencies) => new Delegate(dependencies);
