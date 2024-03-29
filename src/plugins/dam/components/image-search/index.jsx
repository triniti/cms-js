import noop from 'lodash-es/noop';
import React, { useState, useEffect } from 'react';
import useRequest from 'plugins/pbjx/components/useRequest';
import useResolver from 'plugins/pbjx/components/with-request/useResolver';
import { Icon, Loading } from 'components';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort';
import { ScrollableContainer } from 'components';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import {
  Button,
  Container,
  Form,
  Input,
  InputGroup,
} from 'reactstrap';
import ImageGrid from '../image-grid';
import { debounce } from 'lodash-es';

const ImageSearch = (props) => {
  const {
    assetTypes = ['image-asset'],
    excludedRef = null,
    excludeAllWithRefType = '',
    heightOffset = '212',
    innerRef = noop,
    onChangeQ = noop,
    refreshSearch = 0,
    selectedImages = [],
    onToggleUploader: handleToggleUploader,
    onSelectImage: handleSelectImage,
    nodeRef,
  } = props;
  // static propTypes = {
  //   assetTypes: PropTypes.arrayOf(PropTypes.string),
  //   // delegate: PropTypes.shape({
  //   //   handleSearch: PropTypes.func.isRequired,
  //   // )}.isRequired,
  //   excludeRef: PropTypes.instanceOf(NodeRef),
  //   excludeAllWithRefType: PropTypes.string,
  //   heightOffset: PropTypes.string,
  //   images: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
  //   innerRef: PropTypes.func,
  //   // isFulfilled: PropTypes.bool.isRequired,
  //   onChangeQ: PropTypes.func,
  //   onSelectImage: PropTypes.func.isRequired,
  //   onToggleUploader: PropTypes.func.isRequired,
  //   q: PropTypes.string,
  //   refreshSearch: PropTypes.number,
  //   // searchImagesRequestState: PropTypes.shape({
  //   //   request: PropTypes.instanceOf(Message),
  //   //   response: PropTypes.instanceOf(Message),
  //   //   status: PropTypes.string,
  //   // }).isRequired,
  //   selectedImages: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
  //   // statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
  // };

  let excludedRefType = '';
  if (excludedRef) {
    if (excludedRef.getQName().getMessage() === 'gallery') {
      excludedRefType = 'gallery_ref';
    } else {
      excludedRefType = 'linked_refs';
    }
  }

  const [ q, setQ ] = useState('');
  const [ page, setPage ] = useState(1);
  const [ requestCount, setRequestCount ] = useState(0);
  
  let queryAddon = '';
  if (excludedRef) {
    queryAddon += ` -${excludedRefType}:${excludedRef}`;
  }
  if (excludeAllWithRefType) {
    queryAddon += ` _missing_:${excludeAllWithRefType}`;
  }

  const request = useResolver('*:dam:request:search-assets-request', {
    initialData: {
      statuses: [NodeStatus.PUBLISHED, NodeStatus.SCHEDULED],
      count: 150,
      sort: SearchAssetsSort.CREATED_AT_DESC.getValue(),
      types: assetTypes,
      excludedRef,
      page,
      q: queryAddon,
    }
  });

  const { response, pbjxError, run } = useRequest(request, false);

  useEffect(() => {
    let q = '';
    if (excludedRef) {
      q += `-${excludedRefType}:${excludedRef.toString()} `;
    }
    if (excludeAllWithRefType !== '') {
      q += `_missing_:${excludeAllWithRefType} `;
    }

    handleSearch({ q });
  }, [ nodeRef ]);

  const handleSearch = ({ q }) => {
    let queryAddon = '';
    if (excludedRef) {
      queryAddon += ` -${excludedRefType}:${excludedRef}`;
    }
    if (excludeAllWithRefType) {
      queryAddon += ` _missing_:${excludeAllWithRefType}`;
    }

    console.log('Debug search', {
      q,
      queryAddon,
    });

    if (request) {
      request.set('q', `${q}${queryAddon}`);
      request.set('page', page);
    }
    
    run();
  };

  const handleChangeQ = ({ target: { value: q } }) => {
    setQ(q);
    handleSearch({ q });
    onChangeQ(q);
  };

  return (
    <>
      <Container fluid className="sticky-top px-4 py-2 shadow-depth-2 bg-white" key="container">
        <Form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <InputGroup size="sm">
            <Input
              className="form-control"
              innerRef={innerRef}
              name="q"
              onChange={debounce(handleChangeQ, 700)}
              placeholder="Search images..."
              type="search"
              // value={q}
            />
            <Button color="secondary" onClick={() => handleSearch()}>
              <Icon imgSrc="search" className="mr-0" />
            </Button>
          </InputGroup>
        </Form>
      </Container>
      <ScrollableContainer
        className="bg-gray-400"
        style={{ height: `calc(100vh - ${heightOffset}px)` }}
        key="scrollable_container"
      >
        {
          response && response.get('nodes') &&
          response.get('nodes').length ? (
            <ImageGrid
              nodes={response.get('nodes')}
              onSelectImage={handleSelectImage}
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
                  color="primary"
                ><Icon imgSrc="upload" size="xs" className="mr-1" /> upload
                </Button> new images.
              </p>
            </div>
          )
        }
        {(!response || pbjxError) && <Loading error={pbjxError} />}
      </ScrollableContainer>
    </>
  );
}

export default ImageSearch;
