import get from 'lodash/get';
import memoize from 'lodash/memoize';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import CheckboxField from '@triniti/cms/components/checkbox-field';
import Message from '@gdbots/pbj/Message';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field';
import PicklistPickerField from '@triniti/cms/plugins/sys/components/picklist-picker-field';
import TextareaField from '@triniti/cms/components/textarea-field';
import TextField from '@triniti/cms/components/text-field';
import selector from './selector';

const hasThemeableMixin = memoize((type, node) => node.schema().hasMixin('triniti:common:mixin:themeable'));

const ShowtimesWidgetFields = ({ formValues, isEditMode, node, type }) => (
  <Card>
    <CardHeader>Options</CardHeader>
    <CardBody indent>
      <Field readOnly={!isEditMode} name="title" component={TextField} label="Title" placeholder="Enter Title" size="xlg" />
      <Field
        component={PicklistPickerField}
        isEditMode={isEditMode}
        label="Show"
        name="show"
        picklistId="video-shows"
      />
      <Field
        component={TextField}
        label="Headline"
        name="headline"
        placeholder="Enter headline"
        readOnly={!isEditMode}
      />
      <Field
        component={TextareaField}
        label="Excerpt"
        name="excerpt"
        placeholder="Enter excerpt"
        readOnly={!isEditMode}
      />
      <Field
        component={ImageAssetPickerField}
        isEditMode={isEditMode}
        label="Image"
        name="imageRef"
        node={node}
      />
      <div className="pb-1 d-md-inline-flex">
        <Field
          component={CheckboxField}
          disabled={!isEditMode}
          label="Show Header"
          name="showHeader"
        />
        <Field
          component={CheckboxField}
          disabled={!isEditMode}
          label="Show Border"
          name="showBorder"
        />
        <Field
          component={CheckboxField}
          disabled={!isEditMode}
          label="Include Latest Episode"
          name="includeLatestEpisode"
        />
        <Field
          component={CheckboxField}
          disabled={!isEditMode}
          label="Include Latest Promo"
          name="includeLatestPromo"
        />
      </div>
      <Field
        component={TextField}
        disabled={!get(formValues, 'showHeader')}
        label="Header Text"
        name="headerText"
        placeholder="Enter header text"
        readOnly={!isEditMode}
      />
      {hasThemeableMixin(type, node)
      && (
      <Field
        component={PicklistPickerField}
        isEditMode={isEditMode}
        label="Theme"
        name="theme"
        picklistId="showtimes-widget-themes"
      />
      )}
      <Field
        component={TextField}
        label="View All Text"
        name="viewAllText"
        placeholder="Enter view all text"
        readOnly={!isEditMode}
      />
      <Field
        component={TextField}
        label="View All URL"
        name="viewAllUrl"
        placeholder="Enter view all URL"
        readOnly={!isEditMode}
      />
      <Field
        component={TextField}
        label="Partner Text"
        name="partnerText"
        placeholder="Enter partner text"
        readOnly={!isEditMode}
      />
      <Field
        component={TextField}
        label="Partner URL"
        name="partnerUrl"
        placeholder="Enter partner URL"
        readOnly={!isEditMode}
      />
    </CardBody>
  </Card>
);

ShowtimesWidgetFields.propTypes = {
  formValues: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  type: PropTypes.string.isRequired,
};

ShowtimesWidgetFields.defaultProps = {
  formValues: null,
  isEditMode: false,
};

export default connect(selector)(ShowtimesWidgetFields);
