import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm } from 'redux-form';

import AdvancedFields from '@triniti/cms/plugins/common/components/advanced-fields';
import History from '@triniti/cms/plugins/pbjx/components/history';
import Message from '@gdbots/pbj/Message';
import PromotionCodeFields from '@triniti/cms/plugins/curator/components/promotion-code-fields';
import PromotionDetailsFields from '@triniti/cms/plugins/curator/components/promotion-details-fields';
import PromotionScheduleFields from '@triniti/cms/plugins/curator/components/promotion-schedule-fields';
import RawContent from '@triniti/cms/components/raw-content';

import schemas from './schemas';

const Form = ({ form, getNodeRequestState, node, tab, isEditMode }) => {
  switch (tab) {
    case 'schedule':
      return <PromotionScheduleFields isEditMode={isEditMode} formName={form} />;
    case 'code':
      return <PromotionCodeFields isEditMode={isEditMode} />;
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
          <PromotionDetailsFields isEditMode={isEditMode} schemas={schemas} />
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
  enableReinitialize: true,
  forceUnregisterOnUnmount: true,
  keepDirtyOnReinitialize: false,
})(Form);
