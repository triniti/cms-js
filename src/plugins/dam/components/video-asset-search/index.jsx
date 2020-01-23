import { connect } from 'react-redux';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PropTypes from 'prop-types';
import React from 'react';
import AssetsTable from '@triniti/cms/plugins/dam/components/assets-table';
import {
  Button,
  Container,
  Form,
  Icon,
  Input,
  InputGroup,
  InputGroupAddon,
  ScrollableContainer,
  Spinner,
} from '@triniti/admin-ui-plugin/components';

import delegateFactory from './delegate';
import selector from './selector';

class VideoAssetSearch extends React.Component {
  static propTypes = {
    assets: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
    delegate: PropTypes.shape({
      handleSearch: PropTypes.func.isRequired,
      handleClearChannel: PropTypes.func.isRequired,
    }).isRequired,
    isFulfilled: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    onToggleUploader: PropTypes.func.isRequired,
    searchVideoAssetsRequestState: PropTypes.shape({
      request: PropTypes.instanceOf(Message),
      response: PropTypes.instanceOf(Message),
      status: PropTypes.string,
    }).isRequired,
    selected: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)).isRequired,
    sort: PropTypes.string.isRequired,
    refreshSearchFlag: PropTypes.number.isRequired, // on change, triggers new search
  };

  static defaultProps = {
    assets: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      q: '',
    };

    this.handleChangeQ = this.handleChangeQ.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  componentDidMount() {
    const { delegate } = this.props;
    delegate.handleSearch({ q: '' });
  }

  componentDidUpdate(prevProps) {
    const { refreshSearchFlag } = this.props;
    if (refreshSearchFlag !== prevProps.refreshSearchFlag) {
      const { delegate, searchVideoAssetsRequestState: { request } } = this.props;
      const newRequest = { ...request.toObject() };
      delete newRequest.request_id;
      delegate.handleSearch(newRequest);
    }
  }

  componentWillUnmount() {
    const { delegate } = this.props;
    delegate.handleClearChannel();
  }

  handleSearch() {
    const { delegate } = this.props;
    const { q } = this.state;
    delegate.handleSearch({ q });
  }

  handleSort(sortBy) {
    const { delegate, searchVideoAssetsRequestState: { request } } = this.props;
    delegate.handleSearch({ ...request.toObject(), sort: sortBy });
  }

  handleChangeQ({ target: { value: q } }) {
    this.setState({ q }, this.handleSearch);
  }

  render() {
    const {
      assets,
      isFulfilled,
      onSelect: handleSelect,
      onToggleUploader: handleToggleUploader,
      selected,
      sort,
    } = this.props;
    const { q } = this.state;

    return (
      <>
        <Container fluid className="sticky-top px-4 py-2 shadow-depth-2 bg-white">
          <Form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
            <InputGroup size="sm">
              <Input
                className="form-control"
                name="q"
                onChange={this.handleChangeQ}
                placeholder="Search Video Assets..."
                type="search"
                value={q}
              />
              <InputGroupAddon addonType="append">
                <Button color="secondary" onClick={this.handleSearch}>
                  <Icon imgSrc="search" className="mr-0" />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </Form>
        </Container>
        <ScrollableContainer
          className="bg-gray-400"
          style={{ height: 'calc(100vh - 212px)' }}
        >
          {!isFulfilled && <Spinner className="p-4" />}
          {isFulfilled && (
            assets.length ? (
              <AssetsTable
                hasMasterCheckbox={false}
                nodes={assets}
                onSelectRow={handleSelect}
                onSort={this.handleSort}
                selectedRows={selected}
                sort={sort}
              />
            ) : (
              <div className="not-found-message">
                <p>No video assets found that match your search. You can
                  <Button
                    className="ml-1 mr-1"
                    onClick={handleToggleUploader}
                    size="sm"
                    style={{ marginBottom: '3px' }}
                    outlineText
                    color="primary"
                  ><Icon imgSrc="upload" size="xs" className="mr-1" /> upload
                  </Button> a new video asset.
                </p>
              </div>
            )
          )}
        </ScrollableContainer>
      </>
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(VideoAssetSearch);
