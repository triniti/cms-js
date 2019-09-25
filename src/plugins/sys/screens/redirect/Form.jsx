import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

import Message from '@gdbots/pbj/Message';
import StreamId from '@gdbots/schemas/gdbots/pbjx/StreamId';
import History from '@triniti/cms/plugins/pbjx/components/history';
import RedirectFields from '@triniti/cms/plugins/sys/components/redirect-fields';
import RawContent from '@triniti/cms/components/raw-content';

import schemas from './schemas';

const Form = ({
  node: redirect, tab, isEditMode,
}) => {
  const streamId = StreamId.fromString(`redirect.history:${redirect.get('_id')}`);
  switch (tab) {
    case 'details':
      return (
        <RedirectFields
          redirect={redirect}
          isEditMode={isEditMode}
        />
      );
    case 'history':
      return <History schema={schemas.getNodeHistoryRequest} streamId={streamId} />;
    case 'raw':
      return <RawContent pbj={redirect} />;
    default:
      return (
        <RedirectFields
          redirect={redirect}
          isEditMode={isEditMode}
        />
      );
  }
};

Form.propTypes = {
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  tab: PropTypes.string,
};

Form.defaultProps = {
  isEditMode: false,
  tab: '',
};

export default reduxForm({
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: false,
})(Form);
