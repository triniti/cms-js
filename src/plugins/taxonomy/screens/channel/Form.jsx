import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm } from 'redux-form';

import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields';
import AdvancedFields from '@triniti/cms/plugins/common/components/advanced-fields';
import ChannelFields from '@triniti/cms/plugins/taxonomy/components/channel-fields';
import CustomCodeFields from '@triniti/cms/plugins/common/components/custom-code-fields';
import History from '@triniti/cms/plugins/pbjx/components/history';
import Message from '@gdbots/pbj/Message';
import RawContent from '@triniti/cms/components/raw-content';
import SeoFields from '@triniti/cms/plugins/common/components/seo-fields';
import setBlocks from '@triniti/cms/plugins/blocksmith/utils/setBlocks';

import schemas from './schemas';

const Form = ({
  getNodeRequestState, node: channel, form, tab, isEditMode,
}) => {
  switch (tab) {
    case 'code':
      return schemas.node.hasMixin('triniti:common:mixin:custom-code') && <CustomCodeFields isEditMode={isEditMode} />;
    case 'seo':
      return schemas.node.hasMixin('triniti:common:mixin:seo') && <SeoFields isEditMode={isEditMode} />;
    case 'history':
      return (
        <History
          isEditMode={isEditMode}
          formName={form}
          node={channel}
          nodeRequest={getNodeRequestState.request}
          schema={schemas.getNodeHistoryRequest}
          setBlocks={setBlocks}
        />
      );
    case 'raw':
      return <RawContent pbj={channel} />;
    default:
      return (
        <div>
          <ChannelFields
            channel={channel}
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
  getNodeRequestState: PropTypes.shape({
    request: PropTypes.instanceOf(Message).isRequired,
  }).isRequired,
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
