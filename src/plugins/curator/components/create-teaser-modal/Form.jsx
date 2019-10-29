import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import createLazyComponent from '@triniti/admin-ui-plugin/components/createLazyComponent';
import { Card, CardBody } from '@triniti/admin-ui-plugin/components';
import { reduxForm, Field } from 'redux-form';
import SelectField from '@triniti/cms/components/select-field';
import schemas from './schemas';

const typeOptions = schemas.nodes.map((schema) => ({
  label: schema.getCurie().getMessage().replace(/(-|teaser)/g, ' '),
  value: schema.getCurie().getMessage(),
}));

const teaserFieldsComponents = {};
/**
 * Stores components because otherwise redux form loses focus as you type.
 *
 * @link https://stackoverflow.com/questions/39839051/using-redux-form-im-losing-focus-after-typing-the-first-character
 *
 * This cannot use template literals or other expressions because of the module resolver.
 *
 * @link https://github.com/tleunen/babel-plugin-module-resolver/issues/291
 *
 * @param {string} type
 */
const getFieldsComponent = (type) => {
  if (teaserFieldsComponents[type]) {
    return teaserFieldsComponents[type];
  }
  switch (type) {
    case 'article-teaser':
      teaserFieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/create-article-teaser-fields'));
      break;
    case 'asset-teaser':
      teaserFieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/create-asset-teaser-fields'));
      break;
    case 'category-teaser':
      teaserFieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/create-category-teaser-fields'));
      break;
    case 'channel-teaser':
      teaserFieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/create-channel-teaser-fields'));
      break;
    case 'gallery-teaser':
      teaserFieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/create-gallery-teaser-fields'));
      break;
    case 'link-teaser':
      teaserFieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/create-link-teaser-fields'));
      break;
    case 'page-teaser':
      teaserFieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/create-page-teaser-fields'));
      break;
    case 'person-teaser':
      teaserFieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/create-person-teaser-fields'));
      break;
    case 'poll-teaser':
      teaserFieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/create-poll-teaser-fields'));
      break;
    case 'timeline-teaser':
      teaserFieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/create-timeline-teaser-fields'));
      break;
    case 'video-teaser':
      teaserFieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/create-video-teaser-fields'));
      break;
    case 'youtube-video-teaser':
      teaserFieldsComponents[type] = createLazyComponent(import('@triniti/cms/plugins/curator/components/create-youtube-video-teaser-fields'));
      break;
    default:
      return null;
  }
  return teaserFieldsComponents[type];
};

const Form = ({ formValues, onKeyDown: handleKeyDown, onReset: handleReset }) => {
  const type = get(formValues, 'type.value');
  const FieldsComponent = type ? getFieldsComponent(type) : null;
  return (
    <Card>
      <CardBody indent>
        <Field name="type" component={SelectField} label="type" options={typeOptions} onChange={handleReset} />
        {
          FieldsComponent && <FieldsComponent onKeyDown={handleKeyDown} />
        }
      </CardBody>
    </Card>
  );
};

Form.propTypes = {
  formValues: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onKeyDown: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

Form.defaultProps = {
  formValues: null,
};

export default reduxForm({ forceUnregisterOnUnmount: true })(Form);
