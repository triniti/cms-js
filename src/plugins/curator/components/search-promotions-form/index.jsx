import PropTypes from 'prop-types';
import React, { Component } from 'react';
import lowerCase from 'lodash/lowerCase';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import Schema from '@gdbots/pbj/Schema';
import BatchOperationDropdown from '@triniti/cms/plugins/ncr/components/batch-operation-dropdown';
import humanizeEnums from '@triniti/cms/utils/humanizeEnums';
import LegendSelect from '@triniti/cms/components/legend-select';
import Message from '@gdbots/pbj/Message';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import SearchSortEnum from '@triniti/schemas/triniti/curator/enums/SearchPromotionsSort';
import {
  Button,
  Card,
  CardBody,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Icon,
  Input,
  InputGroup,
  InputGroupAddon,
  UncontrolledButtonDropdown,
} from '@triniti/admin-ui-plugin/components';
import AdvancedOptionFields from './advanced-options';
import './styles.scss';

const statusOptions = humanizeEnums(NodeStatus, { format: 'map', except: [NodeStatus.UNKNOWN] });

const sortOptions = humanizeEnums(SearchSortEnum, {
  format: 'map',
  shouldStartCase: false,
  except: [SearchSortEnum.UNKNOWN],
}).map(({ label, value }) => ({
  label: label.replace(/(asc|desc)/, '$1ending'),
  value,
}));

class SearchPromotionsForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      request: props.request ? props.request.toObject() : {},
      isCollapsed: true,
      hasActiveSearch: false,
    };

    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.handleChangeSort = this.handleChangeSort.bind(this);
    this.handleChangeQ = this.handleChangeQ.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeCount = this.handleChangeCount.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleCollapseOpen = this.handleCollapseOpen.bind(this);
    this.handleToggleCollapse = this.handleToggleCollapse.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
  }

  componentDidMount() {
    const { request } = this.state;
    const advancedSearchKeys = [
      'created_after',
      'created_before',
      'published_after',
      'updated_after',
      'updated_before',
      'updated_before',
    ];
    const hasActiveSearch = request && advancedSearchKeys.some((key) => !!request[key]);
    this.setState({
      request: {
        ...request,
      },
      isCollapsed: !hasActiveSearch,
    });
  }

  handleChangeQ(e) {
    const { request } = this.state;

    this.setState({
      request: {
        ...request,
        q: e.currentTarget.value,
        parsed_query_json: null,
      },
    }, this.handleCollapseOpen);
  }

  handleChangeStatus(selectedOption) {
    const { request } = this.state;

    this.setState({
      request: {
        ...request,
        statuses: !selectedOption ? [] : [String(selectedOption.value)],
      },
    }, this.handleCollapseOpen);
  }

  handleChangeSort(newSort) {
    const { currentPage } = this.props;
    const { request } = this.state;

    this.setState({
      request: {
        ...request,
        sort: newSort,
        currentPage,
      },
    }, this.handleCollapseOpen);
  }

  handleChangeDate(key, value) {
    const { request } = this.state;

    if (value === '') {
      return;
    }

    this.setState({
      request: {
        ...request,
        [key]: value,
      },
    }, () => {
      if (value === null || value instanceof Date) {
        this.handleCollapseOpen();
      }
    });
  }

  handleChangeCount(value) {
    const { request } = this.state;
    let newValue = value;

    if (value < 0) {
      newValue = 0;
    }

    if (value > 255) {
      newValue = 255;
    }

    this.setState({
      request: {
        ...request,
        count: newValue,
      },
    }, this.handleCollapseOpen);
  }

  handleReset() {
    const { isCollapsed } = this.state;
    this.setState({
      request: {},
    }, () => {
      this.handleSearch();
      if (!isCollapsed) {
        this.setState({ isCollapsed: true });
      }
    });
  }

  handleSearch() {
    const { onSubmit, onUnSelectAllRows } = this.props;
    const { request, isCollapsed, hasActiveSearch } = this.state;
    onSubmit(request);
    onUnSelectAllRows();
    if (!isCollapsed) {
      this.setState({ isCollapsed: true });
    }

    if (hasActiveSearch) {
      this.setState({ isCollapsed: false });
    }
  }

  handleToggleCollapse() {
    const { isCollapsed } = this.state;

    if (isCollapsed) {
      this.scrollToTop();
    }

    this.setState({ isCollapsed: !isCollapsed });
  }

  handleCollapseOpen() {
    const { isCollapsed } = this.state;
    if (isCollapsed) {
      this.handleSearch();
    }
  }

  scrollToTop() {
    const screenBody = document.getElementsByClassName('screen-body')[0];
    screenBody.scrollTo({ top: 0, behavior: 'smooth' });
  }

  render() {
    const {
      disabled,
      inputRef,
      onUnSelectAllRows,
      schemas,
      selectedRows,
    } = this.props;
    const { request, isCollapsed } = this.state;
    const status = request.statuses ? request.statuses[0] : '';
    const sort = request.sort ? request.sort : 'relevance';

    return (
      <Card className={isCollapsed ? 'sticky-top search-promotions-form' : 'search-promotions-form'}>
        <CardBody className="pb-1">
          <Form
            autoComplete="off"
            onSubmit={(e) => e.preventDefault()}
          >
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <LegendSelect
                  name="status"
                  placeholder="Select status:"
                  onChange={this.handleChangeStatus}
                  options={statusOptions}
                  value={
                    statusOptions.find((option) => option.value === status)
                  }
                />
              </InputGroupAddon>

              <Input
                className="form-control search-nodes__input"
                value={request.q || ''}
                disabled={disabled}
                innerRef={inputRef}
                type="search"
                name="q"
                onChange={this.handleChangeQ}
                placeholder="Search Promotions..."
              />

              <InputGroupAddon addonType="append">
                <Button disabled={disabled} color="secondary" onClick={this.handleSearch}>
                  <Icon imgSrc="search" className="mr-0" />
                </Button>
              </InputGroupAddon>
            </InputGroup>

            <div className="search-batch-and-sort pr-4">
              <UncontrolledButtonDropdown className="float-right pt-2">
                <DropdownToggle
                  caret
                  color="light"
                  disabled={disabled}
                  outline
                  size="sm"
                >
                  <Icon imgSrc="services" size="sm" className="mr-1" />
                  {lowerCase(sort).replace(/(asc|desc)/, '$1ending')}
                </DropdownToggle>
                <DropdownMenu>
                  {sortOptions.map(({ label, value }) => (
                    <DropdownItem
                      disabled={disabled}
                      onClick={() => this.handleChangeSort(value)}
                      key={value}
                    >
                      {label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledButtonDropdown>
              <BatchOperationDropdown
                className="pt-2"
                nodeRefs={selectedRows}
                schemas={schemas}
                nodeLabel="promotion"
                onUnSelectAllRows={onUnSelectAllRows}
              />
            </div>

            <AdvancedOptionFields
              onSearch={this.handleSearch}
              onReset={this.handleReset}
              onChangeDate={this.handleChangeDate}
              onChangeCount={this.handleChangeCount}
              request={request || {}}
              onToggleCollapse={this.handleToggleCollapse}
              isCollapsed={isCollapsed}
            />
          </Form>
        </CardBody>
      </Card>
    );
  }
}

SearchPromotionsForm.propTypes = {
  currentPage: PropTypes.number,
  disabled: PropTypes.bool,
  inputRef: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onUnSelectAllRows: PropTypes.func.isRequired,
  request: PropTypes.instanceOf(Message),
  schemas: PropTypes.objectOf(PropTypes.instanceOf(Schema)).isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
};

SearchPromotionsForm.defaultProps = {
  currentPage: 1,
  disabled: false,
  request: {},
  selectedRows: [],
};

export default SearchPromotionsForm;
