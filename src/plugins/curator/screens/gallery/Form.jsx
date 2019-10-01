import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields';
import AdvancedFields from '@triniti/cms/plugins/common/components/advanced-fields';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import StreamId from '@gdbots/schemas/gdbots/pbjx/StreamId';
import RawContent from '@triniti/cms/components/raw-content';
import SeoFields from '@triniti/cms/plugins/common/components/seo-fields';
import TaxonomyFields from '@triniti/cms/plugins/taxonomy/components/taxonomy-fields';
import CustomCodeFields from '@triniti/cms/plugins/common/components/custom-code-fields';
import GalleryFields from '@triniti/cms/plugins/curator/components/gallery-fields';
import History from '@triniti/cms/plugins/pbjx/components/history';

import GalleryMedia from '../../components/gallery-media';
import schemas from './schemas';

const Form = ({ node: gallery, form, isEditMode, tab }) => {
  const streamId = StreamId.fromString(`gallery.history:${gallery.get('_id')}`);
  switch (tab) {
    case 'taxonomy':
      return <TaxonomyFields isEditMode={isEditMode} schemas={schemas} />;

    case 'code':
      return schemas.node.hasMixin('triniti:common:mixin:custom-code') && <CustomCodeFields isEditMode={isEditMode} />;

    case 'seo':
      return schemas.node.hasMixin('triniti:common:mixin:seo') && <SeoFields isEditMode={isEditMode} />;

    case 'media':
      return <GalleryMedia nodeRef={NodeRef.fromNode(gallery)} isEditMode={isEditMode} />;

    case 'history':
      return <History schema={schemas.getNodeHistoryRequest} streamId={streamId} />;

    case 'raw':
      return <RawContent pbj={gallery} />;

    default:
      return (
        <div>
          <GalleryFields
            isEditMode={isEditMode}
            gallery={gallery}
            nodeRef={gallery.get('_id').toNodeRef()}
            formName={form}
            schemas={schemas}
          />
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
  node: PropTypes.instanceOf(Message).isRequired,
  isEditMode: PropTypes.bool,
  tab: PropTypes.string,
  form: PropTypes.string.isRequired,
};

Form.defaultProps = {
  isEditMode: true,
  tab: '',
};

export default reduxForm({
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: false,
})(Form);
