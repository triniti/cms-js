import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm } from 'redux-form';

import AdvancedFields from '@triniti/cms/plugins/common/components/advanced-fields';
import History from '@triniti/cms/plugins/pbjx/components/history';
import RawContent from '@triniti/cms/components/raw-content';
import SponsorFields from '@triniti/cms/plugins/boost/components/sponsor-fields';
import Message from '@gdbots/pbj/Message';

import schemas from './schemas';

const Form = ({ form, node: sponsor, tab, isEditMode }) => {
  switch (tab) {
    case 'history':
      return <History isEditMode={isEditMode} formName={form} node={sponsor} schema={schemas.getNodeHistoryRequest} />;
    case 'raw':
      return <RawContent pbj={sponsor} />;
    default:
      return (
        <div>
          <SponsorFields sponsor={sponsor} isEditMode={isEditMode} schemas={schemas} />
          {schemas.node.hasMixin('gdbots:common:mixin:taggable')
          && <AdvancedFields key="advanced-fields" isEditMode={isEditMode} />}
        </div>
      );
  }
};

Form.propTypes = {
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
