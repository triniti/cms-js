import AbstractDelegate from '@triniti/cms/plugins/ncr/screens/search-nodes/AbstractDelegate';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
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
      return super.getSearchParams();
    }
    return {
      is_staff: this.component.props.isStaff,
      status: NodeStatus.PUBLISHED.getValue(),
    };
  }
}

export { Delegate }; // to allow for site level customization
export default () => new Delegate();
