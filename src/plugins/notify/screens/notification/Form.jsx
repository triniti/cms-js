import memoize from 'lodash/memoize';
import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm } from 'redux-form';

import createLazyComponent from '@triniti/admin-ui-plugin/components/createLazyComponent';
import History from '@triniti/cms/plugins/pbjx/components/history';
import Message from '@gdbots/pbj/Message';
import RawContent from '@triniti/cms/components/raw-content';
import StreamId from '@gdbots/schemas/gdbots/pbjx/StreamId';

import schemas from './schemas';

// fixme: replace template literall
// const getFieldComponent = memoize((type) => createLazyComponent(
//   import(`@triniti/cms/plugins/notify/components/${type}-fields`),
// ));
const getFieldComponent = () => null;

const Form = ({ node, getNode, tab, type, isEditMode, showDatePicker }) => {
  const streamId = StreamId.fromString(
    `${node.schema().getCurie().getMessage()}.history:${node.get('_id')}`,
  );
  const Fields = type && getFieldComponent(type);

  switch (tab) {
    case 'history':
      return <History schema={schemas.getNodeHistoryRequest} streamId={streamId} />;

    case 'raw':
      return <RawContent pbj={node} />;

    default:
      return (
        <>
          {type
            ? (
              <Fields
                app={getNode(node.get('app_ref'))}
                content={getNode(node.get('content_ref'))}
                isEditMode={isEditMode}
                node={node}
                showDatePicker={showDatePicker}
              />
            ) : `cannot load fields component since ${type} is passed for notification type value`}
        </>
      );
  }
};

Form.propTypes = {
  getNode: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  showDatePicker: PropTypes.bool,
  tab: PropTypes.string,
  type: PropTypes.string.isRequired,
};

Form.defaultProps = {
  isEditMode: true,
  showDatePicker: false,
  tab: 'details',
};

export default reduxForm()(Form);
