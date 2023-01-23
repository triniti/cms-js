import Message from '@gdbots/pbj/Message';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
// import createDelegateFactory from '@triniti/app/createDelegateFactory';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import { Icon } from 'components';
import { ScrollableContainer } from 'components';
import {
  Button,
  Container,
  Form,
  Input,
  InputGroup,
  Spinner,
} from 'reactstrap';

// import delegateFactory from './delegate';
import ImageGrid from '../image-grid';
// import selector from './selector';

class ImageSearch extends React.Component {
  static propTypes = {
    assetTypes: PropTypes.arrayOf(PropTypes.string),
    delegate: PropTypes.shape({
      handleSearch: PropTypes.func.isRequired,
    }).isRequired,
    excludeRef: PropTypes.instanceOf(NodeRef),
    excludeAllWithRefType: PropTypes.string,
    heightOffset: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
    innerRef: PropTypes.func,
    isFulfilled: PropTypes.bool.isRequired,
    onChangeQ: PropTypes.func,
    onSelectImage: PropTypes.func.isRequired,
    onToggleUploader: PropTypes.func.isRequired,
    q: PropTypes.string,
    refreshSearch: PropTypes.number,
    searchImagesRequestState: PropTypes.shape({
      request: PropTypes.instanceOf(Message),
      response: PropTypes.instanceOf(Message),
      status: PropTypes.string,
    }).isRequired,
    selectedImages: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
    statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  static defaultProps = {
    assetTypes: ['image-asset'],
    excludeRef: null,
    excludeAllWithRefType: '',
    heightOffset: '212',
    images: [],
    innerRef: noop,
    onChangeQ: noop,
    q: '',
    refreshSearch: 0,
    selectedImages: [],
  };

  constructor(props) {
    super(props);
    let excludeRefType = '';

    if (props.excludeRef) {
      if (props.excludeRef.getQName().getMessage() === 'gallery') {
        excludeRefType = 'gallery_ref';
      } else {
        excludeRefType = 'linked_refs';
      }
    }

    this.state = {
      excludeRefType,
      q: '',
    };

    this.handleChangeQ = this.handleChangeQ.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    const { assetTypes, delegate, excludeAllWithRefType, excludeRef, statuses } = this.props;
    const { excludeRefType } = this.state;

    let q = '';
    if (excludeRef) {
      q += `-${excludeRefType}:${excludeRef.toString()} `;
    }
    if (excludeAllWithRefType !== '') {
      q += `_missing_:${excludeAllWithRefType} `;
    }
    delegate.handleSearch({ q, statuses, types: assetTypes }, 1);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      assetTypes,
      delegate,
      excludeRef,
      q,
      refreshSearch: nextRefreshSearch,
      searchImagesRequestState: { status },
      statuses,
    } = nextProps;

    if (status === 'none') {
      delegate.handleSearch({ q, excludeRef, statuses, types: assetTypes });
      return;
    }

    const { refreshSearch: currentRefreshSearch } = this.props;
    if (nextRefreshSearch !== currentRefreshSearch) {
      this.handleSearch();
    }
  }

  componentWillUnmount() {
    const { delegate } = this.props;
  }

  handleSearch() {
    const { assetTypes, delegate, excludeAllWithRefType, excludeRef } = this.props;
    const { excludeRefType } = this.state;
    let { q } = this.state;

    if (excludeRef) {
      q += ` -${excludeRefType}:${excludeRef}`;
    }
    if (excludeAllWithRefType) {
      q += ` _missing_:${excludeAllWithRefType}`;
    }
    delegate.handleSearch({ q, types: assetTypes }, 1);
  }

  handleChangeQ({ target: { value: q } }) {
    const { onChangeQ } = this.props;

    this.setState({ q }, () => {
      this.handleSearch();
    });
    onChangeQ(q);
  }

  render() {
    const {
      heightOffset,
      images,
      innerRef,
      isFulfilled,
      onSelectImage,
      onToggleUploader: handleToggleUploader,
      selectedImages,
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
              placeholder="Search images..."
              type="search"
              value={q}
            />
            <Button color="secondary" onClick={() => this.handleSearch()}>
              <Icon imgSrc="search" className="mr-0" />
            </Button>
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
            images.length ? (
              <ImageGrid
                images={images}
                onSelectImage={onSelectImage}
                selectedImages={selectedImages}
              />
            ) : (
              <div className="not-found-message">
                <p>No images found that match your search. You can
                  <Button
                    className="ml-1 mr-1"
                    onClick={handleToggleUploader}
                    size="sm"
                    style={{ marginBottom: '3px' }}
                    outlineText
                    color="primary"
                  ><Icon imgSrc="upload" size="xs" className="mr-1" /> upload
                  </Button> new images.
                </p>
              </div>
            )
          )
        }
        {
          !isFulfilled
          && <Spinner className="p-4" />
        }
      </ScrollableContainer>,
    ];
  }
}

// export default connect(selector, createDelegateFactory(delegateFactory))(ImageSearch);
export default ImageSearch;
