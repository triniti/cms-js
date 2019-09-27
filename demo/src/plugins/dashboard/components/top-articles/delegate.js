import noop from 'lodash/noop';
import clearChannel from '@triniti/cms/plugins/pbjx/actions/clearChannel';
import createSlug from '@gdbots/common/createSlug';
import SearchArticlesSort from '@triniti/schemas/triniti/news/enums/SearchArticlesSort';
import { callPbjx } from '@gdbots/pbjx/redux/actions';
import { STATUS_NONE } from '@triniti/app/constants';
import { SearchArticlesRequest } from '../../../../../schemas';

class Delegate {
  constructor() {
    this.channel = '';
    this.dispatch = noop;
    this.component = {
      dispatch: noop,
      props: {},
      state: {},
    };
  }

  bindToComponent(component) {
    this.component = component;
    const { title } = this.component.props;
    this.channel = `dashboard-${createSlug(title)}`;
    this.dispatch = component.props.dispatch;
  }

  componentDidMount() {
    const { status } = this.component.props;
    if (status === STATUS_NONE) {
      this.search();
    }
  }

  componentWillUnmount() {
    this.dispatch(clearChannel(this.channel));
  }

  handleRefresh() {
    this.dispatch(clearChannel(this.channel));
    this.search();
  }

  search() {
    const { search } = this.component.props;
    const request = SearchArticlesRequest.schema().createMessage({
      count: search.count || 16,
      page: 1,
      sort: SearchArticlesSort.ORDER_DATE_DESC.getValue(),
      ...search,
    });
    this.dispatch(callPbjx(request, this.channel));
  }
}

export default () => new Delegate();
