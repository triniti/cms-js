import AbstractDelegate from '@triniti/cms/plugins/ncr/screens/search-nodes/AbstractDelegate';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import SearchUsersSort from '@gdbots/schemas/gdbots/iam/enums/SearchUsersSort';
import Message from '@gdbots/pbj/Message';
import schemas from './schemas';

class Delegate extends AbstractDelegate {
  constructor(dependencies) {
    super({
      schemas,
    }, dependencies);
  }

  getSearchParams() {
    const { searchNodesRequestState: { request } } = this.component.props;
    if (request) {
      const params = super.getSearchParams();
      params.sort = SearchUsersSort.FIRST_NAME_ASC.getValue();
      return params;
    }

    return {
      is_staff: this.component.props.isStaff,
      sort: SearchUsersSort.FIRST_NAME_ASC.getValue(),
      status: NodeStatus.PUBLISHED.getValue(),
    };
  }

  handleSearch(pbj) {
    if (pbj instanceof Message) {
      if (!pbj.isFrozen()) {
        pbj.set('sort', SearchUsersSort.FIRST_NAME_ASC);
      }

      return super.handleSearch(pbj);
    }

    pbj.sort = SearchUsersSort.FIRST_NAME_ASC.getValue(); // eslint-disable-line
    return super.handleSearch(pbj);
  }
}

export { Delegate }; // to allow for site level customization
export default () => new Delegate();
