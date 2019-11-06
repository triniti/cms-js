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
    const { searchNodesRequestState: { request }, statuses } = this.component.props;
    const { CREATED_AT_DESC } = SearchNotificationsSort;
    return {
      app_ref: request ? request.get('app_ref') : null,
      send_status: request ? request.get('send_status') : null,
      sort: request ? request.get('sort', CREATED_AT_DESC).getValue() : CREATED_AT_DESC.getValue(),
    };
  }
}

export { Delegate }; // to allow for site level customization
export default (dispatch, ownProps, dependencies) => new Delegate(dependencies);
