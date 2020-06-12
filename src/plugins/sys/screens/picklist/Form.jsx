import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import Message from '@gdbots/pbj/Message';

import RawContent from '@triniti/cms/components/raw-content';
import History from '@triniti/cms/plugins/pbjx/components/history';
import setBlocks from '@triniti/cms/plugins/blocksmith/utils/setBlocks';
import PicklistFields from '../../components/picklist-fields';

import schemas from './schemas';

const Form = ({ form, node: picklist, tab, isEditMode }) => {
  switch (tab) {
    case 'history':
      return (
        <History
          isEditMode={isEditMode}
          formName={form}
          node={picklist}
          schema={schemas.getNodeHistory}
          setBlocks={setBlocks}
        />
      );
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
