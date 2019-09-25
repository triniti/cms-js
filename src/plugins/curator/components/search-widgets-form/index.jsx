import PropTypes from 'prop-types';
import React, { Component } from 'react';
import lowerCase from 'lodash/lowerCase';
import Schema from '@gdbots/pbj/Schema';
import humanizeEnums from '@triniti/cms/utils/humanizeEnums';
import LegendSelect from '@triniti/cms/components/legend-select';
import Message from '@gdbots/pbj/Message';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import SearchSortEnum from '@triniti/schemas/triniti/curator/enums/SearchWidgetsSort';
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

class SearchWidgetsForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      request: props.request ? props.request.toObject() : {},
      isCollapsed: true,
      hasActiveSearch: false,
    };

    this.handleChangeCount = this.handleChangeCount.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeQ = this.handleChangeQ.bind(this);
    this.handleChangeSort = this.handleChangeSort.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleToggleWidgetTypes = this.handleToggleWidgetTypes.bind(this);
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

  handleToggleWidgetTypes(assetType) {
    const { request } = this.props;
    const types = request ? request.get('types', []) : [];

    const allTypes = !types.includes(assetType)
      ? [...types, assetType]
      : types.filter((type) => type !== assetType);
    this.setState({
      request: {
        ...request.toObject(),
        types: allTypes,
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
      if (typeof value === 'object') {
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
      disabled,
      inputRef,
      schemas,
    } = this.props;
    const { request, isCollapsed } = this.state;
    const { types } = request;
    const status = request.statuses ? request.statuses[0] : '';
    const sort = request.sort ? request.sort : 'relevance';

    return (
      <Card className={isCollapsed ? 'sticky-top search-widgets-form' : 'search-widgets-form'}>
        <CardBody className="pb-1">
          <Form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <LegendSelect
                  name="status"
                  placeholder="Select status:"
                  onChange={this.handleChangeStatus}
                  options={statusOptions}
                  value={statusOptions.find((option) => option.value === status)}
                />
              </InputGroupAddon>

              <Input
                className="form-control"
                value={request.q || ''}
                disabled={disabled}
                innerRef={inputRef}
                type="search"
                name="q"
                onChange={this.handleChangeQ}
                placeholder="Search Widgets..."
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
            {schemas && schemas.nodes && (
              <div className="widget-types d-inline-block mt-2">
                {schemas.nodes.map((node) => {
                  const widgetType = node.getId().getMessage();
                  const hasTypes = types ? types.includes(widgetType) : false;
                  return (
                    <Button
                      active={hasTypes}
                      color={hasTypes ? 'secondary' : 'light'}
                      key={widgetType}
                      onClick={() => this.handleToggleWidgetTypes(widgetType)}
                      outline
                      size="sm"
                    >
                      {widgetType.replace(/(-|widget)/g, ' ')}
                      <Icon
                        className="ml-1 mr-0 icon-toggle"
                        imgSrc="plus-outline"
                        size="xs"
                      />
                      <Icon
                        className="ml-1 mr-0 icon-toggle"
                        imgSrc="minus-outline"
                        size="xs"
                      />
                    </Button>
                  );
                })}
              </div>
            )}

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

SearchWidgetsForm.propTypes = {
  currentPage: PropTypes.number,
  disabled: PropTypes.bool,
  inputRef: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  request: PropTypes.instanceOf(Message),
  schemas: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.instanceOf(Schema),
    PropTypes.arrayOf(PropTypes.instanceOf(Schema)),
  ])).isRequired,
};

SearchWidgetsForm.defaultProps = {
  currentPage: 1,
  disabled: false,
  request: {},
};

export default SearchWidgetsForm;
