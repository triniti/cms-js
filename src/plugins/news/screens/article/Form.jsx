import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm } from 'redux-form';
import { EditorState } from 'draft-js';

import AdvancedFields from '@triniti/cms/plugins/common/components/advanced-fields';
import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields';
import ArticleNotificationFields from '@triniti/cms/plugins/news/components/article-notification-fields';
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
import TaxonomyFields from '@triniti/cms/plugins/taxonomy/components/taxonomy-fields';
import setBlocks from '@triniti/cms/plugins/blocksmith/utils/setBlocks';

import schemas from './schemas';

const Form = ({
  node: article,
  blocksmithState,
  form,
  formValues,
  getNodeRequestState,
  isEditMode,
  tab,
}) => {
  const nodeRef = NodeRef.fromNode(article);

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
          <ArticleNotificationFields article={article} isEditMode={isEditMode} />
        </>
      );

    case 'media':
      return <Media nodeRef={nodeRef} />;

    case 'history':
      return (
        <History
          isEditMode={isEditMode}
          formName={form}
          node={article}
          nodeRequest={getNodeRequestState.request}
          schema={schemas.getNodeHistoryRequest}
          setBlocks={setBlocks}
        />
      );

    case 'raw':
      return <RawContent pbj={article} />;

    default:
      return (
        <div>
          <StoryFields
            formName={form}
            formValues={formValues}
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
  formValues: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  getNodeRequestState: PropTypes.shape({
    request: PropTypes.instanceOf(Message).isRequired,
  }).isRequired,
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  tab: PropTypes.string,
};

Form.defaultProps = {
  blocksmithState: null,
  formValues: {},
  isEditMode: true,
  tab: '',
};

export default reduxForm({
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: false, // important to set this here to force reinitialization
})(Form);
