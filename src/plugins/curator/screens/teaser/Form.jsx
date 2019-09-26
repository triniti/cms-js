import PropTypes from 'prop-types';
import React from 'react';
import memoize from 'lodash/memoize';
import { reduxForm } from 'redux-form';

import createLazyComponent from '@triniti/admin-ui-plugin/components/createLazyComponent';
import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields';
import AdvancedFields from '@triniti/cms/plugins/common/components/advanced-fields';
import History from '@triniti/cms/plugins/pbjx/components/history';
import Message from '@gdbots/pbj/Message';
import RawContent from '@triniti/cms/components/raw-content';
import StreamId from '@gdbots/schemas/gdbots/pbjx/StreamId';
import TaxonomyFields from '@triniti/cms/plugins/taxonomy/components/taxonomy-fields';
import SeoFields from '@triniti/cms/plugins/common/components/seo-fields';

import schemas from './schemas';

// fixme: replace template literal
// const getFieldsComponent = memoize((type) => createLazyComponent(import(`@triniti/cms/plugins/curator/components/${type}-fields`)));

const Form = ({ node, tab, type, isEditMode }) => {
  const TeaserFields = type ? null : null;
  const streamId = StreamId.fromString(`${node.schema().getCurie().getMessage()}.history:${node.get('_id')}`);
  schemas.node = node.schema();

  switch (tab) {
    case 'history':
      return <History schema={schemas.getNodeHistoryRequest} streamId={streamId} />;

    case 'taxonomy':
      return <TaxonomyFields isEditMode={isEditMode} schemas={schemas} />;

    case 'seo':
      return schemas.node.hasMixin('triniti:common:mixin:seo') && (
        <SeoFields
          areLinkedImagesAllowed={false}
          isEditMode={isEditMode}
        />
      );

    case 'raw':
      return <RawContent pbj={node} />;

    default:
      return (
        <div>
          <TeaserFields isEditMode={isEditMode} node={node} schemas={schemas} />
          {
            schemas.node.hasMixin('triniti:common:mixin:advertising')
            && <AdvertisingFields key="ad-fields" isEditMode={isEditMode} />
          }
          {
            schemas.node.hasMixin('gdbots:common:mixin:taggable')
            && <AdvancedFields key="advanced-fields" isEditMode={isEditMode} />
          }
        </div>
      );
  }
};

Form.propTypes = {
  tab: PropTypes.string,
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  type: PropTypes.string.isRequired,
};

Form.defaultProps = {
  tab: 'details',
  isEditMode: true,
};

export default reduxForm({
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: false,
})(Form);
