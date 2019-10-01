import noop from 'lodash/noop';
import Message from '@gdbots/pbj/Message';
import { STATUS_FULFILLED } from '@triniti/app/constants';
import searchNodes from '@triniti/cms/plugins/ncr/actions/searchNodes';
import clearResponse from '@triniti/cms/plugins/pbjx/actions/clearResponse';

export default class AbstractDelegate {
  /**
   * @param {Object} config
   * @param {Object} dependencies
   */
  constructor(config, dependencies) {
    this.config = config;
    this.dependencies = dependencies;

    /** @type {Function} */
    this.dispatch = noop;

    /**
     * When the delegate is first created it isn't bound to a component.
     * Binding to a component is an optional feature of a delegate so if
     * that happens the component property will be a reference to a
     * component instance.  For functional components, it's an object.
     *
     * @type {Component|{dispatch: Function, props: {}, state: {}}}
     */
    this.component = {
      dispatch: noop,
      props: {},
      state: {},
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  /**
   * @param {Component} component
   */
  bindToComponent(component) {
    this.component = component;
    this.dispatch = component.props.dispatch;
  }

  /**
   * @link https://reactjs.org/docs/react-component.html#componentdidmount
   *
   * Checks to see if there is an existing search request and uses the search
   * parameters (like page etc.) to perform search.
   */
  componentDidMount() {
    const { searchNodesRequestState: { request, response } } = this.component.props;
    if (!response) {
      const q = (request && request.get('q')) || '';
      const page = (request && request.get('page')) || 1;
      this.handleSearch({ q, ...this.getSearchParams(), page });
    }
  }

  /**
   * @link https://reactjs.org/docs/react-component.html#componentdidupdate
   */
  componentDidUpdate(prevProps) {
    const { location: prevLocation, searchNodesRequestState } = prevProps;
    const { location, searchNodesRequestState: { request } } = this.component.props;
    /**
     * If user clicks same nav item they are already on (same pathname but different key)
     * search again to refresh results.
     */
    if (
      prevLocation.pathname === location.pathname
      && prevLocation.key !== location.key
      && searchNodesRequestState.status === STATUS_FULFILLED
      && this.config.schemas.searchNodes
    ) {
      const requestObject = request.toObject();
      delete requestObject.request_id;
      this.dispatch(clearResponse(this.config.schemas.searchNodes.getCurie()));
      this.handleSearch(requestObject);
    }
  }

  /**
   * @link https://reactjs.org/docs/react-component.html#componentwillunmount
   */
  componentWillUnmount() {
    if (this.config.schemas.searchNodes) {
      this.dispatch(clearResponse(this.config.schemas.searchNodes.getCurie()));
    }
  }

  /**
   * Get all schemas
   * @returns {object}
   */
  getSchemas() {
    return this.config.schemas;
  }

  getSearchParams() {
    const { sort, statuses } = this.component.props;

    return { sort, statuses };
  }

  /**
   * @param {Object|Message} search - pbj search request or object of params
   */
  handleSearch(search) {
    if (search instanceof Message) {
      this.dispatch(searchNodes(search));
      return;
    }

    const requestData = search;
    if (!requestData.count) {
      requestData.count = 25;
    }

    const request = this.config.schemas.searchNodes.createMessage(requestData);
    this.dispatch(searchNodes(request));
  }
}
