import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm } from 'redux-form';

import AdvancedFields from '@triniti/cms/plugins/common/components/advanced-fields';
import History from '@triniti/cms/plugins/pbjx/components/history';
import RawContent from '@triniti/cms/components/raw-content';
import SponsorFields from '@triniti/cms/plugins/boost/components/sponsor-fields';
import Message from '@gdbots/pbj/Message';
import StreamId from '@gdbots/schemas/gdbots/pbjx/StreamId';

import schemas from './schemas';

const Form = ({ node: sponsor, tab, isEditMode }) => {
  const streamId = StreamId.fromString(`sponsor.history:${sponsor.get('_id')}`);
  switch (tab) {
    case 'history':
      return <History schema={schemas.getNodeHistoryRequest} streamId={streamId} />;
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
