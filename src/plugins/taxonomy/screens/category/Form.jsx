import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm } from 'redux-form';

import CategoryFields from '@triniti/cms/plugins/taxonomy/components/category-fields';
import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields';
import AdvancedFields from '@triniti/cms/plugins/common/components/advanced-fields';
import CustomCodeFields from '@triniti/cms/plugins/common/components/custom-code-fields';
import History from '@triniti/cms/plugins/pbjx/components/history';
import Message from '@gdbots/pbj/Message';
import RawContent from '@triniti/cms/components/raw-content';
import SeoFields from '@triniti/cms/plugins/common/components/seo-fields';
import StreamId from '@gdbots/schemas/gdbots/pbjx/StreamId';

import schemas from './schemas';

const Form = ({
  node: category, form, tab, isEditMode,
}) => {
  const streamId = StreamId.fromString(`category.history:${category.get('_id')}`);
  switch (tab) {
    case 'code':
      return schemas.node.hasMixin('triniti:common:mixin:custom-code') && <CustomCodeFields isEditMode={isEditMode} />;
    case 'seo':
      return schemas.node.hasMixin('triniti:common:mixin:seo') && <SeoFields isEditMode={isEditMode} />;
    case 'history':
      return <History schema={schemas.getNodeHistoryRequest} streamId={streamId} />;
    case 'raw':
      return <RawContent pbj={category} />;
    default:
      return (
        <div>
          <CategoryFields
            category={category}
            formName={form}
            isEditMode={isEditMode}
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
  form: PropTypes.string.isRequired,
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  tab: PropTypes.string,
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
