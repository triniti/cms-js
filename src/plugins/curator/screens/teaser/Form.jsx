import { reduxForm } from 'redux-form';
import AdvancedFields from '@triniti/cms/plugins/common/components/advanced-fields';
import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields';
import createLazyComponent from '@triniti/admin-ui-plugin/components/createLazyComponent';
import History from '@triniti/cms/plugins/pbjx/components/history';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import RawContent from '@triniti/cms/components/raw-content';
import React, { useState } from 'react';
import SeoFields from '@triniti/cms/plugins/common/components/seo-fields';
import StreamId from '@gdbots/schemas/gdbots/pbjx/StreamId';
import TaxonomyFields from '@triniti/cms/plugins/taxonomy/components/taxonomy-fields';
import schemas from './schemas';

/**
 * This cannot use template literals or other expressions because of the module resolver.
 *
 * @link https://github.com/tleunen/babel-plugin-module-resolver/issues/291
 *
 * @param {string} type
 */
const getFieldsComponent = (type) => {
  switch (type) {
    case 'article-teaser':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/article-teaser-fields'));
    case 'asset-teaser':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/asset-teaser-fields'));
    case 'category-teaser':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/category-teaser-fields'));
    case 'channel-teaser':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/channel-teaser-fields'));
    case 'gallery-teaser':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/gallery-teaser-fields'));
    case 'link-teaser':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/link-teaser-fields'));
    case 'page-teaser':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/page-teaser-fields'));
    case 'person-teaser':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/person-teaser-fields'));
    case 'poll-teaser':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/poll-teaser-fields'));
    case 'timeline-teaser':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/timeline-teaser-fields'));
    case 'video-teaser':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/video-teaser-fields'));
    case 'youtube-video-teaser':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/youtube-video-teaser-fields'));
    default:
      return null;
  }
};

const Form = ({ form, node, tab, type, isEditMode }) => {
  const [TeaserFields, setTeaserFields] = useState(null);
  const streamId = StreamId.fromString(`${node.schema().getCurie().getMessage()}.history:${node.get('_id')}`);
  schemas.node = node.schema();

  switch (tab) {
    case 'history':
      return <History isEditMode={isEditMode} formName={form} schema={schemas.getNodeHistoryRequest} streamId={streamId} />;

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
      if (!TeaserFields && type) {
        setTeaserFields(() => getFieldsComponent(type));
      }
      return (
        <div>
          {TeaserFields && <TeaserFields isEditMode={isEditMode} node={node} schemas={schemas} />}
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
