import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import memoize from 'lodash/memoize';
import { reduxForm } from 'redux-form';
import AdvancedFields from '@triniti/cms/plugins/common/components/advanced-fields';
import createLazyComponent from '@triniti/admin-ui-plugin/components/createLazyComponent';
import History from '@triniti/cms/plugins/pbjx/components/history';
import Message from '@gdbots/pbj/Message';
import RawContent from '@triniti/cms/components/raw-content';
import StreamId from '@gdbots/schemas/gdbots/pbjx/StreamId';
import WidgetCodeFields from '@triniti/cms/plugins/curator/components/widget-code-fields';
import WidgetHasSearchRequestFields from '@triniti/cms/plugins/curator/components/widget-has-search-request-fields';
import schemas from './schemas';

const getFieldsComponent = memoize((type) => createLazyComponent(import(`@triniti/cms/plugins/curator/components/${type}-fields`)));
const getNodeSchema = memoize((type, node) => node.schema());

const Form = ({ form, isEditMode, node, tab, type }) => {
  const WidgetFields = type ? getFieldsComponent(type) : null;
  const streamId = StreamId.fromString(`${node.schema().getCurie().getMessage()}.history:${node.get('_id')}`);
  schemas.node = getNodeSchema(type, node);

  switch (tab) {
    case 'history':
      return <History schema={schemas.getNodeHistoryRequest} streamId={streamId} />;
    case 'raw':
      return <RawContent pbj={node} />;
    case 'code':
      return <WidgetCodeFields isEditMode={isEditMode} />;
    case 'data-source':
      return schemas.node.hasMixin('triniti:curator:mixin:widget-has-search-request')
      && <WidgetHasSearchRequestFields formName={form} isEditMode={isEditMode} />;
    default:
      return (
        <>
          <WidgetFields formName={form} isEditMode={isEditMode} node={node} type={type} />
          {schemas.node.hasMixin('gdbots:common:mixin:taggable')
            && <AdvancedFields key="advanced-fields" isEditMode={isEditMode} />}
        </>
      );
  }
};

Form.propTypes = {
  form: PropTypes.string.isRequired,
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  tab: PropTypes.string,
  type: PropTypes.string.isRequired,
};

Form.defaultProps = {
  isEditMode: true,
  tab: 'details',
};

export default reduxForm({
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: false,
})(Form);
