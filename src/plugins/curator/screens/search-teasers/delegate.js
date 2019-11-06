import AbstractDelegate from '@triniti/cms/plugins/ncr/screens/search-nodes/AbstractDelegate';
import SearchTeasersSort from '@triniti/schemas/triniti/curator/enums/SearchTeasersSort';

import schemas from './schemas';

class Delegate extends AbstractDelegate {
  constructor(dependencies) {
    super({
      schemas,
    }, dependencies);
  }

  getSearchParams() {
    const { searchNodesRequestState: { request }, statuses } = this.component.props;
    const { ORDER_DATE_DESC } = SearchTeasersSort;
    return {
      sort: request ? request.get('sort', ORDER_DATE_DESC).getValue() : ORDER_DATE_DESC.getValue(),
      statuses,
      types: request ? request.get('types', []) : [],
    };
  }
}

export { Delegate }; // to allow for site level customization
export default (dispatch, ownProps, dependencies) => new Delegate(dependencies);
