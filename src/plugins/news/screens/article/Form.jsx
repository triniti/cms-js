import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm } from 'redux-form';
import { EditorState } from 'draft-js';

import AdvancedFields from '@triniti/cms/plugins/common/components/advanced-fields';
import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields';
import AppleNewsFields from '@triniti/cms/plugins/news/components/apple-news-fields';
import ArticleFields from '@triniti/cms/plugins/news/components/article-fields';
import Blocksmith from '@triniti/cms/plugins/blocksmith/components/blocksmith';
import HasNotificationsTable from '@triniti/cms/plugins/notify/components/has-notifications-table';
import HeadlineFragmentsFields
  from '@triniti/cms/plugins/news/components/headline-fragments-fields';
import History from '@triniti/cms/plugins/pbjx/components/history';
import Media from '@triniti/cms/plugins/dam/components/media';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import RawContent from '@triniti/cms/components/raw-content';
import SeoFields from '@triniti/cms/plugins/common/components/seo-fields';
import StoryFields from '@triniti/cms/plugins/news/components/story-fields';
import StreamId from '@gdbots/schemas/gdbots/pbjx/StreamId';
import TaxonomyFields from '@triniti/cms/plugins/taxonomy/components/taxonomy-fields';

import schemas from './schemas';

const Form = ({ node: article, blocksmithState, form, isEditMode, tab }) => {
  const nodeRef = NodeRef.fromNode(article);
  const streamId = StreamId.fromString(`article.history:${article.get('_id')}`);

  switch (tab) {
    case 'details':
      return (
        <>
          <ArticleFields isEditMode={isEditMode} article={article} schemas={schemas} />
          {
            schemas.node.hasMixin('triniti:common:mixin:advertising')
            && <AdvertisingFields isEditMode={isEditMode} />
          }
          {
            schemas.node.hasMixin('gdbots:common:mixin:taggable')
            && <AdvancedFields isEditMode={isEditMode} />
          }
        </>
      );

    case 'taxonomy':
      return <TaxonomyFields isEditMode={isEditMode} schemas={schemas} />;

    case 'seo':
      return schemas.node.hasMixin('triniti:common:mixin:seo')
        && <SeoFields isEditMode={isEditMode} />;

    case 'notifications':
      return (
        <>
          {schemas.node.hasMixin('triniti:notify:mixin:has-notifications') && (
            <HasNotificationsTable contentRef={nodeRef} />
          )}
          <AppleNewsFields article={article} isEditMode={isEditMode} />
        </>
      );

    case 'media':
      return <Media nodeRef={nodeRef} />;

    case 'history':
      return <History schema={schemas.getNodeHistoryRequest} streamId={streamId} />;

    case 'raw':
      return <RawContent pbj={article} />;

    default:
      return (
        <div>
          <StoryFields
            formName={form}
            isEditMode={isEditMode}
            nodeRef={nodeRef}
            schemas={schemas}
          />
          {
            schemas.node.hasMixin('triniti:news:mixin:headline-fragments')
            && <HeadlineFragmentsFields isEditMode={isEditMode} />
          }
          <Blocksmith
            blocksmithState={blocksmithState}
            formName={form}
            isEditMode={isEditMode}
            node={article}
          />
        </div>
      );
  }
};

Form.propTypes = {
  blocksmithState: PropTypes.shape({
    editorState: PropTypes.instanceOf(EditorState),
    isDirty: PropTypes.bool.isRequired,
  }),
  form: PropTypes.string.isRequired,
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  tab: PropTypes.string,
};

Form.defaultProps = {
  blocksmithState: null,
  isEditMode: true,
  tab: '',
};

export default reduxForm({
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: false, // important to set this here to force reinitialization
})(Form);
