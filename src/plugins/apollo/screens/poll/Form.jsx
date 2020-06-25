import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm } from 'redux-form';

import AdvancedFields from '@triniti/cms/plugins/common/components/advanced-fields';
import History from '@triniti/cms/plugins/pbjx/components/history';
import Message from '@gdbots/pbj/Message';
import PollFields from '@triniti/cms/plugins/apollo/components/poll-fields';
import RawContent from '@triniti/cms/components/raw-content';
import TaxonomyFields from '@triniti/cms/plugins/taxonomy/components/taxonomy-fields';

import schemas from './schemas';

const Form = ({ isEditMode, form, node, tab }) => {
  switch (tab) {
    case 'history':
      return (
        <History
          isEditMode={isEditMode}
          formName={form}
          node={node}
          schema={schemas.getNodeHistoryRequest}
        />
      );
    case 'raw':
      return <RawContent pbj={node} />;
    case 'taxonomy':
      return <TaxonomyFields isEditMode={isEditMode} schemas={schemas} />;
    case 'details':
    default:
      return (
        <>
          <PollFields isEditMode={isEditMode} node={node} schemas={schemas} />
          {schemas.node.hasMixin('gdbots:common:mixin:taggable')
              && <AdvancedFields key="advanced-fields" isEditMode={isEditMode} />}
        </>
      );
  }
};

Form.propTypes = {
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  tab: PropTypes.string,
};

Form.defaultProps = {
  isEditMode: true,
  tab: '',
};

export default reduxForm({
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: false,
})(Form);
