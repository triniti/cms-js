import inflection from 'inflection';
import PropTypes from 'prop-types';
import React from 'react';
import startCase from 'lodash/startCase';

import BatchOperationModal from '@triniti/cms/plugins/ncr/components/batch-operation-modal';
import Exception from '@gdbots/common/Exception';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import Pagination from '@triniti/cms/components/pagination';
import { STATUS_FAILED, STATUS_FULFILLED, STATUS_REJECTED } from '@triniti/app/constants';
import {
  ActionButton,
  RouterLink,
  Screen,
  Spinner,
  StatusMessage,
} from '@triniti/admin-ui-plugin/components';

import AbstractDelegate from './AbstractDelegate';
import { searchViewTypes } from '../../constants';
import './styles.scss';

const { CARD } = searchViewTypes;

export default class AbstractSearchNodesScreen extends React.Component {
  static propTypes = {
    alerts: PropTypes.arrayOf(PropTypes.object).isRequired,
    delegate: PropTypes.instanceOf(AbstractDelegate).isRequired,
    disabled: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    getNode: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    isStaff: PropTypes.number,
    match: PropTypes.objectOf(PropTypes.any).isRequired,
    nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
    searchNodesRequestState: PropTypes.shape({
      exception: PropTypes.instanceOf(Exception),
      request: PropTypes.instanceOf(Message),
      response: PropTypes.instanceOf(Message),
      status: PropTypes.string,
    }).isRequired,
    sort: PropTypes.string,
    statuses: PropTypes.arrayOf(PropTypes.string),
    types: PropTypes.arrayOf(PropTypes.string),
    view: PropTypes.string,
  };

  static defaultProps = {
    disabled: false,
    isStaff: undefined,
    sort: '',
    statuses: [],
    types: [],
    view: 'table',
  };

  constructor(props) {
    super(props);
    const { delegate } = props;
    this.state = { selectedRows: [] };
    this.handleChangeAllRows = this.handleChangeAllRows.bind(this);
    this.handleChangeSearchParam = this.handleChangeSearchParam.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleUnSelectAllRows = this.handleUnSelectAllRows.bind(this);

    delegate.bindToComponent(this);
  }

  componentDidMount() {
    const { delegate } = this.props;
    delegate.componentDidMount();
    if (this.inputElement) {
      this.inputElement.focus();
    }
  }

  componentDidUpdate(prevProps) {
    const { delegate } = this.props;
    delegate.bindToComponent(this);
    delegate.componentDidUpdate(prevProps);
  }

  componentWillUnmount() {
    const { delegate } = this.props;
    delegate.componentWillUnmount();
  }

  getSearchNodesForm() {
    return null;
  }

  getSearchNodesFormRenderProps() {
    const { disabled, delegate, sort, statuses, getNode } = this.props;
    const { selectedRows } = this.state;

    return {
      disabled,
      getNode,
      onUnSelectAllRows: this.handleUnSelectAllRows,
      schemas: delegate.getSchemas(),
      selectedRows,
      sort,
      statuses,
    };
  }

  getNodesTable() {
    return null;
  }

  getNodeCards() {
    return null;
  }

  getNodesTableRenderProps() {
    const { disabled, history, nodes, sort } = this.props;
    const { selectedRows } = this.state;

    return {
      areAllChecked: selectedRows.length === nodes.length && nodes.length > 0,
      disabled,
      history,
      onChangeAllRows: this.handleChangeAllRows,
      onSelectRow: (selectedRow) => { this.handleSelectRow(selectedRow); },
      onSort: (sortBy) => { this.handleChangeSearchParam('sort', sortBy); },
      selectedRows,
      sort,
    };
  }

  getTitle() {
    const { match: { url } } = this.props;
    return startCase(url.split('/').pop());
  }

  handleChangeAllRows() {
    const { nodes } = this.props;
    const { selectedRows } = this.state;

    this.setState({
      selectedRows: (selectedRows.length !== nodes.length)
        ? nodes.map((node) => NodeRef.fromNode(node)) : [],
    });
  }

  /**
   * @param {string} key
   * @param {any} value
   */
  handleChangeSearchParam(key, value) {
    const { delegate, searchNodesRequestState: { request } } = this.props;
    const newRequest = { ...request.toObject(), [key]: value };

    delete newRequest.request_id;

    delegate.handleSearch(newRequest);
  }

  handleCloseModal() {
    const { delegate, searchNodesRequestState: { request } } = this.props;
    const newRequest = request.clone().clear('request_id');

    this.setState({
      selectedRows: [],
    }, () => {
      delegate.handleSearch(newRequest);
      this.inputElement.focus();
    });
  }

  /**
   * @param {NodeRef} selectedRow
   */
  handleSelectRow(selectedRow) {
    const { selectedRows } = this.state;

    this.setState({
      selectedRows: !selectedRows.find((row) => row.id === selectedRow.id)
        ? selectedRows.concat([selectedRow])
        : selectedRows.filter((row) => row.id !== selectedRow.id),
    });
  }

  handleUnSelectAllRows() {
    this.setState({ selectedRows: [] });
  }

  renderBatchOperationModal() {
    return (
      <BatchOperationModal
        key="modal"
        nodeLabel={this.getTitle()}
        onCloseModal={this.handleCloseModal}
      />
    );
  }

  renderBody() {
    const { searchNodesRequestState: { exception, status } } = this.props;

    if (status === STATUS_FAILED || status === STATUS_REJECTED) {
      return <StatusMessage key="status" exception={exception} status={status} />;
    }

    return [
      this.renderBatchOperationModal(),
      this.renderForm(),
      this.renderResultCountAndTopPagination(),
      this.renderNodeView(),
      this.renderBottomPagination(),
    ];
  }

  renderBottomPagination() {
    const {
      searchNodesRequestState: { request, response, status },
    } = this.props;

    if (status === STATUS_FULFILLED) {
      return (
        <Pagination
          className="d-flex justify-content-end"
          currentPage={request.get('page') || 1}
          key="pager-bottom"
          onChangePage={(nextPage) => this.handleChangeSearchParam('page', nextPage)}
          perPage={request.get('count')}
          total={response.get('total')}
        />
      );
    }

    return null;
  }

  renderForm() {
    const { delegate, searchNodesRequestState: { request } } = this.props;
    const FormComponent = this.getSearchNodesForm();

    return (
      <FormComponent
        key={request ? request.get('sort').valueOf() : 'form'}
        currentPage={(request && request.get('page')) || 1}
        inputRef={(input) => { (this.inputElement = input); }}
        onSubmit={delegate.handleSearch}
        request={request}
        {...this.getSearchNodesFormRenderProps()}
      />
    );
  }

  renderResultCount() {
    const { searchNodesRequestState: { request, response, status } } = this.props;
    const requestQ = (request && request.get('q')) || '';
    const inputQ = this.inputElement && this.inputElement.value.trim().length
      ? this.inputElement.value : requestQ;

    return status === STATUS_FULFILLED && inputQ === requestQ ? (
      <div key="search-count" className="mt-3 mb-2 text-dark">
        Found <strong>{response.get('total')}</strong> results in <strong>{response.get('time_taken')}</strong> milliseconds
      </div>
    ) : null;
  }

  renderResultCountAndTopPagination() {
    return (
      <div
        key="result-count-and-pagination"
        className="d-flex justify-content-between"
      >
        {this.renderResultCount()}
        {this.renderTopPagination()}
      </div>
    );
  }

  renderNodeView() {
    const { nodes, searchNodesRequestState: { request, status }, view } = this.props;
    const requestQ = (request && request.get('q')) || '';
    const inputQ = this.inputElement && this.inputElement.value.trim().length
      ? this.inputElement.value.trim()
      : requestQ;

    if (status === STATUS_FULFILLED && inputQ === requestQ) {
      if (view === CARD) {
        const NodeCards = this.getNodeCards();
        return <NodeCards key="cards" nodes={nodes} />;
      }

      const NodesTable = this.getNodesTable();
      return (
        <NodesTable
          key="table"
          nodes={nodes}
          {...this.getNodesTableRenderProps()}
        />
      );
    }

    return <Spinner key="spinner" />;
  }

  renderHeader() {
    return this.getTitle();
  }

  /**
   * Renders primary buttons for search-node-screen
   * @returns {*} - CreateButton
   */
  renderPrimaryActions() {
    const { match: { url } } = this.props;
    return (
      <RouterLink to={`${url}/create`} key="primary-actions">
        <ActionButton text={`Create ${inflection.singularize(this.getTitle())}`} />
      </RouterLink>
    );
  }

  renderTopPagination() {
    const {
      searchNodesRequestState: { request, response, status },
    } = this.props;

    if (status === STATUS_FULFILLED) {
      return (
        <Pagination
          currentPage={request.get('page') || 1}
          key="pager-top"
          onChangePage={(nextPage) => this.handleChangeSearchParam('page', nextPage)}
          perPage={request.get('count')}
          total={response.get('total')}
        />
      );
    }

    return null;
  }

  render() {
    const { alerts, dispatch } = this.props;
    return (
      <Screen
        title={this.getTitle()}
        alerts={alerts}
        body={this.renderBody()}
        dispatch={dispatch}
        header={this.renderHeader()}
        maxWidth="1600px"
        primaryActions={this.renderPrimaryActions()}
      />
    );
  }
}
