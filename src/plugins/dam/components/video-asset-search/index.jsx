import Message from '@gdbots/pbj/Message';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
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
    delegate: PropTypes.shape({
      handleSearch: PropTypes.func.isRequired,
      handleClearChannel: PropTypes.func.isRequired,
    }).isRequired,
    heightOffset: PropTypes.string,
    innerRef: PropTypes.func,
    isFulfilled: PropTypes.bool.isRequired,
    onChangeQ: PropTypes.func,
    onSelectVideoAsset: PropTypes.func.isRequired,
    onToggleUploader: PropTypes.func.isRequired,
    q: PropTypes.string,
    refreshSearch: PropTypes.number,
    searchVideoAssetsRequestState: PropTypes.shape({
      request: PropTypes.instanceOf(Message),
      response: PropTypes.instanceOf(Message),
      status: PropTypes.string,
    }).isRequired,
    selectedVideoAsset: PropTypes.instanceOf(Message),
    videoAssets: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
  };

  static defaultProps = {
    heightOffset: '212',
    videoAssets: [],
    innerRef: noop,
    onChangeQ: noop,
    q: '',
    refreshSearch: 0,
    selectedVideoAsset: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      q: '',
    };

    this.handleChangeQ = this.handleChangeQ.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    const { delegate } = this.props;
    delegate.handleSearch({ q: '' }, 1);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      delegate,
      q,
      refreshSearch: nextRefreshSearch,
      searchVideoAssetsRequestState: { status },
    } = nextProps;

    if (status === 'none') {
      delegate.handleSearch({ q });
      return;
    }

    const { refreshSearch: currentRefreshSearch } = this.props;
    if (nextRefreshSearch !== currentRefreshSearch) {
      this.handleSearch();
    }
  }

  componentWillUnmount() {
    const { delegate } = this.props;
    delegate.handleClearChannel();
  }

  handleSearch() {
    const { delegate } = this.props;
    const { q } = this.state;
    delegate.handleSearch({ q }, 1);
  }

  handleChangeQ({ target: { value: q } }) {
    const { onChangeQ } = this.props;
    this.setState({ q }, this.handleSearch);
    onChangeQ(q);
  }

  render() {
    const {
      heightOffset,
      videoAssets,
      innerRef,
      isFulfilled,
      onSelectVideoAsset,
      onToggleUploader: handleToggleUploader,
      selectedVideoAsset,
    } = this.props;
    const { q } = this.state;

    return [
      <Container fluid className="sticky-top px-4 py-2 shadow-depth-2 bg-white" key="container">
        <Form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <InputGroup size="sm">
            <Input
              className="form-control"
              innerRef={innerRef}
              name="q"
              onChange={this.handleChangeQ}
              placeholder="Search Video Assets..."
              type="search"
              value={q}
            />
            <InputGroupAddon addonType="append">
              <Button color="secondary" onClick={() => this.handleSearch()}>
                <Icon imgSrc="search" className="mr-0" />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </Form>
      </Container>,
      <ScrollableContainer
        className="bg-gray-400"
        style={{ height: `calc(100vh - ${heightOffset}px)` }}
        key="scrollable_container"
      >
        {
          isFulfilled && (
            videoAssets.length ? (
              <p>i am the first one: {videoAssets[0].get('title')}</p>
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
          )
        }
        {!isFulfilled && <Spinner className="p-4" />}
      </ScrollableContainer>,
    ];
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(VideoAssetSearch);
