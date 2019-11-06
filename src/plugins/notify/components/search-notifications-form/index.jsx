import PropTypes from 'prop-types';
import get from 'lodash/get';
import React, { Component } from 'react';
import lowerCase from 'lodash/lowerCase';
import humanizeEnums from '@triniti/cms/utils/humanizeEnums';
import LegendSelect from '@triniti/cms/components/legend-select';
import Message from '@gdbots/pbj/Message';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import SearchSortEnum from '@triniti/schemas/triniti/notify/enums/SearchNotificationsSort';
import NotificationSendStatus from '@triniti/schemas/triniti/notify/enums/NotificationSendStatus';
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

const statusOptions = humanizeEnums(NotificationSendStatus, { format: 'map', except: [NotificationSendStatus.UNKNOWN] });
const sortOptions = humanizeEnums(SearchSortEnum, {
  format: 'map',
  shouldStartCase: false,
  except: [SearchSortEnum.UNKNOWN],
}).map(({ label, value }) => ({
  label: label.replace(/(asc|desc)/, '$1ending'),
  value,
}));

class SearchNotificationsForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      request: props.request ? props.request.toObject() : {},
      isCollapsed: true,
      hasActiveSearch: false,
    };

    this.handleChangeApp = this.handleChangeApp.bind(this);
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
      'updated_after',
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
    const searchStatus = get(selectedOption, 'value', null);

    const requestData = {
      request: {
        ...request,
        send_status: searchStatus,
        status: (searchStatus === NotificationSendStatus.CANCELED.toString()) ? NodeStatus.DELETED : null,
      },
    };

    this.setState(requestData, this.handleCollapseOpen);
  }

  handleChangeApp(selectOption) {
    const { request } = this.state;
    const appRef = selectOption ? selectOption.value : null;

    this.setState({
      request: {
        ...request,
        app_ref: appRef,
      },
    }, () => {
      this.handleCollapseOpen();
    });
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
    const { onSubmit } = this.props;
    const { request, isCollapsed, hasActiveSearch } = this.state;
    onSubmit(request);
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
      allAppOptions,
      appRef,
      disabled,
      inputRef,
    } = this.props;

    const { request, isCollapsed } = this.state;
    const status = request.send_status ? request.send_status : '';
    const sort = request.sort ? request.sort : 'relevance';

    return (
      <Card className={isCollapsed ? 'sticky-top search-notifications-form' : 'search-notifications-form'}>
        <CardBody className="pb-1">
          <Form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <LegendSelect
                  name="sendStatus"
                  placeholder="Select status:"
                  onChange={this.handleChangeStatus}
                  options={statusOptions}
                  value={statusOptions.find((option) => option.value === status)}
                />
              </InputGroupAddon>

              {
                allAppOptions && allAppOptions.length > 0
                && (
                  <InputGroupAddon addonType="prepend">
                    <LegendSelect
                      name="app"
                      placeholder="App:"
                      onChange={this.handleChangeApp}
                      options={allAppOptions}
                      value={
                        allAppOptions.find((option) => appRef && option.value === appRef.toString())
                      }
                    />
                  </InputGroupAddon>
                )
              }

              <Input
                className="form-control search-nodes__input"
                value={request.q || ''}
                disabled={disabled}
                innerRef={inputRef}
                type="search"
                name="q"
                onChange={this.handleChangeQ}
                placeholder="Search Notifications..."
              />

              <InputGroupAddon addonType="append">
                <Button disabled={disabled} color="secondary" onClick={this.handleSearch}>
                  <Icon imgSrc="search" className="mr-0" />
                </Button>
              </InputGroupAddon>
            </InputGroup>

            <div className="search-sort pr-4">
              <UncontrolledButtonDropdown className="float-right pt-2">
                <DropdownToggle
                  disabled={disabled}
                  caret
                  size="sm"
                  outline
                  color="light"
                  className="mr-2"
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

SearchNotificationsForm.propTypes = {
  allAppOptions: PropTypes.arrayOf(PropTypes.object),
  appRef: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  currentPage: PropTypes.number,
  disabled: PropTypes.bool,
  inputRef: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  request: PropTypes.instanceOf(Message),
};

SearchNotificationsForm.defaultProps = {
  allAppOptions: [],
  appRef: {},
  currentPage: 1,
  disabled: false,
  request: {},
};

export default SearchNotificationsForm;
