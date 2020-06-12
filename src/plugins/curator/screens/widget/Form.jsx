import { reduxForm } from 'redux-form';
import AdvancedFields from '@triniti/cms/plugins/common/components/advanced-fields';
import createLazyComponent from '@triniti/admin-ui-plugin/components/createLazyComponent';
import History from '@triniti/cms/plugins/pbjx/components/history';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import RawContent from '@triniti/cms/components/raw-content';
import React, { useEffect } from 'react';
import WidgetCodeFields from '@triniti/cms/plugins/curator/components/widget-code-fields';
import WidgetHasSearchRequestFields from '@triniti/cms/plugins/curator/components/widget-has-search-request-fields';
import setBlocks from '@triniti/cms/plugins/blocksmith/utils/setBlocks';
import schemas from './schemas';

/**
 * This cannot use template literals or other expressions because of the module resolver.
 *
 * @link https://github.com/tleunen/babel-plugin-module-resolver/issues/291
 *
 * @param {string} type
 */
let fieldsComponents = {};
const getFieldsComponent = (type) => {
  if (fieldsComponents[type]) {
    return fieldsComponents[type];
  }
  switch (type) {
    case 'ad-widget':
      fieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/ad-widget-fields'));
      break;
    case 'alert-widget':
      fieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/alert-widget-fields'));
      break;
    case 'blogroll-widget':
      fieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/blogroll-widget-fields'));
      break;
    case 'carousel-widget':
      fieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/carousel-widget-fields'));
      break;
    case 'code-widget':
      fieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/code-widget-fields'));
      break;
    case 'gallery-widget':
      fieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/gallery-widget-fields'));
      break;
    case 'gridler-widget':
      fieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/gridler-widget-fields'));
      break;
    case 'hero-bar-widget':
      fieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/hero-bar-widget-fields'));
      break;
    case 'media-list-widget':
      fieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/media-list-widget-fields'));
      break;
    case 'playlist-widget':
      fieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/playlist-widget-fields'));
      break;
    case 'showtimes-widget':
      fieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/showtimes-widget-fields'));
      break;
    case 'slider-widget':
      fieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/slider-widget-fields'));
      break;
    case 'spotlight-widget':
      fieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/spotlight-widget-fields'));
      break;
    case 'tag-cloud-widget':
      fieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/tag-cloud-widget-fields'));
      break;
    case 'tetris-widget':
      fieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/tetris-widget-fields'));
      break;
    default:
      break;
  }
  return fieldsComponents[type];
};

const Form = ({ form, isEditMode, node, tab, type }) => {
  useEffect(() => () => { fieldsComponents = {}; }, []);
  const WidgetFields = type ? getFieldsComponent(type) : null;
  schemas.node = node.schema();

  switch (tab) {
    case 'history':
      return (
        <History
          isEditMode={isEditMode}
          formName={form}
          node={node}
          schema={schemas.getNodeHistoryRequest}
          setBlocks={setBlocks}
        />
      );
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
