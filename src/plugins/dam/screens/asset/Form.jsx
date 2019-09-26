import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'lodash/memoize';
import { reduxForm } from 'redux-form';

import createLazyComponent from '@triniti/admin-ui-plugin/components/createLazyComponent';
import History from '@triniti/cms/plugins/pbjx/components/history';
import Message from '@gdbots/pbj/Message';
import RawContent from '@triniti/cms/components/raw-content';
import StreamId from '@gdbots/schemas/gdbots/pbjx/StreamId';
import TaxonomyFields from '@triniti/cms/plugins/taxonomy/components/taxonomy-fields';

import schemas from './schemas';

// fixme: replace template literal
// const getFieldsComponent = memoize((type) => createLazyComponent(import(`@triniti/cms/plugins/dam/components/${type}-fields`)));

const Form = ({ node: asset, tab, isEditMode, type }) => {
  const AssetFields = type ? null : null;
  const streamId = StreamId.fromString(`${asset.schema().getCurie().getMessage()}.history:${asset.get('_id')}`);
  const Variants = createLazyComponent(import('@triniti/cms/plugins/dam/components/variants'));
  schemas.node = schemas.nodes.find((schema) => schema.getCurie().getMessage() === type);

  const { getNodeHistoryRequest } = schemas;
  schemas.node = asset.schema();

  switch (tab) {
    case 'variants':
      return <Variants asset={asset} type={type} />;

    case 'taxonomy':
      return <TaxonomyFields isEditMode={isEditMode} schemas={schemas} />;

    case 'history':
      return <History schema={getNodeHistoryRequest} streamId={streamId} />;

    case 'raw':
      return <RawContent pbj={asset} />;

    default:
      return <AssetFields asset={asset} isEditMode={isEditMode} schemas={schemas} />;
  }
};

Form.propTypes = {
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  tab: PropTypes.string,
  type: PropTypes.string.isRequired,
};

Form.defaultProps = {
  tab: '',
  isEditMode: false,
};

export default reduxForm({
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: false,
})(Form);
