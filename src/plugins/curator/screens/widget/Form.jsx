import { reduxForm } from 'redux-form';
import AdvancedFields from '@triniti/cms/plugins/common/components/advanced-fields';
import createLazyComponent from '@triniti/admin-ui-plugin/components/createLazyComponent';
import History from '@triniti/cms/plugins/pbjx/components/history';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import RawContent from '@triniti/cms/components/raw-content';
import React from 'react';
import StreamId from '@gdbots/schemas/gdbots/pbjx/StreamId';
import WidgetCodeFields from '@triniti/cms/plugins/curator/components/widget-code-fields';
import WidgetHasSearchRequestFields from '@triniti/cms/plugins/curator/components/widget-has-search-request-fields';
import schemas from './schemas';

/**
 * This cannot use template literals or other expressions because of the module resolver.
 *
 * @link https://github.com/tleunen/babel-plugin-module-resolver/issues/291
 *
 * @param {string} type
 */
const getFieldsComponent = (type) => {
  switch (type) {
    case 'ad-widget':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/ad-widget-fields'));
    case 'alert-widget':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/alert-widget-fields'));
    case 'blogroll-widget':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/blogroll-widget-fields'));
    case 'carousel-widget':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/carousel-widget-fields'));
    case 'code-widget':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/code-widget-fields'));
    case 'gallery-widget':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/gallery-widget-fields'));
    case 'gridler-widget':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/gridler-widget-fields'));
    case 'hero-bar-widget':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/hero-bar-widget-fields'));
    case 'media-list-widget':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/media-list-widget-fields'));
    case 'playlist-widget':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/playlist-widget-fields'));
    case 'showtimes-widget':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/showtimes-widget-fields'));
    case 'slider-widget':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/slider-widget-fields'));
    case 'spotlight-widget':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/spotlight-widget-fields'));
    case 'tag-cloud-widget':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/tag-cloud-widget-fields'));
    case 'tetris-widget':
      return createLazyComponent(import('@triniti/cms/plugins/curator/components/tetris-widget-fields'));
    default:
      return null;
  }
};

const Form = ({ form, isEditMode, node, tab, type }) => {
  const WidgetFields = type ? getFieldsComponent(type) : null;
  const streamId = StreamId.fromString(`${node.schema().getCurie().getMessage()}.history:${node.get('_id')}`);
  schemas.node = node.schema();

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
