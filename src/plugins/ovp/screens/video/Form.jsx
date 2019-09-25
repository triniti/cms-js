import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import StreamId from '@gdbots/schemas/gdbots/pbjx/StreamId';
import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields';
import AdvancedFields from '@triniti/cms/plugins/common/components/advanced-fields';
import History from '@triniti/cms/plugins/pbjx/components/history';
import Media from '@triniti/cms/plugins/dam/components/media';
import SeoFields from '@triniti/cms/plugins/common/components/seo-fields';
import RawContent from '@triniti/cms/components/raw-content';
import KalturaEntryFields from '@triniti/cms/plugins/ovp/components/kaltura-entry-fields';
import VideoFields from '@triniti/cms/plugins/ovp/components/video-fields';
import TaxonomyFields from '@triniti/cms/plugins/taxonomy/components/taxonomy-fields';

import schemas from './schemas';

const Form = ({ node: video, form, tab, isEditMode }) => {
  const nodeRef = NodeRef.fromNode(video);
  const streamId = StreamId.fromString(`video.history:${video.get('_id')}`);
  switch (tab) {
    case 'history':
      return <History schema={schemas.getNodeHistoryRequest} streamId={streamId} />;

    case 'media':
      return <Media nodeRef={nodeRef} />;

    case 'raw':
      return <RawContent pbj={video} />;

    case 'seo':
      return <SeoFields isEditMode={isEditMode} />;

    case 'taxonomy':
      return <TaxonomyFields schemas={schemas} isEditMode={isEditMode} />;

    default:
      return (
        <div>
          <VideoFields
            formName={form}
            isEditMode={isEditMode}
            schemas={schemas}
            video={video}
          />
          {
            schemas.node.hasMixin('triniti:ovp.kaltura:mixin:has-entry')
            && <KalturaEntryFields key="kaltura" isEditMode={isEditMode} />
          }
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
  form: PropTypes.string.isRequired,
  tab: PropTypes.string,
  isEditMode: PropTypes.bool,
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
