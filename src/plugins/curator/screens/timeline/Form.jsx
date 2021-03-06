import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm } from 'redux-form';

import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields';
import AdvancedFields from '@triniti/cms/plugins/common/components/advanced-fields';
import Message from '@gdbots/pbj/Message';
import SeoFields from '@triniti/cms/plugins/common/components/seo-fields';
import History from '@triniti/cms/plugins/pbjx/components/history';
import RawContent from '@triniti/cms/components/raw-content';
import CustomCodeFields from '@triniti/cms/plugins/common/components/custom-code-fields';
import TimelineFields from '@triniti/cms/plugins/curator/components/timeline-fields';
import TaxonomyFields from '@triniti/cms/plugins/taxonomy/components/taxonomy-fields';

import schemas from './schemas';

const Form = ({ form, getNodeRequestState, node, tab, isEditMode }) => {
  switch (tab) {
    case 'seo':
      return schemas.node.hasMixin('triniti:common:mixin:seo') && (
        <SeoFields
          areLinkedImagesAllowed={false}
          isEditMode={isEditMode}
        />
      );
    case 'taxonomy':
      return <TaxonomyFields isEditMode={isEditMode} schemas={schemas} />;
    case 'code':
      return <CustomCodeFields isEditMode={isEditMode} />;
    case 'history':
      return (
        <History
          isEditMode={isEditMode}
          formName={form}
          node={node}
          nodeRequest={getNodeRequestState.request}
          schema={schemas.getNodeHistoryRequest}
        />
      );
    case 'raw':
      return <RawContent pbj={node} />;
    default:
      return (
        <div>
          <TimelineFields
            formName={form}
            isEditMode={isEditMode}
            node={node}
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
  getNodeRequestState: PropTypes.shape({
    request: PropTypes.instanceOf(Message).isRequired,
  }).isRequired,
  tab: PropTypes.string,
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
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
