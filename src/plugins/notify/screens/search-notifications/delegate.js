import AbstractDelegate from '@triniti/cms/plugins/ncr/screens/search-nodes/AbstractDelegate';
import SearchNotificationsSort from '@triniti/schemas/triniti/notify/enums/SearchNotificationsSort';

import schemas from './schemas';

class Delegate extends AbstractDelegate {
  constructor(dependencies) {
    super({
      schemas,
    }, dependencies);
  }

  componentDidMount() {
    super.componentDidMount();
    this.dispatch(schemas.getAllApps.createMessage());
  }

  getSearchParams() {
    const { searchNodesRequestState: { request } } = this.component.props;
    const defaultSortOrder = SearchNotificationsSort.CREATED_AT_DESC;
    return {
      app_ref: request ? request.get('app_ref') : null,
      send_status: request ? request.get('send_status') : null,
      sort: request ? request.get('sort', defaultSortOrder).getValue() : defaultSortOrder.getValue(),
      status: request ? request.get('status') : null,
    };
  }
}

export { Delegate }; // to allow for site level customization
export default (dispatch, ownProps, dependencies) => new Delegate(dependencies);
