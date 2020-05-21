import { reduxForm } from 'redux-form';
import AdvancedFields from '@triniti/cms/plugins/common/components/advanced-fields';
import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields';
import History from '@triniti/cms/plugins/pbjx/components/history';
import JwplayerMediaFields from '@triniti/cms/plugins/ovp/components/jwplayer-media-fields';
import KalturaEntryFields from '@triniti/cms/plugins/ovp/components/kaltura-entry-fields';
import Media from '@triniti/cms/plugins/dam/components/media';
import MediaLiveChannelFields from '@triniti/cms/plugins/ovp/components/medialive-channel-fields';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PropTypes from 'prop-types';
import RawContent from '@triniti/cms/components/raw-content';
import React from 'react';
import SeoFields from '@triniti/cms/plugins/common/components/seo-fields';
import StreamId from '@gdbots/schemas/gdbots/pbjx/StreamId';
import TaxonomyFields from '@triniti/cms/plugins/taxonomy/components/taxonomy-fields';
import VideoFields from '@triniti/cms/plugins/ovp/components/video-fields';

import schemas from './schemas';

const Form = ({ node: video, form, tab, isEditMode }) => {
  const nodeRef = NodeRef.fromNode(video);
  const streamId = StreamId.fromString(`video.history:${video.get('_id')}`);
  switch (tab) {
    case 'history':
      return <History isEditMode={isEditMode} formName={form} node={video} schema={schemas.getNodeHistoryRequest} streamId={streamId} />;

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
            && <KalturaEntryFields isEditMode={isEditMode} />
          }
          {
            schemas.node.hasMixin('triniti:ovp.jwplayer:mixin:has-media')
            && <JwplayerMediaFields isEditMode={isEditMode} />
          }
          {
            schemas.node.hasMixin('triniti:ovp.medialive:mixin:has-channel')
            && <MediaLiveChannelFields isEditMode={isEditMode} node={video} />
          }
          {
            schemas.node.hasMixin('triniti:common:mixin:advertising')
            && <AdvertisingFields isEditMode={isEditMode} />
          }
          {
            schemas.node.hasMixin('gdbots:common:mixin:taggable')
            && <AdvancedFields isEditMode={isEditMode} />
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
