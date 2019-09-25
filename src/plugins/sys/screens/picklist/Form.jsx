import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import Message from '@gdbots/pbj/Message';
import StreamId from '@gdbots/schemas/gdbots/pbjx/StreamId';

import RawContent from '@triniti/cms/components/raw-content';
import History from '@triniti/cms/plugins/pbjx/components/history';
import PicklistFields from '../../components/picklist-fields';

import schemas from './schemas';

const Form = ({ node: picklist, tab, isEditMode }) => {
  const streamId = StreamId.fromString(`picklist.history:${picklist.get('_id')}`);
  switch (tab) {
    case 'history':
      return <History schema={schemas.getNodeHistory} streamId={streamId} />;
    case 'raw':
      return <RawContent pbj={picklist} />;
    default:
      return <PicklistFields isEditMode={isEditMode} />;
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
  enableReinitialize: true,
  keepDirtyOnReinitialize: false,
})(Form);
