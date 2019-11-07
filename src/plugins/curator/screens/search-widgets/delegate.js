import AbstractDelegate from '@triniti/cms/plugins/ncr/screens/search-nodes/AbstractDelegate';
import SearchWidgetsSort from '@triniti/schemas/triniti/curator/enums/SearchWidgetsSort';

import schemas from './schemas';

class Delegate extends AbstractDelegate {
  constructor(dependencies) {
    super({
      schemas,
    }, dependencies);
  }

  getSearchParams() {
    const { searchNodesRequestState: { request }, statuses } = this.component.props;
    const defaultSortOrder = SearchWidgetsSort.RELEVANCE;
    return {
      sort: request ? request.get('sort', defaultSortOrder).getValue() : defaultSortOrder.getValue(),
      statuses,
      types: request ? request.get('types', []) : [],
    };
  }
}

export { Delegate }; // to allow for site level customization
export default (dispatch, ownProps, dependencies) => new Delegate(dependencies);
